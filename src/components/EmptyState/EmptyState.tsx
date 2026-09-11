import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { resolveAccent } from '../../lib/accent'
import { TONE_BORDER, TONE_FILL } from '../../tokens/tones'
import type { Tone } from '../../tokens/tones'
import { ThemeContext } from '../Theme/ThemeProvider'
import { Shape } from '../Shape'
import { useContext } from 'react'

export type EmptyStateSize = 'sm' | 'default' | 'lg'

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: ReactNode
  title?: ReactNode
  description?: ReactNode
  /** Primary call to action, usually a `Button`. */
  action?: ReactNode
  tone?: Tone
  accentColor?: string
  size?: EmptyStateSize
}

const SHAPE_SIZE: Record<EmptyStateSize, 'md' | 'lg' | 'xl'> = {
  sm: 'md',
  default: 'lg',
  lg: 'xl',
}

const TITLE_CLASS: Record<EmptyStateSize, string> = {
  sm: 'text-[14px]',
  default: 'text-[16px]',
  lg: 'text-[19px]',
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  tone = 'lavender',
  accentColor: accentColorProp,
  size = 'default',
  className,
  style,
  ...rest
}: EmptyStateProps) {
  const { accentColor: ctxAccent } = useContext(ThemeContext)
  const { border } = resolveAccent(tone, TONE_FILL, TONE_BORDER, accentColorProp ?? ctxAccent)

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 px-6 text-center font-sans',
        size === 'lg' && 'gap-4 py-4',
        className,
      )}
      style={style}
      {...rest}
    >
      <Shape
        shape="hexagon"
        size={SHAPE_SIZE[size]}
        color={tone}
        accentColor={accentColorProp}
        radius={34}
        rotation={-6}
        className="shadow-[0_10px_24px_-10px_rgba(0,0,0,0.25)]"
      >
        <span className="flex items-center justify-center" style={{ color: border, opacity: 0.9 }}>
          {icon}
        </span>
      </Shape>
      {title != null && (
        <div
          className={cn(
            'font-semibold text-balance text-[var(--sk-text)]',
            TITLE_CLASS[size],
          )}
        >
          {title}
        </div>
      )}
      {description != null && (
        <p className="max-w-[42ch] text-[13px] leading-relaxed text-pretty text-[var(--sk-text-desc)]">
          {description}
        </p>
      )}
      {action != null && <div className="mt-1 flex items-center gap-2">{action}</div>}
    </div>
  )
}
