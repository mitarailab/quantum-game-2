const fs = require('fs')
const path = require('path')
const Module = require('module')
const assert = require('assert')
const root = path.resolve(__dirname, '..')
// The engine is tested directly. Browser locale and animation time are controlled here.
const locale = { value: 'ja' }
const animationCallbacks = []
const ts = require(path.join(root, 'node_modules/typescript'))
const resolve = Module._resolveFilename
Module._resolveFilename = function (id, ...rest) {
  return resolve.call(this, id.startsWith('@/') ? path.join(root, 'src', id.slice(2)) : id, ...rest)
}
const load = Module._load
Module._load = function (id, ...rest) {
  if (id === '@/i18n' || (id === './index' && rest[0]?.filename.endsWith('/i18n/game.ts'))) {
    return { i18n: { global: { locale } } }
  }
  if (id === '@/mixins') {
    return {
      useRaf: (callback) => animationCallbacks.push(callback),
      waitFor: () => Promise.resolve(),
      Easing: require(path.join(root, 'node_modules/@tweenjs/tween.js')).Easing,
    }
  }
  if (id === '@/store' && rest[0]?.filename.endsWith('/controller/playhead.ts')) {
    return { storeNamespace: () => ({ useGetter: () => require('vue').ref(200) }) }
  }
  return load.call(this, id, ...rest)
}
require.extensions['.ts'] = (mod, filename) => {
  const out = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: {
      target: ts.ScriptTarget.ES2019,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
    },
  }).outputText
  mod._compile(out, filename)
}
const { componentIds, componentGrid, interferometerGrid } = require(path.join(
  root,
  'src/learning/components.ts'
))
const { importLevel } = require(path.join(root, 'src/engine/model/level.ts'))
const { runSimulation } = require(path.join(root, 'src/engine/model/simulation.ts'))
const data = require(path.join(root, 'src/components/EncyclopediaPage/loadData.ts'))
for (const id of [...data.elementNameList, ...data.conceptNameList]) {
  const entry = data.getEntry(id)
  if (!entry.title || !entry.short || !entry.grids.length)
    throw new Error('Incomplete learning entry ' + id)
  if (/<img|https?:\/\//.test(entry.short + JSON.stringify(entry.sections)))
    throw new Error('External content in ' + id)
  for (const grid of entry.grids) {
    const level = importLevel({ grid })
    const sim = runSimulation(level.board, 24)
    if (!sim.frames.length) throw new Error('No simulation frames for ' + id)
  }
}

const { Coord } = require(path.join(root, 'src/engine/model/coord.ts'))
const { Elem } = require(path.join(root, 'src/engine/model/elem.ts'))
function output(grid, x, y) {
  const sim = runSimulation(importLevel({ grid }).board, 24)
  return sim.upToFrameAbsorptions[sim.upToFrameAbsorptions.length - 1].get(Coord.new(x, y)) ?? 0
}
function close(actual, expected) {
  assert(Math.abs(actual - expected) < 1e-10, `${actual} != ${expected}`)
}
close(output(componentGrid(Elem.Mirror), 2, 0), 1)
const turnedMirror = componentGrid(Elem.Mirror)
turnedMirror.cells.find((cell) => cell.element === 'Mirror').rotation = 135
close(output(turnedMirror, 2, 4), 1)
close(output(componentGrid(Elem.BeamSplitter), 2, 0), 0.5)
close(output(componentGrid(Elem.BeamSplitter), 4, 2), 0.5)
close(output(interferometerGrid, 5, 0), 0)
close(output(interferometerGrid, 6, 1), 1)
assert.equal(data.getEntry('mirror').title, '鏡')
locale.value = 'en'
assert.equal(data.getEntry('mirror').title, 'Mirror')
assert.equal(data.getEntry('mirror').elementName, 'Mirror')
assert.equal(data.hasEntry('missing-entry'), false)
const { gameText } = require(path.join(root, 'src/i18n/game.ts'))
locale.value = 'ja'
for (const level of require(path.join(root, 'src/assets/data/levels/classicLevels.json'))) {
  assert.notEqual(gameText(level.name), level.name, `Missing translation for ${level.name}`)
}

// Learning playback repeats without skipping the output frame; game playback still stops.
const { playheadController } = require(path.join(root, 'src/engine/controller/playhead.ts'))
const frames = runSimulation(importLevel({ grid: componentGrid(Elem.Mirror) }).board, 24).frames
const looping = playheadController({ frames: () => frames, loop: true })
const advanceLoop = animationCallbacks[animationCallbacks.length - 1]
looping.play({ interval: 600 })
advanceLoop(0)
advanceLoop((frames.length - 1) * 600)
assert.equal(looping.frameIndex, frames.length - 1)
assert.equal(looping.isPlaying, true)
advanceLoop(frames.length * 600)
assert.equal(looping.frameIndex, 0)
assert.equal(looping.isPlaying, true)
advanceLoop((frames.length + 1) * 600)
assert.equal(looping.frameIndex, 1)

const manual = playheadController({ frames: () => frames })
const advanceManual = animationCallbacks[animationCallbacks.length - 1]
manual.play({ interval: 600 })
advanceManual(0)
advanceManual((frames.length - 1) * 600)
assert.equal(manual.frameIndex, frames.length - 1)
assert.equal(manual.isPlaying, false)

const stationary = playheadController({ frames: () => [frames[0]], loop: true })
const advanceStationary = animationCallbacks[animationCallbacks.length - 1]
stationary.play()
advanceStationary(0)
assert.equal(stationary.isPlaying, false)
console.log(
  'Learning simulations, loop playback, manual playback, locale switching and 36 level names passed.'
)
