import { beforeEach, describe, expect, it, vi } from 'vitest'

const play = vi.fn()
const cueSetEnabled = vi.fn()
const cueSetVolume = vi.fn()

vi.mock('cuelume', () => ({
  play: (...args: unknown[]) => play(...args),
  setEnabled: (...args: unknown[]) => cueSetEnabled(...args),
  setVolume: (...args: unknown[]) => cueSetVolume(...args),
}))

import {
  getSoundSettings,
  playColorCue,
  playCue,
  setRespectReducedMotion,
  setSoundEnabled,
  setSoundVolume,
  subscribeSound,
} from './sound'

function stubReducedMotion(reduce: boolean) {
  window.matchMedia = vi.fn().mockImplementation(
    (query: string): MediaQueryList =>
      ({
        matches: reduce && query.includes('prefers-reduced-motion'),
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }) as unknown as MediaQueryList,
  )
}

describe('sound', () => {
  beforeEach(() => {
    play.mockClear()
    cueSetEnabled.mockClear()
    cueSetVolume.mockClear()
    stubReducedMotion(false)
    setSoundEnabled(true)
    setSoundVolume(0.7)
    setRespectReducedMotion(true)
  })

  it('starts enabled at 0.7 with reduced-motion respect', () => {
    expect(getSoundSettings()).toEqual({
      enabled: true,
      volume: 0.7,
      respectReducedMotion: true,
    })
  })

  it('maps semantic cues onto cuelume recipes', () => {
    playCue('press')
    expect(play).toHaveBeenLastCalledWith('press', undefined)

    playCue('menuOpen')
    expect(play).toHaveBeenLastCalledWith('scan', undefined)

    playCue('commit')
    expect(play).toHaveBeenLastCalledWith('toggle', undefined)
  })

  it('maps colour tokens to their own voices', () => {
    playColorCue('mint')
    expect(play).toHaveBeenLastCalledWith('bloom', undefined)

    playColorCue('rose')
    expect(play).toHaveBeenLastCalledWith('sparkle', undefined)
  })

  it('is a no-op when disabled', () => {
    setSoundEnabled(false)
    playCue('press')
    expect(play).not.toHaveBeenCalled()
    expect(cueSetEnabled).toHaveBeenCalledWith(false)
  })

  it('suppresses playback under prefers-reduced-motion when respect is on', () => {
    stubReducedMotion(true)
    playCue('press')
    expect(play).not.toHaveBeenCalled()

    setRespectReducedMotion(false)
    playCue('press')
    expect(play).toHaveBeenCalledTimes(1)
  })

  it('clamps volume and forwards it to cuelume', () => {
    setSoundVolume(2)
    expect(getSoundSettings().volume).toBe(1)
    setSoundVolume(-1)
    expect(getSoundSettings().volume).toBe(0)
    expect(cueSetVolume).toHaveBeenLastCalledWith(0)
  })

  it('notifies subscribers of changes', () => {
    const listener = vi.fn()
    const unsubscribe = subscribeSound(listener)
    setSoundEnabled(false)
    expect(listener).toHaveBeenCalledTimes(1)
    unsubscribe()
    setSoundEnabled(true)
    expect(listener).toHaveBeenCalledTimes(1)
  })
})
