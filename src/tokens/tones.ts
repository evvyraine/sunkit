import { COLOR_MAP, type ButtonColor } from './colors'

/**
 * The shared pastel tone scale used by every Sunkit component.
 *
 * Previously each component re-declared its own `TONE_FILL` / `TONE_BORDER`
 * maps, which risked drifting apart. They are derived from the single source of
 * truth (`COLOR_MAP`) here instead.
 */
export type Tone = ButtonColor

export const TONES = Object.keys(COLOR_MAP) as Tone[]

/** Solid pastel fill for a tone. */
export const TONE_FILL = Object.fromEntries(
  TONES.map((tone) => [tone, COLOR_MAP[tone].hex]),
) as Record<Tone, string>

/** Darker, more saturated companion to `TONE_FILL` — borders, icons and text. */
export const TONE_BORDER = Object.fromEntries(
  TONES.map((tone) => [tone, COLOR_MAP[tone].darkHex]),
) as Record<Tone, string>
