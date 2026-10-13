// Build notices from the modules in the actual webpack distribution, not npm metadata alone.
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const assert = require('assert')
const root = path.resolve(__dirname, '..')
const output = path.resolve(process.argv[2] || path.join(root, 'dist'))
const reportFile = path.join(output, 'report.json')
const report = JSON.parse(fs.readFileSync(reportFile, 'utf8'))
const supplemental = path.join(root, 'docs/licenses/supplemental')
const sources = JSON.parse(fs.readFileSync(path.join(supplemental, 'sources.json'), 'utf8'))
for (const source of sources) {
  const digest = crypto
    .createHash('sha256')
    .update(fs.readFileSync(path.join(supplemental, source.file)))
    .digest('hex')
  assert.equal(digest, source.sha256, `Changed license text: ${source.file}`)
}
const packageRoots = new Set()
const resources = new Set()
function visit(node) {
  for (const item of node.modules || []) {
    const identifier = (item.identifier || item.name || '').split('!').pop()
    resources.add(identifier)
    const expression = /((?:[^!|\s]+\/)?node_modules\/(?:@[^/\s!]+\/)?[^/\s!]+)(?:\/|$)/g
    for (const match of identifier.matchAll(expression)) {
      const directory = path.resolve(root, match[1])
      if (fs.existsSync(path.join(directory, 'package.json')))
        packageRoots.add(fs.realpathSync(directory))
    }
    visit(item)
  }
  for (const child of node.children || []) visit(child)
}
visit(report)
assert(packageRoots.size > 15, 'Webpack module inventory is missing')
const forbidden = /(?:qg-encyclopedia|assets\/faces|data\/encyclopedia|QG_logo|CQT_NUS_Logo|config\/firebase)/
assert(
  ![...resources].some((resource) => forbidden.test(resource)),
  'Excluded content entered the bundle'
)
const fallbacks = {
  'vue@3.0.0': 'vue-3.0.0.txt',
  '@vue/shared@3.0.0': 'vue-3.0.0.txt',
  'bra-ket-vue@0.4.2': 'bra-ket-vue-0.4.2.txt',
  'quantum-tensors@0.4.13': 'quantum-tensors-0.4.13.txt',
}
const records = []
const sections = []
const seen = new Set()
for (const directory of [...packageRoots].sort()) {
  const pkg = JSON.parse(fs.readFileSync(path.join(directory, 'package.json'), 'utf8'))
  const key = `${pkg.name}@${pkg.version}`
  if (seen.has(key)) continue
  seen.add(key)
  assert(
    [
      'MIT',
      'BSD-3-Clause',
      'BSD-2-Clause',
      'ISC',
      '0BSD',
      'Apache-2.0',
      '(CC-BY-4.0 AND OFL-1.1 AND MIT)',
    ].includes(pkg.license),
    `Review the license conditions before publishing: ${key} (${pkg.license})`
  )
  assert(!pkg.name.startsWith('firebase'), 'Upstream cloud backend entered the distribution')
  const files = fs
    .readdirSync(directory)
    .filter(
      (file) =>
        /^(?:licen[cs]e|copying|copyright|notice)(?:\.|$|-)/i.test(file) &&
        fs.statSync(path.join(directory, file)).isFile()
    )
  const texts = files.map(
    (file) => `${file}\n${fs.readFileSync(path.join(directory, file), 'utf8')}`
  )
  if (!files.some((file) => /^(?:licen[cs]e|copying)(?:\.|$|-)/i.test(file))) {
    assert(fallbacks[key], `License text missing: ${key}`)
    texts.push(fs.readFileSync(path.join(supplemental, fallbacks[key]), 'utf8'))
  }
  records.push({
    name: pkg.name,
    version: pkg.version,
    license: pkg.license,
    files,
    supplemental: fallbacks[key] || null,
  })
  sections.push(`${key}\nDeclared license: ${JSON.stringify(pkg.license)}\n${texts.join('\n\n')}`)
}
records.sort((a, b) => `${a.name}@${a.version}`.localeCompare(`${b.name}@${b.version}`))
for (const file of [
  'feather-4.28.0.txt',
  'quantum-game-original.txt',
  'OFL-1.1.txt',
  'CC-BY-4.0.txt',
]) {
  sections.push(
    `${file}\nSource: ${sources.find((item) => item.file === file).source}\n${fs.readFileSync(
      path.join(supplemental, file),
      'utf8'
    )}`
  )
}
const mit = fs.readFileSync(path.join(root, 'LICENSE'), 'utf8')
sections.push(
  'Font Awesome Free 5.15.1 by @fontawesome\nCopyright (c) Font Awesome (retained in the distributed font metadata).\nMIT terms for its code:\n' +
    mit.slice(mit.indexOf('Permission is hereby granted'))
)
fs.writeFileSync(
  path.join(output, 'THIRD_PARTY_LICENSES.txt'),
  'Third-party distribution licenses\n\n' + sections.join('\n\n' + '='.repeat(72) + '\n\n')
)
fs.copyFileSync(
  path.join(root, 'THIRD_PARTY_NOTICES.md'),
  path.join(output, 'THIRD_PARTY_NOTICES.txt')
)
fs.writeFileSync(
  path.join(output, 'THIRD_PARTY_LICENSES.json'),
  JSON.stringify({ packages: records, supplemental_sources: sources }, null, 2) + '\n'
)
assert.equal(
  fs.readFileSync(path.join(output, 'LICENSE.txt'), 'utf8'),
  mit,
  'Core MIT license changed'
)
assert(
  !fs.existsSync(path.join(output, 'service-worker.js')),
  'Legacy offline cache entered the release'
)
fs.unlinkSync(reportFile)
console.log(
  `${records.length} package versions: license texts and notices included; excluded media/backend absent.`
)
