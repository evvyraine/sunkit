import React, { useContext, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { resolveAccent } from '../../lib/accent'
import { TONE_BORDER, TONE_FILL } from '../../tokens/tones'
import { ThemeContext } from '../Theme/ThemeProvider'

export type ShapeType =
  | 'circle'
  | 'square'
  | 'triangle'
  | 'triangle-down'
  | 'diamond'
  | 'pentagon'
  | 'hexagon'
  | 'hexagon-flat'
  | 'octagon'
  | 'star4'
  | 'star5'
  | 'star6'
  | 'heart'
  | 'parallelogram'
  | 'shield'
  | 'cross'
  | 'arrow-right'
  | 'arrow-left'
  | 'arrow-up'
  | 'arrow-down'

export type ShapeColor =
  | 'rose'
  | 'peach'
  | 'lemon'
  | 'mint'
  | 'sky'
  | 'lavender'
  | 'lilac'
  | 'neutral'

export interface ShapeProps {
  shape?: ShapeType
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  color?: ShapeColor
  accentColor?: string
  /** Corner rounding for polygon shapes (0–49). Works on all shapes with vertices. */
  radius?: number
  rotation?: number
  clickable?: boolean
  onClick?: (e: MouseEvent<HTMLElement>) => void
  children?: ReactNode
  className?: string
  style?: CSSProperties
  as?: 'div' | 'button'
}

const SIZE_MAP: Record<string, number> = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
  '2xl': 128,
}

// ── Geometry helpers ──────────────────────────────────────────────────────────

type Pt = [number, number]

function add(a: Pt, b: Pt): Pt {
  return [a[0] + b[0], a[1] + b[1]]
}
function sub(a: Pt, b: Pt): Pt {
  return [a[0] - b[0], a[1] - b[1]]
}
function scale(v: Pt, s: number): Pt {
  return [v[0] * s, v[1] * s]
}
function len(v: Pt): number {
  return Math.sqrt(v[0] ** 2 + v[1] ** 2)
}
function norm(v: Pt): Pt {
  const l = len(v) || 1
  return [v[0] / l, v[1] / l]
}
function dist(a: Pt, b: Pt): number {
  return len(sub(b, a))
}

/** Build a polygon clip-path string from % coordinates */
function pctPolygon(pts: Pt[]): string {
  return `polygon(${pts.map(([x, y]) => `${+x.toFixed(3)}% ${+y.toFixed(3)}%`).join(', ')})`
}

/**
 * Build a rounded polygon via SVG path() using quadratic bezier at each vertex.
 * pts are in pixel coordinates (already converted from %).
 * r is the corner radius in pixels.
 */
function roundedPolyPath(pts: Pt[], r: number): string {
  const n = pts.length
  const segs: string[] = []

  for (let i = 0; i < n; i++) {
    const prev = pts[(i - 1 + n) % n]
    const curr = pts[i]
    const next = pts[(i + 1) % n]

    // Directions along incoming and outgoing edges
    const dIn = norm(sub(curr, prev))
    const dOut = norm(sub(next, curr))

    // Clamp rounding radius to half each adjacent edge length
    const rr = Math.min(r, dist(prev, curr) / 2, dist(curr, next) / 2)

    // Points where the curve starts and ends
    const a = add(curr, scale(dIn, -rr)) // approaching the corner
    const b = add(curr, scale(dOut, rr)) // leaving the corner

    if (i === 0) segs.push(`M ${a[0].toFixed(2)} ${a[1].toFixed(2)}`)
    else segs.push(`L ${a[0].toFixed(2)} ${a[1].toFixed(2)}`)

    // Quadratic bezier: control point = the vertex itself → smooth round
    segs.push(`Q ${curr[0].toFixed(2)} ${curr[1].toFixed(2)} ${b[0].toFixed(2)} ${b[1].toFixed(2)}`)
  }

  // Close back to the first point
  segs.push('Z')
  return `path('${segs.join(' ')}')`
}

/** Compute a regular n-gon in % coordinates. offsetDeg rotates the whole polygon. */
function regularPolygon(n: number, offsetDeg = -90): Pt[] {
  return Array.from({ length: n }, (_, i) => {
    const a = ((360 / n) * i + offsetDeg) * (Math.PI / 180)
    return [50 + 50 * Math.cos(a), 50 + 50 * Math.sin(a)] as Pt
  })
}

/** Compute a star polygon in % coordinates. */
function starPolygon(points: number, innerRatio: number, offsetDeg = -90): Pt[] {
  const total = points * 2
  return Array.from({ length: total }, (_, i) => {
    const a = ((360 / total) * i + offsetDeg) * (Math.PI / 180)
    const r = i % 2 === 0 ? 50 : 50 * innerRatio
    return [50 + r * Math.cos(a), 50 + r * Math.sin(a)] as Pt
  })
}

// ── Clip-path catalog ─────────────────────────────────────────────────────────

