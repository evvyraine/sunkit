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

export type DialogTone =
  | 'rose'
  | 'peach'
  | 'lemon'
  | 'mint'
  | 'sky'
  | 'lavender'
  | 'lilac'
  | 'neutral'

export type DialogSize = 'sm' | 'default' | 'lg' | 'full'

export interface DialogProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: ReactNode
  title?: ReactNode
  description?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  size?: DialogSize
  closable?: boolean
  closeOnOverlay?: boolean
  /** Accessible label for the close button. Defaults to `"Close dialog"`. */
  closeLabel?: string
  tone?: DialogTone
  accentColor?: string
  radius?: number
  className?: string
}

const SIZE_W: Record<DialogSize, string> = {
  sm: '360px',
  default: '480px',
  lg: '640px',
  full: 'min(calc(100vw - 48px), 800px)',
}

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

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

export function Dialog({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  size = 'default',
  closable = true,
  closeOnOverlay = true,
  closeLabel = 'Close dialog',
  tone = 'lavender',
  accentColor: accentColorProp,
  radius = 16,
  className,
}: DialogProps) {
  const autoId = useId()
  const titleId = `dialog-title-${autoId}`
  const descId = description ? `dialog-desc-${autoId}` : undefined

  const { accentColor: ctxAccent } = useContext(ThemeContext)
  const resolvedAccentHex = accentColorProp ?? ctxAccent
  const { fill: accentFill, border: accentBorder } = resolveAccent(
    tone,
    TONE_FILL,
    TONE_BORDER,
    resolvedAccentHex,
  )

  const isControlled = openProp !== undefined
  const [openUncontrolled, setOpenUncontrolled] = useState(defaultOpen)
  const isOpen = isControlled ? openProp! : openUncontrolled

  const [animState, setAnimState] = useState<AnimState>(isOpen ? 'open' : 'closed')
  const panelRef = useRef<HTMLDivElement>(null)

  // Sync open → animState
  useEffect(() => {
    if (isOpen) {
      setAnimState('open')
      playCue('open')
    } else if (animState === 'open') {
      setAnimState('closing')
      playCue('close')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const close = useCallback(() => {
    if (!isControlled) setOpenUncontrolled(false)
    onOpenChange?.(false)
  }, [isControlled, onOpenChange])

  const open = useCallback(() => {
    if (!isControlled) setOpenUncontrolled(true)
    onOpenChange?.(true)
  }, [isControlled, onOpenChange])

  // Scroll lock
  useEffect(() => {
    if (animState !== 'closed') {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [animState])

  // Escape key
  useEffect(() => {
    if (animState === 'closed') return
    const handle = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [animState, close])

  // Auto-focus first focusable on open
  useEffect(() => {
    if (animState !== 'open') return
    const panel = panelRef.current
    if (!panel) return
    const first = panel.querySelector<HTMLElement>(FOCUSABLE)
    ;(first ?? panel).focus()
  }, [animState])

  // Focus trap
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
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  const panelStyle: CSSProperties = {
    width: SIZE_W[size],
    maxHeight: 'calc(100vh - 80px)',
    borderRadius: radius,
    borderTop: `2px solid ${accentBorder}55`,
    background: 'var(--sk-bg)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    boxShadow:
      '0 24px 60px -12px var(--sk-shadow-a), 0 8px 24px -4px var(--sk-shadow-b), inset 0 0 0 1px var(--sk-border)',
    display: 'flex',
    flexDirection: 'column',
    animation:
      animState === 'closing'
        ? 'dialog-out 200ms cubic-bezier(0.4,0,1,1) both'
        : 'dialog-in 280ms cubic-bezier(0.34,1.42,0.64,1) both',
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
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      onMouseDown={(e) => {
        if (closeOnOverlay && e.target === e.currentTarget) close()
      }}
      onAnimationEnd={() => {
        if (animState === 'closing') setAnimState('closed')
      }}
    >
      {/* Backdrop */}
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
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={descId}
        tabIndex={-1}
        style={panelStyle}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative outline-none font-[system-ui,_-apple-system,_sans-serif]',
          'flex flex-col',
          className,
        )}
      >
        {/* Header */}
        {(title != null || closable) && (
          <div className="flex items-start justify-between gap-3 px-[22px] pt-[18px] pb-[14px] border-b border-[var(--sk-border-subtle)] shrink-0">
            <div className="flex-1 min-w-0">
              {title != null && (
                <div
                  id={titleId}
                  className="text-[15px] font-semibold leading-snug text-[var(--sk-text)]"
                >
                  {title}
                </div>
              )}
              {description != null && (
                <div
                  id={descId}
                  className="mt-[4px] text-[12px] leading-snug text-[var(--sk-text-desc)]"
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
                className="shrink-0 mt-[1px] flex items-center justify-center w-[26px] h-[26px] rounded-[7px] text-[var(--sk-text-muted)] hover:text-[var(--sk-text)] hover:bg-[var(--sk-surface-filled)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--sk-border-strong)] cursor-pointer transition-colors duration-100"
                style={{ color: accentBorder + 'bb' }}
              >
                <XIcon />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        {children != null && (
          <div className="flex-1 overflow-y-auto px-[22px] py-[18px] text-[13px] leading-relaxed text-[var(--sk-text)]">
            {children}
          </div>
        )}

        {/* Footer */}
        {footer != null && (
          <div className="shrink-0 flex items-center justify-end gap-[10px] px-[22px] py-[14px] border-t border-[var(--sk-border-subtle)]">
            {footer}
          </div>
        )}

        {/* Accent glow line at top */}
        <div
          className="absolute top-0 left-[20%] right-[20%] h-[1px] pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, ${accentFill}cc, transparent)`,
            borderRadius: '50%',
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
