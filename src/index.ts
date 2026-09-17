import type { App } from 'vue'
import VueAliPlayer from './VueAliPlayer.vue'
import { DEFAULT_SDK_CSS, DEFAULT_SDK_JS, loadAliplayerSdk } from './sdk'
import { injectStyle } from './style'

// 组件自带样式在运行时注入，无需使用者手动 import CSS
injectStyle()

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
