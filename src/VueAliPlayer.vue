<template>
  <div class="prism-player-wrap" :class="stretching">
    <div :id="playerId" class="prism-player" :style="playStyle" />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { DEFAULT_SDK_CSS, DEFAULT_SDK_JS, loadAliplayerSdk } from './sdk'
import type {
  AliplayerConstructor,
  AliplayerInstance,
  AliplayerOptions,
  LicenseConfig,
  SnapshotWatermark,
  Stretching,
  Watermark,
} from './types'

/** Aliplayer 实例事件 → 组件 emit，事件名保持与 3.x 一致 */
const EVENTS = [
  'ready',
  'playing',
  'play',
  'pause',
  'ended',
  'liveStreamStop',
  'm3u8Retry',
  'hideBar',
  'waiting',
  'snapshoted',
  'timeupdate',
  'requestFullScreen',
  'cancelFullScreen',
  'error',
  'startSeek',
  'completeSeek',
] as const

const props = withDefaults(
  defineProps<{
    /** SDK js 地址。默认 2.27.1（免 License 的最后版本）；已购 License 可指向 2.28+ 并配 license */
    sdkUrl?: string
    /** SDK 皮肤 css 地址 */
    sdkCssUrl?: string
    /** 直接注入 Aliplayer 构造器（npm 安装 aliyun-aliplayer 的用户），跳过 CDN 加载 */
    aliplayer?: AliplayerConstructor | null
    /** License 配置（2.28.0+ SDK 必需），会合并进初始化参数 */
    license?: LicenseConfig | null
    /** 指定播放类型：flv / mp / m3u8，默认根据 url 后缀推断 */
    defaultFormat?: string
    /** 缩放方式：none / uniform / exactfit / fill */
    stretching?: Stretching
    /** 播放器内联样式 */
    playStyle?: string
    autoplay?: boolean
    rePlay?: boolean
    preload?: boolean
    isLive?: boolean
    playsinline?: boolean
    width?: string
    height?: string
    controlBarVisibility?: 'click' | 'hover' | 'always'
    useH5Prism?: boolean
    useFlashPrism?: boolean
    snapshot?: boolean
    /** 媒体转码服务的媒体 ID（vid + playauth 模式） */
    vid?: string
    /** 播放凭证（vid + playauth 模式） */
    playauth?: string
    /** 播放地址，支持多清晰度 JSON：'{"HD":"...","SD":"..."}'，优先级高于 vid+playauth */
    source?: string
    /** 封面图（autoplay=false 时生效） */
    cover?: string
    showBuffer?: boolean
    /** H5 播 flv 直播时是否启用缓存 */
    enableStashBufferForFlv?: boolean
    /** 指定播放地址格式（仅 vid 模式支持）：mp4 / m3u8 / flv / mp3 */
    format?: string
    /** H5 设置截图水印 */
    snapshotWatermark?: SnapshotWatermark
    /** 页面水印 */
    watermark?: Watermark
    /** 声明视频播在界面上的位置：top / center */
    x5_video_position?: string
    /** 启用同层 H5 播放器时传 'h5' */
    x5_type?: string
    x5_fullscreen?: boolean
    /** 额外信息（如 x5-playsinline） */
    extraInfo?: Record<string, unknown>
    /** 延迟播放秒数 */
    autoPlayDelay?: number
    autoPlayDelayDisplayText?: string
    /** 最大缓冲超时秒数 */
    waitingTimeout?: number
    useHlsPluginForSafari?: boolean
    /** 是否开启双击全屏 */
    fullAble?: boolean
    /** 是否隐藏倍速菜单 */
    speedAble?: boolean
  }>(),
  {
    sdkUrl: DEFAULT_SDK_JS,
    sdkCssUrl: DEFAULT_SDK_CSS,
    aliplayer: null,
    license: null,
    defaultFormat: '',
    stretching: 'fill',
    playStyle: '',
    autoplay: true,
    rePlay: false,
    preload: true,
    isLive: false,
    playsinline: true,
    width: '100%',
    height: '100%',
    controlBarVisibility: 'hover',
    useH5Prism: true,
    useFlashPrism: false,
    snapshot: true,
    vid: '',
    playauth: '',
    source: '',
    cover: '',
    showBuffer: true,
    enableStashBufferForFlv: true,
    format: '',
    snapshotWatermark: () => ({}),
    watermark: () => ({
      isShow: false,
      text: '',
      width: 400,
      height: 200,
      angle: 35,
      size: 16,
      color: 'rgba(255,255,255,.3)',
      position: 'top right',
      repeat: 'repeat',
    }),
    x5_video_position: 'center',
    x5_type: '',
    x5_fullscreen: false,
    extraInfo: () => ({}),
    autoPlayDelay: 0,
    autoPlayDelayDisplayText: '加载中...',
    waitingTimeout: 60,
    useHlsPluginForSafari: true,
    fullAble: true,
    speedAble: false,
  },
)

