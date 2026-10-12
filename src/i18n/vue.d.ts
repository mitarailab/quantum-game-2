import { gameText } from './game'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $gameText: typeof gameText
  }
}
