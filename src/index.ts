import type { App } from 'vue'
import VueAliPlayer from './VueAliPlayer.vue'
import { DEFAULT_SDK_CSS, DEFAULT_SDK_JS, loadAliplayerSdk } from './sdk'

export default VueAliPlayer
export { VueAliPlayer, DEFAULT_SDK_JS, DEFAULT_SDK_CSS, loadAliplayerSdk }
export type {
  AliplayerConstructor,
  AliplayerInstance,
  AliplayerOptions,
  LicenseConfig,
  SnapshotWatermark,
  Stretching,
  Watermark,
} from './types'

/** 全局安装：app.use(VueAliPlayer) 后可用 <vue-ali-play-player /> */
VueAliPlayer.install = (app: App): void => {
  app.component('VueAliPlayer', VueAliPlayer)
  app.component('vue-ali-play-player', VueAliPlayer)
}
