import { useContext, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { resolveAccent } from '../../lib/accent'
import { TONE_BORDER, TONE_FILL } from '../../tokens/tones'
import type { Tone } from '../../tokens/tones'
import { ThemeContext } from '../Theme/ThemeProvider'

export type KbdSize = 'sm' | 'default'

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  size?: KbdSize
  tone?: Tone
  accentColor?: string
  children?: ReactNode
}

const SIZE_CLASS: Record<KbdSize, string> = {
  sm: 'min-w-[1.25rem] px-[5px] py-[2px] text-[10px]',
  default: 'min-w-[1.5rem] px-[7px] py-[3px] text-[11px]',
}

/** Renders a keyboard key. Group several inside a flex container with `+` text between them. */
export function Kbd({
  size = 'default',
  tone = 'neutral',
  accentColor: accentColorProp,
  children,
  className,
  style,
  ...rest
}: KbdProps) {
  const { accentColor: ctxAccent } = useContext(ThemeContext)
  const { fill, border } = resolveAccent(tone, TONE_FILL, TONE_BORDER, accentColorProp ?? ctxAccent)

  const keyStyle: CSSProperties = {
    background: `color-mix(in srgb, ${fill} 55%, var(--sk-bg-solid))`,
    color: border,
    borderColor: `${border}33`,
    ...style,
  }

  return (
    <kbd
      className={cn(
        'inline-flex items-center justify-center rounded-[7px] border font-sans font-medium leading-none',
        'shadow-[0_1px_0_0_var(--sk-shadow-c),inset_0_1px_0_var(--sk-inset-light)]',
        SIZE_CLASS[size],
        className,
      )}
      style={keyStyle}
      {...rest}
    >
      {children}
    </kbd>
  )
}