const emit = defineEmits<{
  (e: (typeof EVENTS)[number], instance: AliplayerInstance | null): void
}>()

const playerId = ref(`aliplayer_${Math.random().toString(36).slice(2)}`)
const instance = shallowRef<AliplayerInstance | null>(null)
let disposers: Array<() => void> = []
let initSeq = 0

function containerEl(): HTMLElement | null {
  return document.getElementById(playerId.value)
}

function videoEl(): HTMLVideoElement | null {
  return containerEl()?.querySelector('video') ?? null
}

function buildOptions(source: string): AliplayerOptions {
  const options: AliplayerOptions = {
    id: playerId.value,
    autoplay: props.autoplay,
    isLive: props.isLive,
    rePlay: props.rePlay,
    preload: props.preload,
    playsinline: props.playsinline,
    format: props.format,
    width: props.width,
    height: props.height,
    controlBarVisibility: props.controlBarVisibility,
    useH5Prism: props.useH5Prism,
    useFlashPrism: props.useFlashPrism,
    vid: props.vid,
    playauth: props.playauth,
    source,
    cover: props.cover,
    showBuffer: props.showBuffer,
    snapshot: props.snapshot,
    snapshotWatermark: props.snapshotWatermark,
    x5_video_position: props.x5_video_position,
    x5_type: props.x5_type,
    x5_fullscreen: props.x5_fullscreen,
    extraInfo: props.extraInfo,
    waitingTimeout: props.waitingTimeout,
    useHlsPluginForSafari: props.useHlsPluginForSafari,
    enableStashBufferForFlv: props.enableStashBufferForFlv,
    autoPlayDelay: props.autoPlayDelay,
    autoPlayDelayDisplayText: props.autoPlayDelayDisplayText,
  }
  if (props.license) options.license = props.license
  return options
}

/** 推断播放格式（决定 object-fit 等样式行为），优先 defaultFormat */
function detectFormat(source: string): string {
  if (props.defaultFormat) return props.defaultFormat
  const index = source.lastIndexOf('.')
  return index >= 0 ? source.slice(index + 1).toLowerCase() : ''
}

function createWatermark(): void {
  const wm = props.watermark
  const box = containerEl()
  if (!box || !wm.isShow || !wm.text) return

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = wm.width
  canvas.height = wm.height
  if (!ctx) return
  ctx.strokeStyle = 'transparent'
  ctx.rect(0, 0, canvas.width, canvas.height)
  ctx.rotate((wm.angle * Math.PI) / 180)
  ctx.save()
  ctx.fillStyle = wm.color
  ctx.font = `${wm.size}px Microsoft YaHei`
  ctx.fillText(wm.text, 20, 0)
  ctx.restore()
  ctx.stroke()

  const bg = document.createElement('div')
  bg.className = 'vap-watermark'
  bg.style.backgroundImage = `url(${canvas.toDataURL('image/png')})`
  if (wm.repeat === 'no-repeat') {
    bg.style.backgroundRepeat = 'no-repeat'
    bg.style.backgroundPosition = wm.position
  }
  box.appendChild(bg)
}

function bindDomHelpers(): void {
  const video = videoEl()
  if (video) {
    const togglePlay = () => {
      const status = instance.value?.getStatus()
      if (status === 'playing' || status === 'ready') pause()
      else if (status === 'pause') play()
    }
    video.addEventListener('click', togglePlay)
    disposers.push(() => video.removeEventListener('click', togglePlay))

    if (props.fullAble) {
      const toggleFull = () => {
        if (instance.value?.fullscreenService.getIsFullScreen()) cancelFull()
        else setFull()
      }
      video.addEventListener('dblclick', toggleFull)
      disposers.push(() => video.removeEventListener('dblclick', toggleFull))
    }
  }
  if (!props.speedAble) {
    const speed = containerEl()?.querySelector<HTMLElement>('.prism-setting-speed')
    if (speed) speed.style.display = 'none'
  }
}

