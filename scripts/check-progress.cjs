require('./check-learning.cjs')
const assert = require('assert')
const {
  readCompletedLevels,
  recordCompletedLevel,
  PROGRESS_STORAGE_KEY,
} = require('../src/store/localProgress.ts')

const data = new Map()
let writes = 0
const storage = {
  getItem: (key) => data.get(key) ?? null,
  setItem: (key, value) => {
    data.set(key, value)
    writes += 1
  },
}
assert.deepEqual(readCompletedLevels(storage), [])
assert.deepEqual(recordCompletedLevel([], 1, storage), [1])
assert.deepEqual(readCompletedLevels(storage), [1])
const firstWriteCount = writes
assert.deepEqual(recordCompletedLevel([1], 1, storage), [1])
assert.equal(writes, firstWriteCount, 'Replaying a cleared level should not rewrite progress')
assert.deepEqual(recordCompletedLevel([], 2, storage), [1, 2], 'A stale tab must keep other clears')
assert.deepEqual(recordCompletedLevel([1, 2], 9999, storage), [1, 2])
assert.equal(JSON.parse(storage.getItem(PROGRESS_STORAGE_KEY)).version, 1)

for (const invalid of ['not JSON', 'null', '[]', '{}', '{"version":2,"completedLevels":[1]}']) {
  data.set(PROGRESS_STORAGE_KEY, invalid)
  assert.deepEqual(readCompletedLevels(storage), [])
}
data.set(
  PROGRESS_STORAGE_KEY,
  JSON.stringify({ version: 1, completedLevels: [2, 1, 2, '3', -1, 1.5, 9999, null] })
)
assert.deepEqual(readCompletedLevels(storage), [1, 2])
const blockedStorage = {
  getItem: () => {
    throw new Error('blocked')
  },
  setItem: () => {
    throw new Error('quota')
  },
}
assert.deepEqual(readCompletedLevels(blockedStorage), [])
assert.deepEqual(
  recordCompletedLevel([], 1, blockedStorage),
  [1],
  'Blocked storage must not stop the game'
)
assert.deepEqual(recordCompletedLevel([], 1, null), [1])

// Exercise the real Vuex mutations and reload the module as on a fresh page load.
data.clear()
global.window = { localStorage: storage }
const modulePath = require.resolve('../src/store/gameModule.ts')
const game = require(modulePath).default
assert.deepEqual(game.state.completedLevels, [])
game.mutations.COMPLETE_LEVEL(game.state, 1)
game.mutations.COMPLETE_LEVEL(game.state, 2)
delete require.cache[modulePath]
assert.deepEqual(require(modulePath).default.state.completedLevels, [1, 2])
recordCompletedLevel([1, 2], 3, storage)
game.mutations.SYNC_COMPLETED_LEVELS(game.state)
assert.deepEqual(game.state.completedLevels, [1, 2, 3])
data.clear()
game.mutations.SYNC_COMPLETED_LEVELS(game.state)
assert.deepEqual(game.state.completedLevels, [])
global.window = {
  get localStorage() {
    throw new Error('Browser storage access denied')
  },
}
assert.deepEqual(readCompletedLevels(), [])
assert.deepEqual(recordCompletedLevel([1], 2), [1, 2])
delete global.window
console.log(
  'Progress persistence, reload, tab merging, validation, replay and blocked storage passed.'
)
