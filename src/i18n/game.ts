import { Plugin } from 'vue'
import { i18n } from './index'
import japanese from './game-ja.json'

// Translate display text only. Identifiers in levels, URLs and exported JSON stay unchanged.
export function gameText(text: string): string {
  return i18n.global.locale.value === 'ja'
    ? (japanese as Record<string, string>)[text] ?? text
    : text
}

export const gameTranslationPlugin: Plugin = {
  install(app) {
    app.config.globalProperties.$gameText = gameText
  },
}
