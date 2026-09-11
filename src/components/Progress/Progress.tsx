import { useContext, type CSSProperties, type ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { resolveAccent } from '../../lib/accent'
import { TONE_BORDER, TONE_FILL } from '../../tokens/tones'
import { ThemeContext } from '../Theme/ThemeProvider'

export type ProgressTone =
  | 'rose'
  | 'peach'
  | 'lemon'
  | 'mint'
  | 'sky'
  | 'lavender'
  | 'lilac'
  | 'neutral'

export type ProgressSize = 'sm' | 'default' | 'lg'

export interface ProgressProps {
  value?: number
  tone?: ProgressTone
  accentColor?: string
  size?: ProgressSize
  label?: ReactNode
  showValue?: boolean
  animated?: boolean
  className?: string
}

const TRACK_H: Record<ProgressSize, number> = { sm: 4, default: 8, lg: 12 }

export function Progress({
  value,
  tone = 'lavender',
  accentColor: accentColorProp,
  size = 'default',
  label,
  showValue = false,
  animated = true,
  className,
}: ProgressProps) {
  const { accentColor: ctxAccent } = useContext(ThemeContext)
  const resolvedAccentHex = accentColorProp ?? ctxAccent

  const isIndeterminate = value === undefined
  const clamped = isIndeterminate ? 0 : Math.max(0, Math.min(100, value))
  const trackH = TRACK_H[size]

  const { fill: fillColor, border: borderColor } = resolveAccent(
    tone,
    TONE_FILL,
    TONE_BORDER,
    resolvedAccentHex,
  )

  const trackStyle: CSSProperties = {
    position: 'relative',
    height: trackH,
    borderRadius: 999,
    background: 'var(--sk-track-empty)',
    overflow: 'hidden',
    boxShadow: 'inset 0 1px 2px var(--sk-shadow-c)',
  }

  const fillStyle: CSSProperties = isIndeterminate
    ? {
        position: 'absolute',
        top: 0,
        height: '100%',
        width: '40%',
        borderRadius: 999,
        background: fillColor,
        boxShadow: `0 0 0 1px ${borderColor}33`,
        animation: animated ? 'progress-indeterminate 1.6s ease-in-out infinite' : 'none',
      }
    : {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: `${clamped}%`,
        borderRadius: 999,
        background: fillColor,
        boxShadow: `0 0 0 1px ${borderColor}33`,
        transition: animated ? 'width 400ms cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
      }

  return (
    <div className={cn('w-full font-sans', className)}>
      {(label != null || (showValue && !isIndeterminate)) && (
        <div className="flex items-center justify-between gap-3 mb-[6px]">
          {label != null && (
            <span className="min-w-0 truncate text-[12px] leading-none font-medium text-[var(--sk-text-label)]">
              {label}
            </span>
          )}
          {showValue && !isIndeterminate && (
            <span className="shrink-0 text-[12px] leading-none text-[var(--sk-text-muted)] tabular-nums">
              {clamped}%
            </span>
          )}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={isIndeterminate ? undefined : clamped}
        aria-valuemin={isIndeterminate ? undefined : 0}
        aria-valuemax={isIndeterminate ? undefined : 100}
        style={trackStyle}
      >
        <div style={fillStyle} />
      </div>
    </div>
  )
}
