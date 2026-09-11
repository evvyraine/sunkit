export type ButtonColor =
  | 'rose'
  | 'peach'
  | 'lemon'
  | 'mint'
  | 'sky'
  | 'lavender'
  | 'lilac'
  | 'neutral'

export interface ColorToken {
  id: ButtonColor
  label: string
  hex: string
  darkHex: string
}

export const COLORS: ColorToken[] = [
  { id: 'rose', label: 'Rose', hex: '#F9C5D1', darkHex: '#9d314e' },
  { id: 'peach', label: 'Peach', hex: '#FDDBB4', darkHex: '#895622' },
  { id: 'lemon', label: 'Lemon', hex: '#FFF1A8', darkHex: '#7b6a15' },
  { id: 'mint', label: 'Mint', hex: '#B8F0D8', darkHex: '#1f714e' },
  { id: 'sky', label: 'Sky', hex: '#B8DFFE', darkHex: '#1f619b' },
  { id: 'lavender', label: 'Lavender', hex: '#D4C5F9', darkHex: '#5a3eaa' },
  { id: 'lilac', label: 'Lilac', hex: '#F0C8F0', darkHex: '#8a3a8a' },
  { id: 'neutral', label: 'Neutral', hex: '#E8E4DC', darkHex: '#5a5550' },
]

export const COLOR_MAP: Record<ButtonColor, { hex: string; darkHex: string }> = Object.fromEntries(
  COLORS.map((c) => [c.id, { hex: c.hex, darkHex: c.darkHex }]),
) as Record<ButtonColor, { hex: string; darkHex: string }>
