import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/utils'
import type { Tone } from '../../tokens/tones'

export type SeparatorOrientation = 'horizontal' | 'vertical'

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: SeparatorOrientation
  /** Accent for the line. `muted` (default) follows the neutral surface border. */
  tone?: Tone | 'muted'
  /** Optional label rendered between two horizontal lines. */
  label?: ReactNode
  /** Hide from assistive technology when the separator is purely decorative. */
  decorative?: boolean
}

const TONE_BORDER: Record<Tone, string> = {
  rose: 'border-pastel-rose-dark/[0.3] dark:border-pastel-rose/[0.34]',
  peach: 'border-pastel-peach-dark/[0.3] dark:border-pastel-peach/[0.34]',
  lemon: 'border-pastel-lemon-dark/[0.3] dark:border-pastel-lemon/[0.34]',
  mint: 'border-pastel-mint-dark/[0.3] dark:border-pastel-mint/[0.34]',
  sky: 'border-pastel-sky-dark/[0.3] dark:border-pastel-sky/[0.34]',
  lavender: 'border-pastel-lavender-dark/[0.3] dark:border-pastel-lavender/[0.34]',
  lilac: 'border-pastel-lilac-dark/[0.3] dark:border-pastel-lilac/[0.34]',
  neutral: 'border-pastel-neutral-dark/[0.3] dark:border-pastel-neutral/[0.34]',
}

export function Separator({
  orientation = 'horizontal',
  tone = 'muted',
  label,
  decorative = false,
  className,
  ...rest
}: SeparatorProps) {
  const colorClass = tone === 'muted' ? 'border-[var(--sk-border)]' : TONE_BORDER[tone]
  const separatorRole = decorative
    ? undefined
    : ({ role: 'separator', 'aria-orientation': orientation } as const)

  if (orientation === 'vertical') {
    return (
      <div
        {...separatorRole}
        className={cn('inline-block w-px self-stretch border-l', colorClass, className)}
        {...rest}
      />
    )
  }

  if (label != null) {
    return (
      <div className={cn('flex w-full items-center gap-3', className)} {...rest}>
        <span className={cn('h-px flex-1 border-t', colorClass)} aria-hidden="true" />
        <span className="shrink-0 text-[11px] font-medium tracking-wide text-[var(--sk-text-desc)] uppercase">
          {label}
        </span>
        <span className={cn('h-px flex-1 border-t', colorClass)} aria-hidden="true" />
      </div>
    )
  }

  return (
    <div
      {...separatorRole}
      className={cn('h-px w-full border-t', colorClass, className)}
      {...rest}
    />
  )
}
