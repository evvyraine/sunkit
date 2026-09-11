import {
  cloneElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react'
import { cn } from '../../lib/utils'
import { resolveAccent } from '../../lib/accent'
import { TONE_BORDER, TONE_FILL } from '../../tokens/tones'
import type { Tone } from '../../tokens/tones'
import { ThemeContext } from '../Theme/ThemeProvider'
import { playCue } from '../../sound'

export type TooltipSide = 'top' | 'right' | 'bottom' | 'left'

export interface TooltipProps {
  /** Content rendered inside the tooltip panel. */
  content: ReactNode
  /** The element that triggers the tooltip. */
  children: ReactElement<{ 'aria-describedby'?: string }>
  side?: TooltipSide
  /** Delay before the tooltip appears on pointer hover (ms). Focus shows instantly. */
  delay?: number
  disabled?: boolean
  tone?: Tone
  accentColor?: string
  /** Applied to the tooltip panel. */
  className?: string
}

const SIDE_STYLE: Record<TooltipSide, CSSProperties> = {
  top: { bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' },
  bottom: { top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' },
  left: { right: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)' },
  right: { left: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)' },
}

export function Tooltip({
  content,
  children,
  side = 'top',
  delay = 150,
  disabled = false,
  tone = 'neutral',
  accentColor: accentColorProp,
  className,
}: TooltipProps) {
  const autoId = useId()
  const tooltipId = `tooltip-${autoId}`

  const { accentColor: ctxAccent } = useContext(ThemeContext)
  const { border } = resolveAccent(tone, TONE_FILL, TONE_BORDER, accentColorProp ?? ctxAccent)

  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const show = useCallback(
    (immediate: boolean) => {
      if (disabled) return
      clearTimer()
      const reveal = () => {
        setVisible(true)
        playCue('hover')
      }
      if (immediate || delay <= 0) reveal()
      else timerRef.current = setTimeout(reveal, delay)
    },
    [clearTimer, delay, disabled],
  )

  const hide = useCallback(() => {
    clearTimer()
    setVisible(false)
  }, [clearTimer])

  // Clear any pending reveal timer on unmount.
  useEffect(() => clearTimer, [clearTimer])

  // Hide a disabled tooltip if it happens to be open.
  useEffect(() => {
    if (disabled) setVisible(false)
  }, [disabled])

  // Escape dismisses the tooltip while it is visible.
  useEffect(() => {
    if (!visible) return
    const handle = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') hide()
    }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [visible, hide])

  const isShown = visible && !disabled
  const describedBy =
    [children.props['aria-describedby'], isShown ? tooltipId : undefined]
      .filter(Boolean)
      .join(' ') || undefined

  const trigger = cloneElement(children, { 'aria-describedby': describedBy })

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => show(false)}
      onMouseLeave={hide}
      onFocus={() => show(true)}
      onBlur={hide}
    >
      {trigger}
      {isShown && (
        <div
          role="tooltip"
          id={tooltipId}
          data-side={side}
          style={{
            ...SIDE_STYLE[side],
            borderColor: `${border}44`,
            backgroundColor: 'var(--sk-bg)',
          }}
          className={cn(
            'absolute z-50 pointer-events-none',
            'w-max max-w-[280px] rounded-[8px] border px-[9px] py-[6px]',
            'font-sans text-[12px] leading-snug',
            'text-[var(--sk-text)] select-none',
            'shadow-[0_4px_16px_-4px_var(--sk-shadow-b),0_1px_3px_var(--sk-shadow-c)]',
            'backdrop-blur-[8px] [-webkit-backdrop-filter:blur(8px)]',
            className,
          )}
        >
          {content}
        </div>
      )}
    </span>
  )
}
