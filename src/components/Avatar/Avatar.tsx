import { useContext, useEffect, useState, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { resolveAccent } from '../../lib/accent'
import { TONE_BORDER, TONE_FILL } from '../../tokens/tones'
import type { Tone } from '../../tokens/tones'
import { ThemeContext } from '../Theme/ThemeProvider'

export type AvatarSize = 'xs' | 'sm' | 'default' | 'lg' | 'xl'
export type AvatarShape = 'circle' | 'rounded' | 'square'
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away'

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** Image source. Falls back to initials or `fallback` when missing or broken. */
  src?: string | null
  /** Accessible description of the subject. */
  alt?: string
  /** Full name used to derive initials when there is no image. */
  name?: string
  /** Custom fallback node shown instead of initials. */
  fallback?: ReactNode
  size?: AvatarSize
  shape?: AvatarShape
  tone?: Tone
  accentColor?: string
  /** Presence dot. The state is also announced through the avatar's label. */
  status?: AvatarStatus
  /** Draw a ring that separates the avatar from busy backgrounds. */
  ring?: boolean
  /** Hide the avatar from assistive technology (e.g. when it repeats nearby text). */
  decorative?: boolean
}

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
  /** Accessible label for the group, e.g. "3 participants". */
  label?: string
}

const SIZE_PX: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  default: 40,
  lg: 48,
  xl: 64,
}

const FONT_PX: Record<AvatarSize, number> = { xs: 10, sm: 12, default: 14, lg: 17, xl: 23 }
const DOT_PX: Record<AvatarSize, number> = { xs: 6, sm: 8, default: 10, lg: 12, xl: 14 }

const STATUS: Record<AvatarStatus, { fill: string; label: string }> = {
  online: { fill: '#2a7a58', label: 'Online' },
  busy: { fill: '#c2607a', label: 'Busy' },
  away: { fill: '#8a7820', label: 'Away' },
  offline: { fill: '#5a5550', label: 'Offline' },
}

/** Derives up to two initials from a full name. */
export function avatarInitials(name?: string | null): string {
  if (!name) return ''
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase()
}

export function Avatar({
  src,
  alt,
  name,
  fallback,
  size = 'default',
  shape = 'circle',
  tone = 'lavender',
  accentColor: accentColorProp,
  status,
  ring = false,
  decorative = false,
  className,
  style,
  ...rest
}: AvatarProps) {
  const { accentColor: ctxAccent } = useContext(ThemeContext)
  const { fill, border } = resolveAccent(tone, TONE_FILL, TONE_BORDER, accentColorProp ?? ctxAccent)

  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [src])

  const px = SIZE_PX[size]
  const showImage = Boolean(src) && !failed
  const initials = avatarInitials(name)
  const statusInfo = status ? STATUS[status] : null
  const label = alt ?? name

  const radius =
    shape === 'circle'
      ? 9999
      : shape === 'square'
        ? Math.max(8, Math.round(px * 0.22))
        : Math.round(px * 0.32)

  const accessibility = decorative
    ? { 'aria-hidden': true as const }
    : {
        role: 'img' as const,
        'aria-label':
          statusInfo && label ? `${label}, ${statusInfo.label}` : (label ?? statusInfo?.label),
      }

  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden font-sans font-semibold select-none',
        ring && 'shadow-sm ring-2 ring-[var(--sk-bg-solid)]',
        className,
      )}
      style={{
        width: px,
        height: px,
        borderRadius: radius,
        background: fill,
        color: border,
        fontSize: FONT_PX[size],
        ...style,
      }}
      {...accessibility}
      {...rest}
    >
      {showImage ? (
        <img
          src={src ?? undefined}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : fallback != null ? (
        <span className="flex h-full w-full items-center justify-center">{fallback}</span>
      ) : (
        <span className="leading-none tracking-wide" aria-hidden="true">
          {initials}
        </span>
      )}
      {statusInfo ? (
        <span
          aria-hidden="true"
          className="absolute right-0 bottom-0 block rounded-full"
          style={{
            width: DOT_PX[size],
            height: DOT_PX[size],
            background: statusInfo.fill,
            boxShadow: '0 0 0 2px var(--sk-bg-solid)',
          }}
        />
      ) : null}
    </span>
  )
}

/** Overlapping row of avatars. Give it a `label` describing the group. */
export function AvatarGroup({ children, label, className, ...rest }: AvatarGroupProps) {
  return (
    <div
      role={label ? 'group' : undefined}
      aria-label={label}
      className={cn('flex items-center -space-x-2 font-sans', className)}
      {...rest}
    >
      {children}
    </div>
  )
}
