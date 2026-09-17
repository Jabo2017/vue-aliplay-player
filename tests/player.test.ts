import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import VueAliPlayer from '../src/VueAliPlayer.vue'
import type { AliplayerConstructor, AliplayerInstance } from '../src/types'

/** 构造一个可断言的假 Aliplayer 构造器 */
function createMockSdk() {
  const created: Array<{
    options: Record<string, unknown>
    instance: ReturnType<typeof makeInstance>
  }> = []

  function makeInstance(options: Record<string, unknown>) {
    const handlers = new Map<string, Array<(p?: unknown) => void>>()
    const instance = {
      options,
      on: vi.fn((evt: string, cb: (p?: unknown) => void) => {
        if (!handlers.has(evt)) handlers.set(evt, [])
        handlers.get(evt)!.push(cb)
      }),
      off: vi.fn((evt: string, cb: (p?: unknown) => void) => {
        const list = handlers.get(evt)
        if (list) handlers.set(evt, list.filter((f) => f !== cb))
      }),
      play: vi.fn(),
      pause: vi.fn(),
      replay: vi.fn(),
      seek: vi.fn(),
      getCurrentTime: vi.fn(() => 12.5),
      getDuration: vi.fn(() => 100),
      getVolume: vi.fn(() => 1),
      setVolume: vi.fn(),
      setSpeed: vi.fn(),
      setPlayerSize: vi.fn(),
      setCover: vi.fn(),
      loadByUrl: vi.fn(),
      reloaduserPlayInfoAndVidRequestMts: vi.fn(),
      getStatus: vi.fn(() => 'ready'),
      dispose: vi.fn(),
      fullscreenService: {
        getIsFullScreen: vi.fn(() => false),
        requestFullScreen: vi.fn(),
        cancelFullScreen: vi.fn(),
      },
      __emit(evt: string) {
        for (const cb of handlers.get(evt) ?? []) cb()
      },
      __handlers: handlers,
    }
    return instance
  }

  const Ctor = vi.fn(function (this: unknown, options: Record<string, unknown>, ready?: () => void) {
    const instance = makeInstance(options)
    created.push({ options, instance })
    ready?.()
    return instance as unknown as AliplayerInstance
  }) as unknown as Mock & { new (...args: unknown[]): AliplayerInstance }

  return { Ctor: Ctor as unknown as AliplayerConstructor & Mock, created }
}

const MP4 = 'https://player.alicdn.com/video/aliyunmedia.mp4'

describe('VueAliPlayer', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
    document.body.innerHTML = ''
  })

  it('无 source 且无 vid 时不初始化播放器', async () => {
    const { Ctor, created } = createMockSdk()
    const wrapper = mount(VueAliPlayer, { props: { aliplayer: Ctor as never } })
    await flushPromises()
    expect(created).toHaveLength(0)
    expect(wrapper.find('.prism-player').exists()).toBe(true)
  })

  it('用注入的构造器初始化并透传核心参数', async () => {
    const { Ctor, created } = createMockSdk()
    mount(VueAliPlayer, {
      props: { aliplayer: Ctor as never, source: MP4, autoplay: false, isLive: true, width: '640px' },
    })
    await flushPromises()
    expect(created).toHaveLength(1)
    const { options } = created[0]
    expect(options.source).toBe(MP4)
    expect(options.autoplay).toBe(false)
    expect(options.isLive).toBe(true)
    expect(options.width).toBe('640px')
    expect(options.useH5Prism).toBe(true)
  })

  it('ready 后 emit ready 并携带实例；事件只转发一次', async () => {
    const { Ctor, created } = createMockSdk()
    const wrapper = mount(VueAliPlayer, {
      props: { aliplayer: Ctor as never, source: MP4 },
    })
    await flushPromises()
    expect(wrapper.emitted('ready')).toBeUndefined() // SDK 事件未触发前不应有 ready
    const inst = created[0].instance as unknown as { __emit: (e: string) => void }
    inst.__emit('ready')
    await flushPromises()
    expect(wrapper.emitted('ready')).toHaveLength(1)
    inst.__emit('playing')
    await flushPromises()
    expect(wrapper.emitted('playing')).toHaveLength(1)
  })

  it('暴露的方法代理到实例', async () => {
    const { Ctor, created } = createMockSdk()
    const wrapper = mount(VueAliPlayer, { props: { aliplayer: Ctor as never, source: MP4 } })
    await flushPromises()
    wrapper.vm.play()
    wrapper.vm.pause()
    wrapper.vm.seek(30)
    wrapper.vm.setVolume(0.5)
    expect(created[0].instance.play).toHaveBeenCalled()
    expect(created[0].instance.pause).toHaveBeenCalled()
    expect(created[0].instance.seek).toHaveBeenCalledWith(30)
    expect(created[0].instance.setVolume).toHaveBeenCalledWith(0.5)
    expect(wrapper.vm.getCurrentTime()).toBe(12.5)
    expect(wrapper.vm.getDuration()).toBe(100)
    expect(wrapper.vm.getStatus()).toBe('ready')
  })

  it('source 变化时销毁旧实例并重建', async () => {
    const { Ctor, created } = createMockSdk()
    const wrapper = mount(VueAliPlayer, { props: { aliplayer: Ctor as never, source: MP4 } })
    await flushPromises()
    const first = created[0].instance
    await wrapper.setProps({ source: 'https://example.com/live.flv' })
    await flushPromises()
    expect(created).toHaveLength(2)
    expect(first.dispose).toHaveBeenCalled()
    expect(created[1].options.source).toBe('https://example.com/live.flv')
  })

  it('卸载时销毁实例并解绑事件', async () => {
    const { Ctor, created } = createMockSdk()
    const wrapper = mount(VueAliPlayer, { props: { aliplayer: Ctor as never, source: MP4 } })
    await flushPromises()
    const inst = created[0].instance as unknown as {
      dispose: Mock
      off: Mock
    }
    wrapper.unmount()
    expect(inst.dispose).toHaveBeenCalled()
    expect(inst.off).toHaveBeenCalled()
  })

  it('vid+playauth 模式不需要 source 也能初始化，license 合并进参数', async () => {
    const { Ctor, created } = createMockSdk()
    mount(VueAliPlayer, {
      props: {
        aliplayer: Ctor as never,
        vid: 'vid-123',
        playauth: 'token',
        license: { key: 'k', encKey: 'e', domain: 'd' },
      },
    })
    await flushPromises()
    expect(created).toHaveLength(1)
    expect(created[0].options.vid).toBe('vid-123')
    expect(created[0].options.playauth).toBe('token')
    expect(created[0].options.license).toEqual({ key: 'k', encKey: 'e', domain: 'd' })
  })

  it('CDN 模式：懒插入 script 标签，load 后初始化', async () => {
    const { Ctor, created } = createMockSdk()
    mount(VueAliPlayer, { props: { source: MP4 } })
    await flushPromises()
    // script 已插入但尚未加载
    const script = document.getElementById('vue-aliplay-player-sdk') as HTMLScriptElement
    expect(script).toBeTruthy()
    expect(script.src).toContain('apsara-media-box/imp-web-player/2.27.1')
    // css link 已插入
    expect(document.querySelector('link[data-vap-css]')).toBeTruthy()
    expect(created).toHaveLength(0)

    // 模拟 SDK 加载完成（先挂全局，再触发 load）
    ;(window as unknown as { Aliplayer?: unknown }).Aliplayer = Ctor
    script.dispatchEvent(new Event('load'))
    await flushPromises()
    expect(created).toHaveLength(1)
  })
})
