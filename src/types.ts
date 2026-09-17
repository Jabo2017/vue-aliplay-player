/** Aliplayer 实例的最小接口（仅覆盖本组件用到的方法） */
export interface AliplayerInstance {
  play(): void
  pause(): void
  replay(): void
  seek(time: number): void
  getCurrentTime(): number
  getDuration(): number
  getVolume(): number
  setVolume(vol: number): void
  setSpeed(speed: number): void
  setPlayerSize(w: number | string, h: number | string): void
  setCover(coverUrl: string): void
  loadByUrl(url: string, time?: number): void
  reloaduserPlayInfoAndVidRequestMts(vid: string, playauth: string): void
  getStatus(): string
  dispose(): void
  on(event: string, cb: (payload?: unknown) => void): void
  off(event: string, cb: (payload?: unknown) => void): void
  fullscreenService: {
    getIsFullScreen(): boolean
    requestFullScreen(): void
    cancelFullScreen(): void
  }
}

export type AliplayerConstructor = new (
  options: AliplayerOptions,
  ready?: (player: AliplayerInstance) => void,
) => AliplayerInstance

/** Aliplayer 初始化参数（SDK 官方字段 + 本组件透传的自定义字段），宽松处理 */
export type AliplayerOptions = Record<string, unknown> & {
  id: string
}

/** 播放器缩放方式 */
export type Stretching = 'none' | 'uniform' | 'exactfit' | 'fill' | (string & {})

/** 截图水印配置 */
export interface SnapshotWatermark {
  left?: string
  top?: string
  text?: string
  font?: string
  strokeColor?: string
  fillColor?: string
}

/** 页面水印配置 */
export interface Watermark {
  isShow: boolean
  text: string
  width: number
  height: number
  angle: number
  size: number
  color: string
  position: string
  repeat: string
}

/** Aliplayer License 配置（2.28.0+ 版本需要） */
export interface LicenseConfig {
  [key: string]: unknown
}
