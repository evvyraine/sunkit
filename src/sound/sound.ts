import { play, setEnabled as cueSetEnabled, setVolume as cueSetVolume } from 'cuelume'
import type { SoundName } from 'cuelume'
import { COLOR_CUE, CUE_MAP, DEFAULT_COLOR_CUE, type SoundCue } from './cues'

/**
 * Global sound settings for Sunkit.
 *
 * cuelume already owns a single shared `AudioContext` and global volume/enabled
 * state; this module mirrors that state so React can subscribe to it and adds
 * the two behaviours cuelume intentionally leaves to the app: a
 * `prefers-reduced-motion` respect flag, and SSR-safe no-op guards.
 *
 * Apps that want a scoped sound layer should render `<SoundProvider>`; simply
 * importing a component and using it works too (sounds start enabled at 0.7).
 */
export interface SoundSettings {
  /** Whether future sounds play at all. */
  enabled: boolean
  /** Global loudness multiplier, `0`–`1`. */
  volume: number
  /** When true (default), sounds are suppressed under `prefers-reduced-motion: reduce`. */
  respectReducedMotion: boolean
}

export const DEFAULT_SOUND_SETTINGS: SoundSettings = {
  enabled: true,
  volume: 0.7,
  respectReducedMotion: true,
}

let settings: SoundSettings = { ...DEFAULT_SOUND_SETTINGS }
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

function commit(next: Partial<SoundSettings>) {
  settings = { ...settings, ...next }
  emit()
}

/** Subscribe to setting changes (compatible with `useSyncExternalStore`). */
export function subscribeSound(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Snapshot of the current settings. Stable reference until something changes. */
export function getSoundSettings(): SoundSettings {
  return settings
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function canPlay(): boolean {
  if (!settings.enabled) return false
  if (settings.respectReducedMotion && prefersReducedMotion()) return false
  return true
}

/** Enable or disable future playback. Safe to call during SSR. */
export function setSoundEnabled(enabled: boolean): void {
  commit({ enabled })
  cueSetEnabled(enabled)
}

/** Set the global volume multiplier (clamped to `0`–`1`). */
export function setSoundVolume(volume: number): void {
  const clamped = Math.max(0, Math.min(1, volume))
  commit({ volume: clamped })
  cueSetVolume(clamped)
}

/** Toggle whether `prefers-reduced-motion: reduce` suppresses playback. */
export function setRespectReducedMotion(respectReducedMotion: boolean): void {
  commit({ respectReducedMotion })
}

/** Play a raw cuelume sound by name. */
export function playSound(name: SoundName, options?: { volume?: number }): void {
  if (!canPlay()) return
  try {
    play(name, options)
  } catch {
    // Audio is best-effort: unavailable AudioContexts (SSR, jsdom, autoplay
    // policies) must never break an interaction.
  }
}

/** Play a semantic Sunkit cue. */
export function playCue(cue: SoundCue, options?: { volume?: number }): void {
  playSound(CUE_MAP[cue], options)
}

/** Play the dedicated voice for a pastel colour token. */
export function playColorCue(colorId: string, options?: { volume?: number }): void {
  playSound(COLOR_CUE[colorId] ?? DEFAULT_COLOR_CUE, options)
}