async function init(sourceOverride?: string): Promise<void> {
  dispose()
  const seq = ++initSeq
  const source = sourceOverride ?? props.source

  // vid+playauth 与 source 两种模式至少要有其一
  if (!source && !props.vid) return

  await nextTick()
  if (seq !== initSeq) return // 已有更新的初始化请求，放弃本次

  let Player = props.aliplayer ?? window.Aliplayer
  if (!Player) {
    try {
      await loadAliplayerSdk(props.sdkUrl, props.sdkCssUrl)
    } catch (err) {
      console.error('[vue-aliplay-player]', err)
      emit('error', null)
      return
    }
    Player = window.Aliplayer
  }
  if (!Player || seq !== initSeq) return

  const player = new Player(buildOptions(source), () => {
    if (seq !== initSeq) return
    bindDomHelpers()
    if (props.watermark.isShow) createWatermark()
  })
  instance.value = player

  for (const evt of EVENTS) {
    const handler = () => emit(evt, player)
    player.on(evt, handler)
    disposers.push(() => player.off(evt, handler))
  }
}

/** 销毁播放器实例并解绑所有监听 */
function dispose(): void {
  initSeq++
  for (const fn of disposers) {
    try {
      fn()
    } catch {
      /* 忽略解绑时的 DOM 异常 */
    }
  }
  disposers = []
  if (instance.value) {
    try {
      instance.value.pause()
      instance.value.dispose()
    } catch {
      /* 播放器可能已自行销毁 */
    }
    instance.value = null
  }
}

// ---------- 对外方法（defineExpose） ----------
function play(): void {
  instance.value?.play()
}
function pause(): void {
  instance.value?.pause()
}
function replay(): void {
  instance.value?.replay()
}
function getStatus(): string | null {
  return instance.value?.getStatus() ?? null
}
function seek(time: number): void {
  instance.value?.seek(time)
}
function getCurrentTime(): number | null {
  return instance.value?.getCurrentTime() ?? null
}
function getDuration(): number | null {
  return instance.value?.getDuration() ?? null
}
function getVolume(): number | null {
  return instance.value?.getVolume() ?? null
}
function setVolume(vol: number): void {
  instance.value?.setVolume(vol)
}
function setSpeed(speed: number): void {
  instance.value?.setSpeed(speed)
}
function setPlayerSize(w: number | string, h: number | string): void {
  instance.value?.setPlayerSize(w, h)
}
function setCover(coverUrl: string): void {
  instance.value?.setCover(coverUrl)
}
function loadByUrl(url: string, time?: number): void {
  if (instance.value) instance.value.loadByUrl(url, time)
  else void init(url)
}
function reloadPlayer(url?: string): void {
  void init(url)
}
function reloaduserPlayInfoAndVidRequestMts(vid: string, playauth: string): void {
  instance.value?.reloaduserPlayInfoAndVidRequestMts(vid, playauth)
}
function getFullStatus(): boolean {
  return instance.value?.fullscreenService.getIsFullScreen() ?? false
}
function setFull(): void {
  instance.value?.fullscreenService.requestFullScreen()
}
function cancelFull(): void {
  instance.value?.fullscreenService.cancelFullScreen()
}

defineExpose({
  play,
  pause,
  replay,
  seek,
  getCurrentTime,
  getDuration,
  getVolume,
  setVolume,
  setSpeed,
  setPlayerSize,
  setCover,
  loadByUrl,
  reloadPlayer,
  reloaduserPlayInfoAndVidRequestMts,
  getStatus,
  getFullStatus,
  setFull,
  cancelFull,
  dispose,
})

watch(
  () => props.source,
  (next, prev) => {
    if (next && next !== prev) void init(next)
  },
)

onMounted(() => {
  void init()
})

onBeforeUnmount(() => {
  dispose()
})
</script>

<style>
.prism-player-wrap {
  position: relative;
  width: 100%;
  height: 100%;
}
.prism-player-wrap video {
  object-fit: fill;
}
.prism-player-wrap.exactfit video {
  object-fit: cover;
}
.prism-player-wrap.none video {
  object-fit: none;
}
.prism-player-wrap.uniform video {
  object-fit: contain;
}
.prism-player-wrap .prism-big-play-btn {
  left: 50% !important;
  bottom: 50% !important;
  transform: translate(-32px, 32px);
}
.vap-watermark {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
</style>
