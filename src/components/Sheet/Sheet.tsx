import {
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../lib/utils'
import { resolveAccent } from '../../lib/accent'
import { TONE_BORDER, TONE_FILL } from '../../tokens/tones'
import { ThemeContext } from '../Theme/ThemeProvider'
import { playCue } from '../../sound'

export type SheetSide = 'bottom' | 'top' | 'right' | 'left'
export type SheetTone =
  | 'rose'
  | 'peach'
  | 'lemon'
  | 'mint'
  | 'sky'
  | 'lavender'
  | 'lilac'
  | 'neutral'
export type SheetSize = 'sm' | 'default' | 'lg' | 'full'

export interface SheetProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: ReactNode
  title?: ReactNode
  description?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  /** Edge the panel is anchored to. Defaults to `bottom` (mobile-first). */
  side?: SheetSide
  size?: SheetSize
  closable?: boolean
  closeOnOverlay?: boolean
  /** Show a grab handle on bottom sheets. Defaults to `true`. */
  handle?: boolean
  /** Accessible label for the close button. Defaults to `"Close"`. */
  closeLabel?: string
  tone?: SheetTone
  accentColor?: string
  /** Panel border radius in px. Defaults to `24`. */
  radius?: number
  /** Extra info announced to screen readers while open. */
  ariaLabel?: string
  className?: string
}

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

const SIZE_W: Record<SheetSize, string> = {
  sm: '340px',
  default: '420px',
  lg: '560px',
  full: '100vw',
}

const SIZE_H: Record<SheetSize, string> = {
  sm: '42dvh',
  default: '68dvh',
  lg: '88dvh',
  full: '100dvh',
}

const ENTER: Record<SheetSide, string> = {
  right: 'sheet-in-right 300ms cubic-bezier(0.34, 1.42, 0.64, 1) both',
  left: 'sheet-in-left 300ms cubic-bezier(0.34, 1.42, 0.64, 1) both',
  top: 'sheet-in-top 300ms cubic-bezier(0.34, 1.42, 0.64, 1) both',
  bottom: 'sheet-in-bottom 300ms cubic-bezier(0.34, 1.42, 0.64, 1) both',
}

const EXIT: Record<SheetSide, string> = {
  right: 'sheet-out-right 200ms cubic-bezier(0.4, 0, 1, 1) both',
  left: 'sheet-out-left 200ms cubic-bezier(0.4, 0, 1, 1) both',
  top: 'sheet-out-top 200ms cubic-bezier(0.4, 0, 1, 1) both',
  bottom: 'sheet-out-bottom 200ms cubic-bezier(0.4, 0, 1, 1) both',
}

const SIDE_CLASS: Record<SheetSide, string> = {
  right: 'inset-y-0 right-0 h-full border-l',
  left: 'inset-y-0 left-0 h-full border-r',
  top: 'inset-x-0 top-0 w-full border-b',
  bottom: 'inset-x-0 bottom-0 w-full border-t',
}

const XIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

type AnimState = 'closed' | 'open' | 'closing'

