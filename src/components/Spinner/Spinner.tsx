import { useContext, type HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'
import { resolveAccent } from '../../lib/accent'
import { TONE_BORDER, TONE_FILL } from '../../tokens/tones'
import type { Tone } from '../../tokens/tones'
import { ThemeContext } from '../Theme/ThemeProvider'

export type SpinnerSize = 'xs' | 'sm' | 'default' | 'lg'
export type SpinnerLabelPosition = 'hidden' | 'right' | 'bottom'

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize
  tone?: Tone
  accentColor?: string
  /** Accessible label, also shown when `labelPosition` is not `hidden`. */
  label?: string
  labelPosition?: SpinnerLabelPosition
  className?: string
}

const SIZE_PX: Record<SpinnerSize, number> = { xs: 12, sm: 16, default: 20, lg: 28 }

export function Spinner({
  size = 'default',
  tone = 'lavender',
  accentColor: accentColorProp,
  label = 'Loading',
  labelPosition = 'hidden',
  className,
  style,
  ...rest
}: SpinnerProps) {
  const { accentColor: ctxAccent } = useContext(ThemeContext)
  const resolvedAccent = accentColorProp ?? ctxAccent
  const { border } = resolveAccent(tone, TONE_FILL, TONE_BORDER, resolvedAccent)

  const px = SIZE_PX[size]

  return (
    <span
      role="status"
      className={cn(
        'inline-flex font-[system-ui,_-apple-system,_sans-serif]',
        labelPosition === 'right' && 'flex-row items-center gap-[8px]',
        labelPosition === 'bottom' && 'flex-col items-center gap-[6px]',
        className,
      )}
      style={{ color: border, ...style }}
      {...rest}
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="sk-spinner-animated shrink-0"
        style={{ display: 'block' }}
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.22" />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      {labelPosition === 'hidden' ? (
        <span className="sr-only">{label}</span>
      ) : (
        <span className="text-[13px] leading-none text-[var(--sk-text-muted)]">{label}</span>
      )}
    </span>
  )
}
