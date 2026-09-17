<script setup lang="ts">
import { ref } from 'vue'
import VueAliPlayer from '../src/index'
import type { AliplayerInstance } from '../src/types'

const SAMPLES = {
  'mp4 点播': 'https://player.alicdn.com/video/aliyunmedia.mp4',
  'm3u8 点播': 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
} as const

type SampleKey = keyof typeof SAMPLES | '自定义'

const current = ref<string>(SAMPLES['mp4 点播'])
const activeKey = ref<SampleKey>('mp4 点播')
const customUrl = ref('')
const stretching = ref<'none' | 'uniform' | 'exactfit' | 'fill'>('fill')
const isLive = ref(false)
const autoplay = ref(false)

const playerRef = ref<InstanceType<typeof VueAliPlayer> | null>(null)
const logs = ref<string[]>([])
let lastStatus = ''

function onEvent(name: string) {
  return () => {
    const status = playerRef.value?.getStatus() ?? ''
    const time = playerRef.value?.getCurrentTime()
    const line =
      status && status !== lastStatus
        ? `${name}（status=${status}${time != null ? `, t=${time.toFixed(1)}s` : ''}）`
        : name
    lastStatus = status
    logs.value.unshift(`${new Date().toLocaleTimeString()}  ${line}`)
    if (logs.value.length > 30) logs.value.pop()
  }
}

function switchSample(key: SampleKey) {
  activeKey.value = key
  if (key === '自定义') {
    if (customUrl.value) {
      isLive.value = /\.(flv)$/.test(customUrl.value.split('?')[0])
      current.value = customUrl.value
      playerRef.value?.reloadPlayer(customUrl.value)
    }
    return
  }
  isLive.value = false
  current.value = SAMPLES[key]
  playerRef.value?.reloadPlayer(current.value)
}

function onReady(inst: AliplayerInstance | null) {
  onEvent('ready')()
  void inst
}
</script>

<template>
  <div class="page">
    <header>
      <h1>vue-aliplay-player <span class="ver">v4 · Vue 3</span></h1>
      <p class="sub">阿里云 Aliplayer 2.27.1 · CDN 懒加载 · 零依赖打包</p>
    </header>

    <main>
      <section class="stage">
        <div class="toolbar">
          <button
            v-for="key in (['mp4 点播', 'm3u8 点播', '自定义'] as SampleKey[])"
            :key="key"
            :class="{ active: activeKey === key }"
            @click="switchSample(key)"
          >
            {{ key }}
          </button>
          <select v-model="stretching" title="缩放方式">
            <option value="fill">fill（裁剪铺满）</option>
            <option value="uniform">uniform（黑边等比）</option>
            <option value="exactfit">exactfit（拉伸）</option>
            <option value="none">none（原始）</option>
          </select>
        </div>

        <div class="player-box">
          <VueAliPlayer
            ref="playerRef"
            :source="current"
            :stretching="stretching"
            :is-live="isLive"
            :autoplay="autoplay"
            play-style="width:100%;height:100%"
            style="width: 100%; height: 100%"
            @ready="onReady"
            @playing="onEvent('playing')"
            @play="onEvent('play')"
            @pause="onEvent('pause')"
            @ended="onEvent('ended')"
            @error="onEvent('error')"
            @waiting="onEvent('waiting')"
          />
        </div>

        <div class="controls">
          <button @click="playerRef?.play()">播放</button>
          <button @click="playerRef?.pause()">暂停</button>
          <button @click="playerRef?.replay()">重播</button>
          <button @click="playerRef?.seek(30)">跳到 30s</button>
          <button @click="playerRef?.setVolume(0.5)">音量 50%</button>
          <label><input v-model="autoplay" type="checkbox" /> autoplay</label>
        </div>

        <form class="custom" @submit.prevent="switchSample('自定义')">
          <input v-model="customUrl" type="url" placeholder="输入视频地址（mp4 / m3u8 / flv 直播）" />
          <button type="submit">加载</button>
        </form>
      </section>

      <aside class="panel">
        <h2>事件日志</h2>
        <ul>
          <li v-for="(item, i) in logs" :key="i">{{ item }}</li>
          <li v-if="!logs.length" class="empty">等待事件…</li>
        </ul>
      </aside>
    </main>

    <footer>
      <a href="https://github.com/Jabo2017/vue-aliplay-player" target="_blank" rel="noopener">GitHub</a>
      ·
      <a href="https://www.npmjs.com/package/vue-aliplay-player" target="_blank" rel="noopener">npm</a>
      · Vue 2 项目请使用 3.x 版本
    </footer>
  </div>
</template>

<style>
* {
  margin: 0;
  box-sizing: border-box;
}
body {
  background: #101418;
  color: #e8eaed;
  font-family: 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
}
.page {
  max-width: 1180px;
  margin: 0 auto;
  padding: 24px 20px 40px;
}
header h1 {
  font-size: 22px;
  font-weight: 600;
}
.ver {
  font-size: 13px;
  color: #7dd3a8;
  border: 1px solid #2f6d4f;
  border-radius: 4px;
  padding: 2px 8px;
  margin-left: 8px;
  vertical-align: 2px;
}
.sub {
  color: #8a9199;
  font-size: 13px;
  margin-top: 6px;
}
main {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 16px;
  margin-top: 18px;
}
@media (max-width: 860px) {
  main {
    grid-template-columns: 1fr;
  }
}
.stage {
  min-width: 0;
}
.toolbar {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}
.toolbar button,
.controls button,
.custom button {
  background: #1c232b;
  color: #e8eaed;
  border: 1px solid #333c46;
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 13px;
  cursor: pointer;
}
.toolbar button.active {
  border-color: #7dd3a8;
  color: #7dd3a8;
}
.toolbar select {
  margin-left: auto;
  background: #1c232b;
  color: #e8eaed;
  border: 1px solid #333c46;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 13px;
}
.player-box {
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
}
.controls {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 12px;
  font-size: 13px;
}
.controls label {
  color: #8a9199;
  margin-left: 4px;
}
.custom {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
.custom input {
  flex: 1;
  background: #1c232b;
  border: 1px solid #333c46;
  border-radius: 6px;
  color: #e8eaed;
  padding: 6px 12px;
  font-size: 13px;
}
.panel {
  background: #151b22;
  border: 1px solid #232c35;
  border-radius: 8px;
  padding: 14px;
  max-height: 520px;
  overflow: auto;
}
.panel h2 {
  font-size: 14px;
  color: #8a9199;
  font-weight: 500;
  margin-bottom: 10px;
}
.panel ul {
  list-style: none;
  padding: 0;
  font-size: 12px;
  line-height: 1.9;
  color: #b9c1c9;
  font-family: Consolas, monospace;
}
.panel .empty {
  color: #566068;
}
footer {
  margin-top: 24px;
  font-size: 13px;
  color: #8a9199;
}
footer a {
  color: #7dd3a8;
  text-decoration: none;
}
</style>
