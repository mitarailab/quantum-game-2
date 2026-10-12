// Reuse the direct engine/TypeScript loader; no browser, Firebase or external writes.
require('./check-learning.cjs')
const assert = require('assert')
const fs = require('fs')
const path = require('path')
const Module = require('module')
const vue = require('vue')
const vueRouter = require('vue-router')
const compiler = require('@vue/compiler-sfc')
const ts = require('typescript')
const root = path.resolve(__dirname, '..')
const route = vue.reactive({ params: { entry: 'mirror' }, query: {}, path: '/info/mirror' })
const redirects = []
const watchStops = []
const load = Module._load
Module._load = function (id, ...rest) {
  if (id.endsWith('.svg?inline')) return {}
  if (id === '@/mixins/event') return { useWindowEvent: () => {} }
  if (id === 'vue-router') {
    return {
      ...vueRouter,
      createWebHistory: vueRouter.createMemoryHistory,
      useRoute: () => route,
      useRouter: () => ({ push: (destination) => redirects.push(destination) }),
    }
  }
  if (id === '@/store') {
    return {
      storeNamespace: () => ({
        useGetter: (name) => vue.ref(name === 'userName' ? 'Navigation Test' : []),
        useAction: () => () => {},
      }),
    }
  }
  if (id === 'vue')
    return {
      ...vue,
      resolveComponent: (name) => name,
      watchEffect: (...args) => {
        const stop = vue.watchEffect(...args)
        watchStops.push(stop)
        return stop
      },
    }
  return load.call(this, id, ...rest)
}
require.extensions['.vue'] = (mod) => {
  mod.exports = {}
}
function compile(source, filename) {
  const mod = new Module(filename, module)
  mod.filename = filename
  mod.paths = Module._nodeModulePaths(path.dirname(filename))
  mod._compile(
    ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
    }).outputText,
    filename
  )
  return mod.exports
}
function component(relativePath) {
  const filename = path.join(root, relativePath)
  const { descriptor } = compiler.parse(fs.readFileSync(filename, 'utf8'))
  const options = compile(descriptor.script.content, filename).default
  const template = compiler.compileTemplate({
    source: descriptor.template.content,
    filename,
    id: 'navigation-test',
  })
  assert.equal(template.errors.length, 0)
  options.render = compile(template.code, filename).render
  return options
}

async function main() {
  const router = require('../src/router/index.ts').default
  const learning = require('../src/components/EncyclopediaPage/loadData.ts')
  const pieces = require('../src/learning/components.ts')
  const levels = require('../src/assets/data/levels/index.ts')
  const talks = require('../src/assets/data/rock_talk/rock_talk.json')
  const destinations = new Set([
    '/',
    '/levels',
    '/lab',
    '/info',
    '/options',
    '/login',
    '/register',
    '/myaccount',
    '/savedlevels',
  ])
  for (const [index, level] of levels.levels.entries()) {
    assert.equal(Number(level.id), index + 1, 'Stage links must match the campaign index')
    destinations.add(`/level/${level.id}`)
    assert(levels.campaignLevel(Number(level.id)))
    if (level.rockTalkId) assert(talks.some((talk) => talk.id === level.rockTalkId))
  }
  for (const id of [...learning.elementNameList, ...learning.conceptNameList]) {
    assert(learning.hasEntry(id))
    destinations.add(`/info/${id}`)
  }
  for (const [id, type] of Object.entries(pieces.componentIds)) {
    assert.equal(
      pieces.componentId(type),
      id,
      'Game information links must reach the same component'
    )
  }
  for (const talk of talks) {
    destinations.add(`/rocks/${talk.id}`)
    if (talk.link && !talk.link.includes('://')) assert(learning.hasEntry(talk.link))
  }
  function scan(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const filename = path.join(directory, entry.name)
      if (entry.isDirectory()) scan(filename)
      else if (filename.endsWith('.vue')) {
        const source = fs.readFileSync(filename, 'utf8').replace(/<!--[\s\S]*?-->/g, '')
        for (const match of source.matchAll(/<router-link\b[^>]*\sto="(\/[^"$]*)"/g))
          destinations.add(match[1])
      }
    }
  }
  scan(path.join(root, 'src/components'))
  for (const destination of destinations) {
    const resolved = router.resolve(destination)
    assert(resolved.matched.length > 0 && resolved.name !== '404', `Broken route: ${destination}`)
  }

  // Exercise the real article watcher across every entry and every top-level destination.
  const article = component('src/components/EncyclopediaPage/EncyclopediaArticle.vue')
  const state = article.setup({}, {})
  for (const id of [...learning.elementNameList, ...learning.conceptNameList]) {
    route.params = { entry: id }
    await vue.nextTick()
    assert.equal(state.entry.value.title, learning.getEntry(id).title)
    for (const destination of ['/', '/info', '/levels', '/lab', '/options', '/login']) {
      route.path = destination
      route.params = {}
      await vue.nextTick()
      assert.equal(redirects.length, 0, `Leaving ${id} for ${destination} triggered a redirect`)
      route.params = { entry: id }
      await vue.nextTick()
    }
  }
  route.params = { entry: 'missing-entry' }
  await vue.nextTick()
  assert.deepEqual(redirects, [{ name: '404' }], 'Unknown articles still need a 404')
  watchStops.forEach((stop) => stop())

  // Lab levels have no campaign URL. Menus must never render a null router-link.
  for (const name of ['AppMenu', 'AppMenuButton']) {
    const options = component(`src/components/${name}.vue`)
    for (const currentLevel of [
      null,
      { kind: levels.LevelKind.Lab },
      { kind: levels.LevelKind.Campaign, index: 1 },
    ]) {
      const context = {
        appMenuOpened: true,
        currentLevel,
        campaignLink: levels.campaignLink,
        isLoggedIn: false,
        $gameText: (text) => text,
        $flags: { altMenu: false },
        style: {},
        toggleMenu: () => {},
      }
      const checkLinks = (node) => {
        if (!node || typeof node !== 'object') return
        if (Array.isArray(node)) return node.forEach(checkLinks)
        if (node.type === 'router-link') {
          assert.equal(typeof node.props.to, 'string', `${name} generated a null link`)
          assert.notEqual(router.resolve(node.props.to).name, '404')
        }
        if (Array.isArray(node.children)) node.children.forEach(checkLinks)
        else if (node.children && typeof node.children === 'object') {
          for (const child of Object.values(node.children))
            if (typeof child === 'function') checkLinks(child())
        }
      }
      checkLinks(options.render(context, []))
    }
  }

  // Render compiled account/login templates and their slots with real setup bindings.
  for (const page of ['MyAccountPage', 'SavedLevelsPage', 'LoginPage', 'RegisterPage']) {
    const options = component(`src/components/${page}/index.vue`)
    const bindings = vue.proxyRefs(options.setup({}, {}))
    const context = new Proxy(bindings, {
      get(target, name) {
        if (name in target || typeof name === 'symbol') return target[name]
        throw new Error(`${page} template refers to a missing setup binding: ${name}`)
      },
    })
    const visit = (node) => {
      if (!node || typeof node !== 'object') return
      if (Array.isArray(node)) return node.forEach(visit)
      if (Array.isArray(node.children)) node.children.forEach(visit)
      else if (node.children && typeof node.children === 'object') {
        for (const child of Object.values(node.children))
          if (typeof child === 'function') visit(child())
      }
    }
    visit(options.render(context, []))
  }
  console.log(
    `${destinations.size} routes, 24 article exits, component/dialogue links and 4 account templates passed.`
  )
}
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
