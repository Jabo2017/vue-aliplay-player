import type { AliplayerConstructor } from './types'

declare global {
  interface Window {
    Aliplayer?: AliplayerConstructor
  }
}

/** 默认 SDK：2.27.1 为 2.28.0（License 强制校验）之前最后一个免 License 版本 */
export const DEFAULT_SDK_JS =
  'https://g.alicdn.com/apsara-media-box/imp-web-player/2.27.1/aliplayer-min.js'
export const DEFAULT_SDK_CSS =
  'https://g.alicdn.com/apsara-media-box/imp-web-player/2.27.1/skins/default/aliplayer-min.css'

const SCRIPT_ID = 'vue-aliplay-player-sdk'
const CSS_ATTR = 'data-vap-css'

const pending = new Map<string, Promise<void>>()

function injectCss(cssUrl: string): void {
  if (!cssUrl) return
  const exist = document.querySelector<HTMLLinkElement>(`link[${CSS_ATTR}]`)
  if (exist) {
    if (exist.href !== cssUrl) exist.href = cssUrl
    return
  }
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = cssUrl
  link.setAttribute(CSS_ATTR, '')
  document.head.appendChild(link)
}

/**
 * 懒加载 Aliplayer SDK（同 url 并发共享一个 Promise，加载完成直接 resolve）。
 * 页面上已存在 window.Aliplayer（用户自己引了脚本或 npm 引入）时直接返回。
 */
export function loadAliplayerSdk(jsUrl: string, cssUrl: string): Promise<void> {
  if (window.Aliplayer) return Promise.resolve()

  const cached = pending.get(jsUrl)
  if (cached) return cached

  injectCss(cssUrl)

  const task = new Promise<void>((resolve, reject) => {
    const exist = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
    if (exist && window.Aliplayer) {
      resolve()
      return
    }
    const script = exist ?? document.createElement('script')
    if (!exist) {
      script.id = SCRIPT_ID
      script.type = 'text/javascript'
      script.charset = 'utf-8'
      script.src = jsUrl
      document.head.appendChild(script)
    }
    script.addEventListener('load', () => resolve(), { once: true })
    script.addEventListener('error', () => reject(new Error(`Aliplayer SDK 加载失败: ${jsUrl}`)), {
      once: true,
    })
  })

  pending.set(jsUrl, task)
  return task
}