/** Returns the polygon points in % space (0-100), or null for non-polygon shapes. */
function getPolygonPts(shape: ShapeType): Pt[] | null {
  switch (shape) {
    case 'triangle':
      return [
        [50, 0],
        [100, 100],
        [0, 100],
      ]
    case 'triangle-down':
      return [
        [0, 0],
        [100, 0],
        [50, 100],
      ]
    case 'diamond':
      return [
        [50, 0],
        [100, 50],
        [50, 100],
        [0, 50],
      ]
    case 'pentagon':
      return regularPolygon(5)
    case 'hexagon':
      return regularPolygon(6)
    case 'hexagon-flat':
      return [
        [25, 0],
        [75, 0],
        [100, 50],
        [75, 100],
        [25, 100],
        [0, 50],
      ]
    case 'octagon':
      return regularPolygon(8)
    case 'star4':
      return starPolygon(4, 0.42)
    case 'star5':
      return starPolygon(5, 0.45)
    case 'star6':
      return starPolygon(6, 0.55)
    case 'parallelogram':
      return [
        [18, 0],
        [100, 0],
        [82, 100],
        [0, 100],
      ]
    case 'shield':
      return [
        [50, 0],
        [100, 18],
        [100, 62],
        [50, 100],
        [0, 62],
        [0, 18],
      ]
    case 'cross':
      return [
        [35, 0],
        [65, 0],
        [65, 35],
        [100, 35],
        [100, 65],
        [65, 65],
        [65, 100],
        [35, 100],
        [35, 65],
        [0, 65],
        [0, 35],
        [35, 35],
      ]
    case 'arrow-right':
      return [
        [0, 20],
        [60, 20],
        [60, 0],
        [100, 50],
        [60, 100],
        [60, 80],
        [0, 80],
      ]
    case 'arrow-left':
      return [
        [100, 20],
        [40, 20],
        [40, 0],
        [0, 50],
        [40, 100],
        [40, 80],
        [100, 80],
      ]
    case 'arrow-up':
      return [
        [20, 100],
        [20, 40],
        [0, 40],
        [50, 0],
        [100, 40],
        [80, 40],
        [80, 100],
      ]
    case 'arrow-down':
      return [
        [20, 0],
        [20, 60],
        [0, 60],
        [50, 100],
        [100, 60],
        [80, 60],
        [80, 0],
      ]
    default:
      return null
  }
}

/** Heart path scaled to the element's pixel size so it never overflows. */
function heartPath(s: number): string {
  const f = (v: number) => (v * s).toFixed(2)
  return `path('M${f(0.5)} ${f(0.82)} C${f(0.22)} ${f(0.64)} ${f(0.05)} ${f(0.46)} ${f(0.05)} ${f(0.3)} C${f(0.05)} ${f(0.16)} ${f(0.16)} ${f(0.08)} ${f(0.28)} ${f(0.08)} C${f(0.36)} ${f(0.08)} ${f(0.44)} ${f(0.13)} ${f(0.5)} ${f(0.21)} C${f(0.56)} ${f(0.13)} ${f(0.64)} ${f(0.08)} ${f(0.72)} ${f(0.08)} C${f(0.84)} ${f(0.08)} ${f(0.95)} ${f(0.16)} ${f(0.95)} ${f(0.3)} C${f(0.95)} ${f(0.46)} ${f(0.78)} ${f(0.64)} ${f(0.5)} ${f(0.82)} Z')`
}

function getClipPath(shape: ShapeType, radiusPct: number, sizePx: number): string {
  if (shape === 'circle') return 'circle(50%)'
  if (shape === 'heart') return heartPath(sizePx)
  if (shape === 'square') return `inset(0 round ${Math.min(radiusPct, 49)}%)`

  const pctPts = getPolygonPts(shape)
  if (!pctPts) return 'none'

  // No rounding — use lightweight polygon()
  if (radiusPct === 0 || sizePx === 0) return pctPolygon(pctPts)

  // Convert % → pixels, then compute rounded path
  const pxPts = pctPts.map(([x, y]): Pt => [(x / 100) * sizePx, (y / 100) * sizePx])
  const rPx = (radiusPct / 100) * sizePx // radius as absolute pixels
  return roundedPolyPath(pxPts, rPx)
}

// ── Component ─────────────────────────────────────────────────────────────────

export function Shape({
  shape = 'hexagon',
  size = 'md',
  color = 'lavender',
  accentColor: accentColorProp,
  radius = 0,
  rotation = 0,
  clickable = false,
  onClick,
  children,
  className,
  style,
  as,
}: ShapeProps) {
  const { accentColor: ctxAccent } = useContext(ThemeContext)
  const resolvedAccentHex = accentColorProp ?? ctxAccent
  const { fill } = resolveAccent(color, TONE_FILL, TONE_BORDER, resolvedAccentHex)

  const sizePx = typeof size === 'number' ? size : (SIZE_MAP[size] ?? 48)
  const clipPath = getClipPath(shape, Math.max(0, Math.min(radius, 49)), sizePx)

  const Tag = as ?? (clickable ? 'button' : 'div')

  const wrapStyle: CSSProperties = {
    width: sizePx,
    height: sizePx,
    clipPath,
    transform: `rotate(${rotation}deg)`,
    background: fill,
    flexShrink: 0,
    '--shape-rot': `${rotation}deg`,
    ...style,
  } as CSSProperties

  return (
    <Tag
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement & HTMLDivElement>}
      type={Tag === 'button' ? 'button' : undefined}
      className={cn(
        'relative overflow-hidden flex items-center justify-center select-none',
        clickable && 'shape-clickable cursor-pointer outline-none',
        !clickable && 'cursor-default',
        className,
      )}
      style={wrapStyle}
    >
      {children}
    </Tag>
  )
}
