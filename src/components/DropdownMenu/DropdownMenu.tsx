import {
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type AriaAttributes,
  type CSSProperties,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react'
import { cn } from '../../lib/utils'
import { resolveAccent } from '../../lib/accent'
import { TONE_BORDER, TONE_FILL } from '../../tokens/tones'
import type { Tone } from '../../tokens/tones'
import { ThemeContext } from '../Theme/ThemeProvider'
import { playCue } from '../../sound'

export type DropdownMenuSide = 'top' | 'bottom' | 'left' | 'right'
export type DropdownMenuAlign = 'start' | 'center' | 'end'

type DropdownMenuTriggerProps = Pick<
  AriaAttributes,
  'aria-haspopup' | 'aria-expanded' | 'aria-controls'
>

export interface DropdownMenuProps {
  trigger: ReactElement<DropdownMenuTriggerProps>
  children?: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  side?: DropdownMenuSide
  align?: DropdownMenuAlign
  tone?: Tone
  accentColor?: string
  /** Applied to the relative wrapper around the trigger. */
  className?: string
  /** Applied to the floating menu panel. */
  contentClassName?: string
}

export interface DropdownMenuItemProps {
  onSelect?: () => void
  disabled?: boolean
  icon?: ReactNode
  shortcut?: ReactNode
  destructive?: boolean
  children?: ReactNode
  className?: string
}

export interface DropdownMenuSeparatorProps {
  className?: string
}

export interface DropdownMenuLabelProps {
  children?: ReactNode
  className?: string
}

interface DropdownMenuContextValue {
  closeMenu: (restoreFocus?: boolean) => void
}

const DropdownMenuContext = createContext<DropdownMenuContextValue>({ closeMenu: () => {} })

function panelPosition(side: DropdownMenuSide, align: DropdownMenuAlign): CSSProperties {
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

export function DropdownMenuItem({
  onSelect,
  disabled = false,
  icon,
  shortcut,
  destructive = false,
  children,
  className,
}: DropdownMenuItemProps) {
  const { closeMenu } = useContext(DropdownMenuContext)

  const handleClick = () => {
    if (disabled) return
    onSelect?.()
    playCue('commit')
    closeMenu(true)
  }

  return (
    <button
      type="button"
      role="menuitem"
      tabIndex={-1}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      onClick={handleClick}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.focus()
      }}
      className={cn(
        'group w-full flex items-center gap-[10px] px-[10px] py-[7px] rounded-[8px]',
        'text-left text-[13px] leading-none outline-none cursor-pointer',
        'transition-colors duration-75',
        'focus:bg-[var(--sk-surface-filled)] hover:bg-[var(--sk-surface-filled)]',
        destructive ? 'text-[var(--sk-text-error)]' : 'text-[var(--sk-text)]',
        disabled && 'opacity-40 cursor-not-allowed hover:bg-transparent focus:bg-transparent',
        className,
      )}
    >
      {icon != null && (
        <span className="shrink-0 flex items-center text-[var(--sk-text-muted)]">{icon}</span>
      )}
      <span className="flex-1 min-w-0 truncate">{children}</span>
      {shortcut != null && (
        <span className="shrink-0 text-[11px] text-[var(--sk-text-muted)] tabular-nums">
          {shortcut}
        </span>
      )}
    </button>
  )
}

export function DropdownMenuSeparator({ className }: DropdownMenuSeparatorProps) {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={cn('my-[4px] h-px bg-[var(--sk-border-subtle)]', className)}
    />
  )
}

export function DropdownMenuLabel({ children, className }: DropdownMenuLabelProps) {
  return (
    <div
      role="presentation"
      className={cn(
        'px-[10px] pt-[6px] pb-[4px] select-none',
        'text-[11px] font-medium uppercase tracking-wide text-[var(--sk-text-muted)]',
        className,
      )}
    >
      {children}
    </div>
  )
}

