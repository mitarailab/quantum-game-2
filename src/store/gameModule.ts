import { LevelId } from '@/assets/data/levels'
import { storeModule } from './storeInterfaces'
import { readCompletedLevels, recordCompletedLevel } from './localProgress'

interface GameState {
  currentLevelID: LevelId | null // check
  appMenuOpened: boolean
  errors: string[]
  completedLevels: number[]
}

export default storeModule({
  namespaced: true,
  state: {
    currentLevelID: null,
    appMenuOpened: false,
    errors: [],
    completedLevels: readCompletedLevels(),
  } as GameState,
  mutations: {
    COMPLETE_LEVEL(state, id: number) {
      state.completedLevels = recordCompletedLevel(state.completedLevels, id)
    },
    SYNC_COMPLETED_LEVELS(state) {
      state.completedLevels = readCompletedLevels()
    },
    // hovered cell functional
    SET_CURRENT_LEVEL_ID(state, id: LevelId | null) {
      state.currentLevelID = id
    },
    // errors handling
    SET_ERROR(state, error: string) {
      state.errors = [...state.errors, error]
    },
    RESET_ERRORS(state) {
      state.errors = []
    },
    SET_MENU_OPENED(state, opened: boolean) {
      state.appMenuOpened = opened
    },
  },
})
