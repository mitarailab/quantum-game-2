const fs = require('fs')
const path = require('path')
const Module = require('module')
const assert = require('assert')
const root = path.resolve(__dirname, '..')
const ts = require(path.join(root, 'node_modules/typescript'))
const resolve = Module._resolveFilename
Module._resolveFilename = function (id, ...rest) {
  return resolve.call(this, id.startsWith('@/') ? path.join(root, 'src', id.slice(2)) : id, ...rest)
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
const { importLevel } = require(path.join(root, 'src/engine/model/level.ts'))
const { runSimulation } = require(path.join(root, 'src/engine/model/simulation.ts'))
const { goalsController } = require(path.join(root, 'src/engine/controller/goals.ts'))
const { Coord } = require(path.join(root, 'src/engine/model/coord.ts'))
const levels = require(path.join(root, 'src/assets/data/levels/classicLevels.json'))
const solutions = require('./fixtures/lab-open-day-solutions.json')
function counts(raw) {
  const c = {}
  for (const e of [...raw.tools, ...raw.grid.cells.map((x) => x.element)]) c[e] = (c[e] || 0) + 1
  return c
}
for (const solution of solutions) {
  const original = levels.find((x) => x.id === solution.id)
  assert.deepStrictEqual(solution.goals, original.goals)
  assert.deepStrictEqual(counts(solution), counts(original))
  assert.equal(solution.safetyThreshold ?? 0, original.safetyThreshold ?? 0)
  for (const c of original.grid.cells.filter((x) => x.frozen !== false)) {
    assert(solution.grid.cells.some((x) => JSON.stringify(x) === JSON.stringify(c)))
  }
  const level = importLevel(solution)
  const sim = runSimulation(level.board, 50)
  const absorptions = sim.upToFrameAbsorptions[sim.upToFrameAbsorptions.length - 1]
  assert.equal(goalsController({ absorptions: () => absorptions, level: () => level }).gameOutcome, 1,
    `No winning solution for repaired campaign level ${solution.id}`)
}
// The probability in level 20 is 0.2499999999999999, numerically equal to its 25% target.
const boundary = importLevel({
  grid: { cols: 2, rows: 1, cells: [
    { coord: { x: 0, y: 0 }, element: 'Detector' },
    { coord: { x: 1, y: 0 }, element: 'Mine' },
  ] },
  goals: [{ coord: { x: 0, y: 0 }, threshold: 0.25 }],
})
function outcome(detectorProbability, mineProbability) {
  return goalsController({ level: () => boundary, absorptions: () => new Map([
    [Coord.new(0, 0), detectorProbability], [Coord.new(1, 0), mineProbability],
  ]) }).gameOutcome
}
assert.equal(outcome(0.2499999999999999, 1e-16), 1)
assert.equal(outcome(0.249999, 0), 3)
assert.equal(outcome(0.25, 1e-6), 2)
console.log('Campaign solutions and probability boundaries passed.')
