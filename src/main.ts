// required for vue-property-decorator
import { createApp } from 'vue'
import router from './router'
import { store } from './store/store'
import { i18n } from './i18n'
import { gameTranslationPlugin } from './i18n/game'
import { flagsPlugin } from './flags'
import App from './App.vue'

import 'bra-ket-vue/dist/bra-ket-vue.css'

createApp(App)
  .use(router)
  // FIXME: vue3 support soon: https://github.com/MatteoGabriele/vue-gtag/issues/168#issuecomment-684498923
  // .use(VueGtag, {
  //   config: { id: 'UA-56225776-1' },
  // })
  .use(i18n)
  .use(gameTranslationPlugin)
  .use(store)
  .use(flagsPlugin)
  .mount('#app')