function DropdownMenuRoot({
  trigger,
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  side = 'bottom',
  align = 'start',
  tone = 'lavender',
  accentColor: accentColorProp,
  className,
  contentClassName,
}: DropdownMenuProps) {
  const autoId = useId()
  const menuId = `dropdown-menu-${autoId}`

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
  const typeaheadBufferRef = useRef('')
  const typeaheadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const getItems = useCallback((): HTMLElement[] => {
    const root = contentRef.current
    if (!root) return []
    return Array.from(root.querySelectorAll<HTMLElement>('[role="menuitem"]')).filter(
      (el) => el.getAttribute('aria-disabled') !== 'true',
    )
  }, [])

  const focusItemAt = useCallback(
    (index: number) => {
      const items = getItems()
      if (items.length === 0) {
        contentRef.current?.focus()
        return
      }
      const i = ((index % items.length) + items.length) % items.length
      items[i]?.focus()
    },
    [getItems],
  )

  const openMenu = useCallback(() => {
    previousFocusRef.current = (document.activeElement as HTMLElement | null) ?? null
    shouldRestoreRef.current = true
    if (!isControlled) setOpenUncontrolled(true)
    onOpenChange?.(true)
  }, [isControlled, onOpenChange])

  const closeMenu = useCallback(
    (restoreFocus = true) => {
      shouldRestoreRef.current = restoreFocus
      if (!isControlled) setOpenUncontrolled(false)
      onOpenChange?.(false)
    },
    [isControlled, onOpenChange],
  )

  // Focus the first enabled item when the menu opens.
  useEffect(() => {
    if (!isOpen) return
    if (previousFocusRef.current == null) {
      previousFocusRef.current = (document.activeElement as HTMLElement | null) ?? null
    }
    const items = getItems()
    if (items.length > 0) items[0]?.focus()
    else contentRef.current?.focus()
  }, [isOpen, getItems])

  // Play open/close cues and restore focus when the menu closes.
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
      if (!rootRef.current?.contains(e.target as Node)) closeMenu(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [isOpen, closeMenu])

  // Clean up the typeahead timer on unmount.
  useEffect(
    () => () => {
      if (typeaheadTimerRef.current != null) clearTimeout(typeaheadTimerRef.current)
    },
    [],
  )

  const runTypeahead = useCallback((key: string, items: HTMLElement[], currentIndex: number) => {
    if (typeaheadTimerRef.current != null) clearTimeout(typeaheadTimerRef.current)
    typeaheadBufferRef.current += key.toLowerCase()
    const buffer = typeaheadBufferRef.current
    const ordered = [...items.slice(currentIndex + 1), ...items.slice(0, currentIndex + 1)]
    const match = ordered.find((el) => (el.textContent ?? '').toLowerCase().startsWith(buffer))
    if (match) match.focus()
    typeaheadTimerRef.current = setTimeout(() => {
      typeaheadBufferRef.current = ''
    }, 500)
  }, [])

  const onMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      closeMenu(true)
      return
    }

    const items = getItems()
    if (items.length === 0) return

    const activeEl = document.activeElement
    const currentIndex = activeEl instanceof HTMLElement ? items.indexOf(activeEl) : -1

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        focusItemAt(currentIndex + 1)
        break
      case 'ArrowUp':
        e.preventDefault()
        focusItemAt(currentIndex - 1)
        break
      case 'Home':
        e.preventDefault()
        focusItemAt(0)
        break
      case 'End':
        e.preventDefault()
        focusItemAt(items.length - 1)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (currentIndex >= 0) items[currentIndex]?.click()
        break
      default:
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
          runTypeahead(e.key, items, currentIndex)
        }
    }
  }

  const contextValue = useMemo<DropdownMenuContextValue>(() => ({ closeMenu }), [closeMenu])

  const triggerEl = cloneElement(trigger, {
    'aria-haspopup': 'menu',
    'aria-expanded': isOpen,
    'aria-controls': isOpen ? menuId : undefined,
  })

  const panelStyle: CSSProperties = {
    ...panelPosition(side, align),
    borderColor: `${border}40`,
    background: 'var(--sk-bg)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    boxShadow:
      '0 12px 32px -8px var(--sk-shadow-b), 0 2px 6px var(--sk-shadow-c), inset 0 0 0 1px var(--sk-border)',
    animation: 'dialog-overlay-in 120ms ease both',
  }

  return (
    <span ref={rootRef} className={cn('relative inline-flex', className)}>
      <span onClick={() => (isOpen ? closeMenu(true) : openMenu())} style={{ display: 'contents' }}>
        {triggerEl}
      </span>

      {isOpen && (
        <div
          ref={contentRef}
          id={menuId}
          role="menu"
          aria-orientation="vertical"
          tabIndex={-1}
          onKeyDown={onMenuKeyDown}
          style={panelStyle}
          className={cn(
            'absolute z-50 outline-none p-[4px]',
            'min-w-[180px] max-w-[320px] rounded-[12px] border',
            'font-[system-ui,_-apple-system,_sans-serif]',
            contentClassName,
          )}
        >
          <DropdownMenuContext.Provider value={contextValue}>
            {children}
          </DropdownMenuContext.Provider>
        </div>
      )}
    </span>
  )
}

export const DropdownMenu = Object.assign(DropdownMenuRoot, {
  Item: DropdownMenuItem,
  Separator: DropdownMenuSeparator,
  Label: DropdownMenuLabel,
})
