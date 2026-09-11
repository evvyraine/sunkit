import type { SoundName } from 'cuelume'

/**
 * Semantic interaction cues used across Sunkit components.
 *
 * Components never reference cuelume sound names directly — they speak in
 * intents (`press`, `toggle`, `menuOpen`, …). The mapping to the concrete
 * cuelume palette lives here so the whole library can be re-tuned in one place.
 */
export type SoundCue =
  | 'press'
  | 'release'
  | 'toggle'
  | 'scrub'
  | 'focus'
  | 'hover'
  | 'menuOpen'
  | 'menuClose'
  | 'navigate'
  | 'commit'
  | 'open'
  | 'close'
  | 'success'
  | 'error'
  | 'loading'
  | 'ready'

/** Maps a Sunkit interaction intent to a cuelume recipe. */
export const CUE_MAP: Record<SoundCue, SoundName> = {
  press: 'press',
  release: 'release',
  toggle: 'toggle',
  scrub: 'tick',
  focus: 'whisper',
  hover: 'chime',
  menuOpen: 'scan',
  menuClose: 'whisper',
  navigate: 'page',
  commit: 'toggle',
  open: 'arrival',
  close: 'page',
  success: 'success',
  error: 'error',
  loading: 'loading',
  ready: 'ready',
}

/**
 * Each pastel token gets its own voice, preserving Sunkit's "every colour
 * sounds different" idea — now using the curated cuelume palette.
 */
export const COLOR_CUE: Record<string, SoundName> = {
  rose: 'sparkle',
  peach: 'droplet',
  lemon: 'chime',
  mint: 'bloom',
  sky: 'pulse',
  lavender: 'scan',
  lilac: 'tick',
  neutral: 'whisper',
}

export const DEFAULT_COLOR_CUE: SoundName = 'sparkle'
