# vue-aliplay-player

阿里云 [Aliplayer](https://help.aliyun.com/document_detail/125570.html) 的 **Vue 3** 播放器组件封装。TypeScript 全类型、SDK CDN 懒加载（零依赖打包）、支持点播 / 直播 / vid+playauth / 截图水印 / License 接入。

> **Vue 2 项目请使用 [3.x 版本](https://github.com/Jabo2017/vue-aliplay-player/tree/3.x)**（`npm i vue-aliplay-player@3`）。

## 在线演示

https://jabo2017.github.io/vue-aliplay-player/

## 特性

- 🎯 **TypeScript 全类型**：props / emits / 暴露方法均有 `.d.ts`
- 🪶 **零依赖打包**：Aliplayer SDK 按需 CDN 懒加载（默认 2.27.1，免 License 的最后版本），产物 gzip 仅 ~3KB
- 🔌 **双模式**：默认 CDN 懒加载；也可 npm 安装 `aliyun-aliplayer` 后通过 `aliplayer` prop 注入构造器（SSR / 严格 CSP 友好）
- 📄 **License 就绪**：已购阿里云播放器 License？配 `license` prop + 指向 2.28+ SDK 地址即可
- 🔔 **事件全转发**：ready / playing / pause / ended / error / timeupdate 等 16 个事件，事件名与 3.x 一致
- 🎨 **样式自动注入**：容器 / 缩放 / 水印样式随组件注入，无需手动引 CSS
- 🧪 **vitest 8 例单测**覆盖初始化、参数透传、事件转发、销毁重建

## 安装

```bash
npm install vue-aliplay-player
```

`vue`（^3.2）为 peer dependency。

组件自带样式（容器布局 / 缩放模式 / 水印层）在引入时自动注入，**无需额外 `import` CSS 文件**。

## 快速上手

```vue
<script setup lang="ts">
import { ref } from 'vue'
import VueAliPlayer from 'vue-aliplay-player'
import type { AliplayerInstance } from 'vue-aliplay-player'

const playerRef = ref<InstanceType<typeof VueAliPlayer>>()
const source = 'https://player.alicdn.com/video/aliyunmedia.mp4'

function onReady(inst: AliplayerInstance | null) {
  inst?.play()
}
</script>

<template>
  <div style="width: 640px; aspect-ratio: 16/9">
    <VueAliPlayer ref="playerRef" :source="source" @ready="onReady" />
  </div>
</template>
```

全局注册：

```ts
import VueAliPlayer from 'vue-aliplay-player'
app.use(VueAliPlayer) // <vue-ali-play-player /> 或 <VueAliPlayer />
```

## Props（与 3.x 同名兼容）

| Prop | 类型 | 默认 | 说明 |
|---|---|---|---|
| `source` | `string` | `''` | 播放地址，支持多清晰度 `'{"HD":"...","SD":"..."}'`，优先级高于 vid+playauth；变化时自动重建 |
| `sdkUrl` | `string` | 2.27.1 | Aliplayer SDK js 地址，可指向 2.39 等新版 |
| `sdkCssUrl` | `string` | 2.27.1 | SDK 皮肤 css 地址 |
| `aliplayer` | `AliplayerConstructor` | `null` | 直接注入构造器（npm 模式），跳过 CDN |
| `license` | `object` | `null` | License 配置（SDK ≥2.28 必需），合并进初始化参数 |
| `autoplay` | `boolean` | `true` | 自动播放（浏览器策略可能拦截） |
| `isLive` | `boolean` | `false` | 直播模式 |
| `vid` / `playauth` | `string` | `''` | 阿里云点播 vid+playauth 模式 |
| `stretching` | `string` | `'fill'` | 缩放：none / uniform / exactfit / fill |
| `cover` | `string` | `''` | 封面图（autoplay=false 生效） |
| `width` / `height` | `string` | `'100%'` | 播放器尺寸 |
| `snapshot` | `boolean` | `true` | 截图按钮 |
| `watermark` | `Watermark` | 不显示 | 页面水印（canvas 生成） |
| `fullAble` / `speedAble` | `boolean` | `true` / `false` | 双击全屏 / 隐藏倍速菜单 |

其余 Aliplayer 参数（`rePlay`、`preload`、`playsinline`、`controlBarVisibility`、`x5_*`、`autoPlayDelay`、`waitingTimeout` 等）与 3.x 同名透传，见[类型定义](./src/types.ts)。

## 事件

`ready` `play` `playing` `pause` `ended` `waiting` `error` `timeupdate` `liveStreamStop` `m3u8Retry` `hideBar` `snapshoted` `requestFullScreen` `cancelFullScreen` `startSeek` `completeSeek`

payload 均为 Aliplayer 实例。

## 暴露方法

`play` `pause` `replay` `seek(t)` `getCurrentTime` `getDuration` `getVolume` `setVolume(v)` `setSpeed(s)` `setPlayerSize(w,h)` `setCover(url)` `loadByUrl(url, t?)` `reloadPlayer(url?)` `reloaduserPlayInfoAndVidRequestMts(vid, playauth)` `getStatus` `getFullStatus` `setFull` `cancelFull` `dispose`

```ts
playerRef.value?.seek(30)
```

## License 说明

阿里云 Web 播放器 SDK 自 **2.28.0（2024-12）起强制校验 License**。本组件默认 SDK 为 2.27.1（最后一个免 License 版本）。已购 License 的接法：

```vue
<VueAliPlayer
  sdk-url="https://g.alicdn.com/apsara-media-box/imp-web-player/2.39.0/aliplayer-min.js"
  sdk-css-url="https://g.alicdn.com/apsara-media-box/imp-web-player/2.39.0/skins/default/aliplayer-min.css"
  :license="{ key: '...', encKey: '...', domain: '...' }"
  :source="source"
/>
```

## 本地开发

```bash
pnpm install
pnpm dev          # demo 页
pnpm typecheck    # vue-tsc
pnpm test         # vitest
pnpm build        # 库产物（ES + UMD + d.ts）
pnpm build:demo   # Pages 演示页
```

## License

[MIT](./LICENSE)
