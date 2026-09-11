import {
  useContext,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { cn } from '../../lib/utils'
import { hexToAccentPair, isColorLight, resolveAccent } from '../../lib/accent'
import { TONE_BORDER, TONE_FILL } from '../../tokens/tones'
import type { Tone } from '../../tokens/tones'
import { ThemeContext } from '../Theme/ThemeProvider'

export type MessageAlign = 'start' | 'end'
export type MessageBubbleVariant = 'solid' | 'soft' | 'outline' | 'ghost'

export interface MessageListProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
  /** Accessible label for the conversation log. */
  label?: string
}

export interface MessageProps extends HTMLAttributes<HTMLDivElement> {
  align?: MessageAlign
  /** Avatar slot shown beside the message. */
  avatar?: ReactNode
  name?: ReactNode
  time?: ReactNode
  children?: ReactNode
}

export interface MessageBubbleProps extends HTMLAttributes<HTMLDivElement> {
  variant?: MessageBubbleVariant
  tone?: Tone
  accentColor?: string
  /** Tighten the bottom corner nearest the speaker into a tail. */
  tail?: MessageAlign | 'none'
  /** Appends a blinking caret for in-progress text. */
  streaming?: boolean
  children?: ReactNode
}

export interface MessageMetaProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export interface TypingIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  tone?: Tone
  accentColor?: string
  label?: string
}

/** A vertically stacked, announced conversation log. */
export function MessageList({ label, className, children, ...rest }: MessageListProps) {
  return (
    <div
      role="log"
      aria-live="polite"
      aria-relevant="additions"
      aria-label={label}
      className={cn('flex min-w-0 flex-col gap-4 font-sans', className)}
      {...rest}
    >
      {children}
    </div>
  )
}

export function Message({
  align = 'start',
  avatar,
  name,
  time,
  className,
  children,
  ...rest
}: MessageProps) {
  return (
    <div
      className={cn('flex w-full min-w-0 gap-2.5', align === 'end' && 'flex-row-reverse', className)}
      {...rest}
    >
      {avatar != null && <div className="shrink-0 pt-0.5">{avatar}</div>}
      <div
        className={cn(
          'flex min-w-0 max-w-[min(100%,44rem)] flex-col gap-1',
          align === 'end' ? 'items-end' : 'items-start',
        )}
      >
        {(name != null || time != null) && (
          <div
            className={cn(
              'flex items-center gap-2 px-1 text-[11px] text-[var(--sk-text-desc)]',
              align === 'end' && 'flex-row-reverse',
            )}
          >
            {name != null && <span className="font-medium">{name}</span>}
            {time != null && <span className="tabular-nums">{time}</span>}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

export function MessageBubble({
  variant = 'soft',
  tone = 'lavender',
  accentColor: accentColorProp,
  tail = 'none',
  streaming = false,
  className,
  style,
  children,
  ...rest
}: MessageBubbleProps) {
  const { accentColor: ctxAccent, dark } = useContext(ThemeContext)
  const accent = accentColorProp ?? ctxAccent
  const { fill, border } = resolveAccent(tone, TONE_FILL, TONE_BORDER, accent)

  let bubbleStyle: CSSProperties
  if (variant === 'solid') {
    const textColor = isColorLight(fill) ? border : 'rgba(255,255,255,0.94)'
    bubbleStyle = { background: fill, color: textColor, borderColor: `${border}38` }
  } else if (variant === 'soft') {
    bubbleStyle = {
      background: dark ? `${fill}4d` : `${fill}80`,
      color: dark ? fill : border,
      borderColor: dark ? `${fill}40` : `${border}24`,
    }
  } else if (variant === 'outline') {
    bubbleStyle = {
      background: 'transparent',
      color: 'var(--sk-text)',
      borderColor: `${border}55`,
    }
  } else {
    bubbleStyle = {
      background: 'var(--sk-surface-filled)',
      color: 'var(--sk-text)',
      borderColor: 'transparent',
    }
  }

  const caretColor =
    variant === 'solid' && accent
      ? isColorLight(hexToAccentPair(accent).fill)
        ? hexToAccentPair(accent).border
        : 'rgba(255,255,255,0.9)'
      : 'currentColor'

  return (
    <div
      className={cn(
        'relative max-w-full min-w-0 rounded-[20px] border px-3.5 py-2.5 font-sans text-[14px] leading-relaxed break-words',
        'shadow-[0_2px_10px_-6px_var(--sk-shadow-b)]',
        tail === 'start' && 'rounded-bl-[7px]',
        tail === 'end' && 'rounded-br-[7px]',
        className,
      )}
      style={{ ...bubbleStyle, ...style }}
      {...rest}
    >
      {children}
      {streaming && (
        <span
          aria-hidden="true"
          className="sk-caret ml-[3px] inline-block align-baseline"
          style={{ color: caretColor }}
        />
      )}
    </div>
  )
}

export function MessageMeta({ className, children, ...rest }: MessageMetaProps) {
  return (
    <div
      className={cn('px-1 text-[11px] text-[var(--sk-text-desc)]', className)}
      {...rest}
    >
      {children}
    </div>
  )
}

export function TypingIndicator({
  tone = 'lavender',
  accentColor: accentColorProp,
  label = 'Skye is typing',
  className,
  ...rest
}: TypingIndicatorProps) {
  const { accentColor: ctxAccent, dark } = useContext(ThemeContext)
  const { fill, border } = resolveAccent(
    tone,
    TONE_FILL,
    TONE_BORDER,
    accentColorProp ?? ctxAccent,
  )

  return (
    <div
      role="status"
      aria-label={label}
      className={cn(
        'inline-flex items-center gap-[5px] rounded-[20px] border px-3.5 py-3',
        className,
      )}
      style={{
        background: dark ? `${fill}4d` : `${fill}80`,
        borderColor: dark ? `${fill}40` : `${border}24`,
      }}
      {...rest}
    >
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          aria-hidden="true"
          className="sk-typing-dot block h-[6px] w-[6px] rounded-full"
          style={{ background: dark ? fill : border, animationDelay: `${index * 160}ms` }}
        />
      ))}
    </div>
  )
}
