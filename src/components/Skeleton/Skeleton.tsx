import type { CSSProperties, HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant
  width?: number | string
  height?: number | string
  /** Number of stacked bars rendered for `variant="text"`. */
  lines?: number
  animation?: boolean
  /** Accessible label. When set the skeleton becomes an assertive-free `status` region. */
  label?: string
  className?: string
}

const RADIUS: Record<SkeletonVariant, number> = {
  text: 4,
  circular: 9999,
  rectangular: 0,
  rounded: 8,
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  lines = 1,
  animation = true,
  label,
  className,
  style,
  'aria-label': ariaLabel,
  ...rest
}: SkeletonProps) {
  const isStatus = label != null || ariaLabel != null
  const statusProps = isStatus
    ? { role: 'status' as const, 'aria-label': ariaLabel }
    : { 'aria-hidden': true as const }

  const resolvedHeight = height ?? (variant === 'circular' ? 40 : variant === 'text' ? '0.8em' : 16)
  const resolvedWidth = width ?? (variant === 'circular' ? resolvedHeight : '100%')
  const lineCount = variant === 'text' ? Math.max(1, lines) : 1

  const barStyle: CSSProperties = {
    borderRadius: RADIUS[variant],
    background:
      'linear-gradient(90deg, var(--sk-surface-filled) 25%, var(--sk-border) 37%, var(--sk-surface-filled) 63%)',
    backgroundSize: '200% 100%',
  }

  const animatedClass = animation ? 'sk-skeleton-animated' : undefined
  const hiddenLabel = label != null ? <span className="sr-only">{label}</span> : null

  if (lineCount === 1) {
    return (
      <div
        {...statusProps}
        className={cn(animatedClass, className)}
        style={{ width: resolvedWidth, height: resolvedHeight, ...barStyle, ...style }}
        {...rest}
      >
        {hiddenLabel}
      </div>
    )
  }

  return (
    <div
      {...statusProps}
      className={cn('flex flex-col gap-[0.5em]', className)}
      style={{ width: resolvedWidth, ...style }}
      {...rest}
    >
      {hiddenLabel}
      {Array.from({ length: lineCount }, (_, i) => (
        <div
          key={i}
          className={animatedClass}
          style={{
            ...barStyle,
            width: i === lineCount - 1 ? '60%' : '100%',
            height: resolvedHeight,
          }}
        />
      ))}
    </div>
  )
}
