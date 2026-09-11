import {
  cloneElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type AriaAttributes,
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

export type PopoverSide = 'top' | 'bottom' | 'left' | 'right'
export type PopoverAlign = 'start' | 'center' | 'end'

type PopoverTriggerProps = Pick<AriaAttributes, 'aria-haspopup' | 'aria-expanded' | 'aria-controls'>

export interface PopoverProps {
  trigger: ReactElement<PopoverTriggerProps>
  children?: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  side?: PopoverSide
  align?: PopoverAlign
  tone?: Tone
  accentColor?: string
  /** Show the built-in close button in the top-right corner. Defaults to `true`. */
  showClose?: boolean
  /** Accessible label for the close button. Defaults to `"Close"`. */
  closeLabel?: string
  /** Applied to the relative wrapper around the trigger. */
  className?: string
  /** Applied to the floating content panel. */
  contentClassName?: string
}

function panelPosition(side: PopoverSide, align: PopoverAlign): CSSProperties {
  const pos: CSSProperties = {}
  const horizontal = side === 'top' || side === 'bottom'

  if (side === 'top') pos.bottom = 'calc(100% + 8px)'
  if (side === 'bottom') pos.top = 'calc(100% + 8px)'
  if (side === 'left') pos.right = 'calc(100% + 8px)'
  if (side === 'right') pos.left = 'calc(100% + 8px)'

  if (horizontal) {
    if (align === 'start') pos.left = 0
    else if (align === 'end') pos.right = 0
    else {
      pos.left = '50%'
      pos.transform = 'translateX(-50%)'
    }
  } else {
    if (align === 'start') pos.top = 0
    else if (align === 'end') pos.bottom = 0
    else {
      pos.top = '50%'
      pos.transform = 'translateY(-50%)'
    }
  }

  return pos
}

const XIcon = () => (
  <svg
    width="13"
    height="13"
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

export function Popover({
  trigger,
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  side = 'bottom',
  align = 'start',
  tone = 'lavender',
  accentColor: accentColorProp,
  showClose = true,
  closeLabel = 'Close',
  className,
  contentClassName,
}: PopoverProps) {
  const autoId = useId()
  const contentId = `popover-${autoId}`

  const { accentColor: ctxAccent } = useContext(ThemeContext)
  const { border } = resolveAccent(tone, TONE_FILL, TONE_BORDER, accentColorProp ?? ctxAccent)

  const isControlled = openProp !== undefined
  const [openUncontrolled, setOpenUncontrolled] = useState(defaultOpen)
  const isOpen = isControlled ? openProp! : openUncontrolled

  const rootRef = useRef<HTMLSpanElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const shouldRestoreRef = useRef(true)
  const prevOpenRef = useRef(isOpen)

  const openPanel = useCallback(() => {
    previousFocusRef.current = (document.activeElement as HTMLElement | null) ?? null
    shouldRestoreRef.current = true
    if (!isControlled) setOpenUncontrolled(true)
    onOpenChange?.(true)
  }, [isControlled, onOpenChange])

  const closePanel = useCallback(
    (restoreFocus = true) => {
      shouldRestoreRef.current = restoreFocus
      if (!isControlled) setOpenUncontrolled(false)
      onOpenChange?.(false)
    },
    [isControlled, onOpenChange],
  )

  // Focus the panel when it opens.
  useEffect(() => {
    if (!isOpen) return
    if (previousFocusRef.current == null) {
      previousFocusRef.current = (document.activeElement as HTMLElement | null) ?? null
    }
    contentRef.current?.focus()
  }, [isOpen])

  // Play open/close cues and restore focus when the panel closes.
  useEffect(() => {
    if (prevOpenRef.current === isOpen) return
    prevOpenRef.current = isOpen
    playCue(isOpen ? 'menuOpen' : 'menuClose')
    if (!isOpen && shouldRestoreRef.current) previousFocusRef.current?.focus()
  }, [isOpen])

  // Close on outside mousedown.
  useEffect(() => {
    if (!isOpen) return
    const handle = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) closePanel(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [isOpen, closePanel])

  // Close on Escape.
  useEffect(() => {
    if (!isOpen) return
    const handle = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') closePanel(true)
    }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [isOpen, closePanel])

  const triggerEl = cloneElement(trigger, {
    'aria-haspopup': 'dialog',
    'aria-expanded': isOpen,
    'aria-controls': isOpen ? contentId : undefined,
  })

  const panelStyle: CSSProperties = {
    ...panelPosition(side, align),
    borderColor: `${border}40`,
    borderTop: `2px solid ${border}55`,
    background: 'var(--sk-bg)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    boxShadow:
      '0 12px 32px -8px var(--sk-shadow-b), 0 2px 6px var(--sk-shadow-c), inset 0 0 0 1px var(--sk-border)',
    animation: 'dialog-overlay-in 140ms ease both',
  }

  return (
    <span ref={rootRef} className={cn('relative inline-flex', className)}>
      <span
        onClick={() => (isOpen ? closePanel(true) : openPanel())}
        style={{ display: 'contents' }}
      >
        {triggerEl}
      </span>

      {isOpen && (
        <div
          ref={contentRef}
          id={contentId}
          role="dialog"
          aria-modal="false"
          tabIndex={-1}
          style={panelStyle}
          className={cn(
            'absolute z-50 outline-none',
            'min-w-[200px] max-w-[340px] rounded-[14px] border p-[14px]',
            'font-[system-ui,_-apple-system,_sans-serif] text-[13px] leading-relaxed',
            'text-[var(--sk-text)]',
            contentClassName,
          )}
        >
          {showClose && (
            <button
              type="button"
              aria-label={closeLabel}
              onClick={() => closePanel(true)}
              className="absolute top-[8px] right-[8px] flex items-center justify-center w-[24px] h-[24px] rounded-[7px] text-[var(--sk-text-muted)] hover:text-[var(--sk-text)] hover:bg-[var(--sk-surface-filled)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--sk-border-strong)] cursor-pointer transition-colors duration-100"
            >
              <XIcon />
            </button>
          )}

          {children}

          {/* Accent glow line at the top of the panel */}
          <div
            className="absolute top-0 left-[20%] right-[20%] h-[1px] pointer-events-none"
            style={{
              background: `linear-gradient(90deg, transparent, ${border}cc, transparent)`,
              borderRadius: '50%',
            }}
          />
        </div>
      )}
    </span>
  )
}