export function Sheet({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  side = 'bottom',
  size = 'default',
  closable = true,
  closeOnOverlay = true,
  handle = true,
  closeLabel = 'Close',
  tone = 'lavender',
  accentColor: accentColorProp,
  radius = 24,
  ariaLabel,
  className,
}: SheetProps) {
  const autoId = useId()
  const titleId = `sheet-title-${autoId}`
  const descId = description ? `sheet-desc-${autoId}` : undefined

  const { accentColor: ctxAccent } = useContext(ThemeContext)
  const { fill: accentFill, border: accentBorder } = resolveAccent(
    tone,
    TONE_FILL,
    TONE_BORDER,
    accentColorProp ?? ctxAccent,
  )

  const isControlled = openProp !== undefined
  const [openUncontrolled, setOpenUncontrolled] = useState(defaultOpen)
  const isOpen = isControlled ? openProp! : openUncontrolled

  const [animState, setAnimState] = useState<AnimState>(isOpen ? 'open' : 'closed')
  const panelRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      if (previousFocusRef.current == null) {
        previousFocusRef.current = (document.activeElement as HTMLElement | null) ?? null
      }
      setAnimState('open')
      playCue('open')
    } else if (animState === 'open') {
      setAnimState('closing')
      playCue('close')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  // Return focus to the trigger once the exit animation finishes.
  useEffect(() => {
    if (animState !== 'closed') return
    const previous = previousFocusRef.current
    previousFocusRef.current = null
    if (previous && document.contains(previous)) previous.focus()
  }, [animState])

  const close = useCallback(() => {
    if (!isControlled) setOpenUncontrolled(false)
    onOpenChange?.(false)
  }, [isControlled, onOpenChange])

  const open = useCallback(() => {
    if (!isControlled) setOpenUncontrolled(true)
    onOpenChange?.(true)
  }, [isControlled, onOpenChange])

  useEffect(() => {
    if (animState !== 'closed') {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [animState])

  useEffect(() => {
    if (animState === 'closed') return
    const handleKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [animState, close])

  useEffect(() => {
    if (animState !== 'open') return
    const panel = panelRef.current
    if (!panel) return
    const first = panel.querySelector<HTMLElement>(FOCUSABLE)
    ;(first ?? panel).focus()
  }, [animState])

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab') return
    const panel = panelRef.current
    if (!panel) return
    const els = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => !el.closest('[disabled]'),
    )
    if (els.length === 0) return
    const first = els[0]
    const last = els[els.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const isVerticalEdge = side === 'bottom' || side === 'top'
  const radiusStyle = isVerticalEdge
    ? { borderTopLeftRadius: side === 'bottom' ? radius : 0, borderTopRightRadius: side === 'bottom' ? radius : 0, borderBottomLeftRadius: side === 'top' ? radius : 0, borderBottomRightRadius: side === 'top' ? radius : 0 }
    : { borderTopLeftRadius: side === 'right' ? radius : 0, borderBottomLeftRadius: side === 'right' ? radius : 0, borderTopRightRadius: side === 'left' ? radius : 0, borderBottomRightRadius: side === 'left' ? radius : 0 }

  const panelStyle: CSSProperties = {
    ...(isVerticalEdge
      ? { maxHeight: SIZE_H[size], width: '100%' }
      : { width: SIZE_W[size], maxWidth: '92vw', height: '100%' }),
    ...radiusStyle,
    background: 'var(--sk-bg)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    boxShadow:
      '0 24px 60px -12px var(--sk-shadow-a), 0 8px 24px -4px var(--sk-shadow-b)',
    borderColor: 'var(--sk-border)',
    paddingBottom:
      side === 'bottom' ? 'max(0px, env(safe-area-inset-bottom))' : undefined,
    animation: animState === 'closing' ? EXIT[side] : ENTER[side],
  }

  const overlayStyle: CSSProperties = {
    animation:
      animState === 'closing'
        ? 'dialog-overlay-out 200ms ease both'
        : 'dialog-overlay-in 200ms ease both',
  }

  if (animState === 'closed') {
    return trigger ? (
      <span onClick={open} style={{ display: 'contents' }}>
        {trigger}
      </span>
    ) : null
  }

  const portal = createPortal(
    <div
      role="presentation"
      style={overlayStyle}
      className="fixed inset-0 z-50"
      onMouseDown={(e) => {
        if (closeOnOverlay && e.target === e.currentTarget) close()
      }}
      onAnimationEnd={() => {
        if (animState === 'closing') setAnimState('closed')
      }}
    >
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'rgba(0,0,0,0.38)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title == null ? ariaLabel : undefined}
        aria-labelledby={title != null ? titleId : undefined}
        aria-describedby={descId}
        tabIndex={-1}
        style={panelStyle}
        onKeyDown={handleKeyDown}
        className={cn(
          'absolute flex flex-col font-sans outline-none',
          SIDE_CLASS[side],
          className,
        )}
      >
        {handle && side === 'bottom' ? (
          <div className="flex shrink-0 justify-center pt-2.5" aria-hidden="true">
            <div className="h-1 w-10 rounded-full bg-[var(--sk-border-strong)]" />
          </div>
        ) : null}

        {(title != null || description != null || closable) && (
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[var(--sk-border-subtle)] px-[20px] pt-[16px] pb-[13px]">
            <div className="min-w-0 flex-1">
              {title != null && (
                <div
                  id={titleId}
                  className="text-[15px] leading-snug font-semibold text-[var(--sk-text)]"
                >
                  {title}
                </div>
              )}
              {description != null && (
                <div
                  id={descId}
                  className="mt-1 text-[12px] leading-snug text-[var(--sk-text-desc)]"
                >
                  {description}
                </div>
              )}
            </div>
            {closable && (
              <button
                type="button"
                aria-label={closeLabel}
                onClick={close}
                className="flex h-[30px] w-[30px] shrink-0 cursor-pointer items-center justify-center rounded-[9px] text-[var(--sk-text-muted)] outline-none transition-colors duration-100 hover:bg-[var(--sk-surface-filled)] hover:text-[var(--sk-text)] focus-visible:ring-2 focus-visible:ring-[var(--sk-border-strong)]"
                style={{ color: accentBorder }}
              >
                <XIcon />
              </button>
            )}
          </div>
        )}

        <div className="sk-scrollbar min-h-0 flex-1 overflow-y-auto px-[20px] py-[18px] text-[13px] leading-relaxed text-[var(--sk-text)]">
          {children}
        </div>

        {footer != null && (
          <div className="flex shrink-0 items-center justify-end gap-[10px] border-t border-[var(--sk-border-subtle)] px-[20px] py-[14px]">
            {footer}
          </div>
        )}

        <div
          className="pointer-events-none absolute inset-x-[15%] top-0 h-[2px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${accentFill}cc, transparent)`,
          }}
        />
      </div>
    </div>,
    document.body,
  )

  return (
    <>
      {trigger && (
        <span onClick={open} style={{ display: 'contents' }}>
          {trigger}
        </span>
      )}
      {portal}
    </>
  )
}
