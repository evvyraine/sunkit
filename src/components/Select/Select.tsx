import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type CSSProperties,
} from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { playCue } from '../../sound'
import { hexToAccentPair } from '../../lib/accent'
import { ThemeContext } from '../Theme/ThemeProvider'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

const triggerVariants = cva(
  [
    'w-full min-w-0 inline-flex items-center justify-between gap-2',
    'font-sans text-base leading-none sm:text-[13px]',
    'text-[var(--sk-text)]',
    'outline-none cursor-pointer select-none',
    'transition-[box-shadow,border-color,background-color,opacity] duration-[150ms] ease-out',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'bg-[var(--sk-surface)] border rounded-[var(--field-radius)]',
          'btn-shadow hover:btn-shadow-hover',
          'hover:brightness-[1.03]',
          'focus-visible:btn-shadow-hover',
        ].join(' '),
        filled: [
          'bg-[var(--sk-surface-filled)] border border-[var(--sk-border)] rounded-[var(--field-radius)]',
          'shadow-[inset_0_1px_3px_var(--sk-shadow-b)]',
          'hover:bg-[var(--sk-surface-hover)]',
          'focus-visible:bg-[var(--sk-surface)]',
        ].join(' '),
        ghost: [
          'bg-transparent border-0 border-b-[1.5px] border-[var(--sk-border-strong)] rounded-none',
          'hover:border-[var(--sk-border-strong)]',
          'focus-visible:border-b-2 focus-visible:bg-[var(--sk-surface)]',
        ].join(' '),
      },
      tone: {
        rose: 'border-pastel-rose-dark/[0.25]     focus-visible:border-pastel-rose-dark/[0.55]',
        peach: 'border-pastel-peach-dark/[0.25]    focus-visible:border-pastel-peach-dark/[0.55]',
        lemon: 'border-pastel-lemon-dark/[0.25]    focus-visible:border-pastel-lemon-dark/[0.55]',
        mint: 'border-pastel-mint-dark/[0.25]     focus-visible:border-pastel-mint-dark/[0.55]',
        sky: 'border-pastel-sky-dark/[0.25]      focus-visible:border-pastel-sky-dark/[0.55]',
        lavender:
          'border-pastel-lavender-dark/[0.25] focus-visible:border-pastel-lavender-dark/[0.55]',
        lilac: 'border-pastel-lilac-dark/[0.25]    focus-visible:border-pastel-lilac-dark/[0.55]',
        neutral:
          'border-pastel-neutral-dark/[0.25]  focus-visible:border-pastel-neutral-dark/[0.55]',
        custom: 'border-[var(--sk-border)]',
      },
      size: {
        default: 'h-[40px] px-[12px] py-[10px]',
        sm: 'h-[32px] px-[10px] py-[8px] text-[12px]',
      },
      invalid: {
        true: 'border-red-600/50 focus-visible:border-red-600/70',
        false: '',
      },
    },
    defaultVariants: { variant: 'default', tone: 'neutral', size: 'default', invalid: false },
  },
)

export type SelectVariantProps = VariantProps<typeof triggerVariants>

export interface SelectProps extends Omit<SelectVariantProps, 'tone'> {
  tone?: NonNullable<SelectVariantProps['tone']> | (string & {})
  accentColor?: string
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  searchable?: boolean
  /** Placeholder for the search box when `searchable`. */
  searchPlaceholder?: string
  /** Message shown when a search returns no options. */
  emptyMessage?: ReactNode
  label?: ReactNode
  description?: ReactNode
  error?: ReactNode
  radius?: number
  id?: string
  'aria-describedby'?: string
  containerClassName?: string
  className?: string
}

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      transition: 'transform 180ms cubic-bezier(0.34,1.42,0.64,1)',
      transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
      flexShrink: 0,
    }}
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
)

const CheckIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
)

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    options,
    value: valueProp,
    defaultValue,
    onChange,
    placeholder = 'Select…',
    disabled = false,
    searchable = false,
    searchPlaceholder = 'Search…',
    emptyMessage = 'No options',
    label,
    description,
    error,
    radius = 12,
    id,
    'aria-describedby': ariaDescribedBy,
    containerClassName,
    className,
    variant = 'default',
    tone,
    size = 'default',
    invalid,
    accentColor: accentColorProp,
  },
  ref,
) {
  const autoId = useId()
  const triggerId = id ?? `select-${autoId}`
  const listId = `${triggerId}-list`
  const descriptionId = description ? `${triggerId}-description` : undefined
  const errorId = error ? `${triggerId}-error` : undefined
  const describedBy =
    [ariaDescribedBy, descriptionId, errorId].filter(Boolean).join(' ') || undefined
  const isInvalid = invalid ?? Boolean(error)

  const { accentColor: ctxAccent } = useContext(ThemeContext)
  const resolvedAccent = accentColorProp ?? ctxAccent

  const isControlled = valueProp !== undefined
  const [valueUncontrolled, setValueUncontrolled] = useState(defaultValue ?? '')
  const value = isControlled ? valueProp! : valueUncontrolled

  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [activeIdx, setActiveIdx] = useState<number>(-1)
  const [search, setSearch] = useState('')

  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const setRef = useCallback(
    (node: HTMLButtonElement | null) => {
      ;(triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
      if (typeof ref === 'function') ref(node)
      else if (ref != null) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
    },
    [ref],
  )

  const filtered =
    searchable && search
      ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
      : options

  const openPanel = useCallback(() => {
    if (disabled) return
    setClosing(false)
    setOpen(true)
    setSearch('')
    const idx = filtered.findIndex((o) => o.value === value)
    setActiveIdx(idx >= 0 ? idx : 0)
    playCue('menuOpen')
  }, [disabled, filtered, value])

  const closePanel = useCallback(() => {
    setClosing(true)
  }, [])

  const selectOption = useCallback(
    (opt: SelectOption) => {
      if (opt.disabled) return
      if (!isControlled) setValueUncontrolled(opt.value)
      onChange?.(opt.value)
      playCue('commit')
      closePanel()
    },
    [isControlled, onChange, closePanel],
  )

  useEffect(() => {
    if (!open) return
    const handle = (e: MouseEvent) => {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !panelRef.current?.contains(e.target as Node)
      )
        closePanel()
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open, closePanel])

  useEffect(() => {
    if (open && searchable) setTimeout(() => searchRef.current?.focus(), 10)
  }, [open, searchable])

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault()
      if (!open) openPanel()
      else setActiveIdx((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (open) setActiveIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Escape') {
      closePanel()
    }
  }

  const onPanelKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const opt = filtered[activeIdx]
      if (opt) selectOption(opt)
    } else if (e.key === 'Escape') closePanel()
  }

  const selectedLabel = options.find((o) => o.value === value)?.label

  const effectiveTone = resolvedAccent
    ? 'custom'
    : ((tone as SelectVariantProps['tone'] | undefined) ?? 'neutral')

  let accentBorderStyle: CSSProperties | undefined
  if (resolvedAccent && !isInvalid) {
    const { border } = hexToAccentPair(resolvedAccent)
    accentBorderStyle = { borderColor: open ? `${border}99` : `${border}44` }
  }

  let accentCheckStyle: CSSProperties | undefined
  if (resolvedAccent) {
    const { border } = hexToAccentPair(resolvedAccent)
    accentCheckStyle = { color: border }
  }

  const dropdownStyle: CSSProperties = {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    left: 0,
    right: 0,
    zIndex: 50,
    borderRadius: radius,
    background: 'var(--sk-bg)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow:
      '0 4px 24px -4px var(--sk-shadow-b), 0 1px 3px var(--sk-shadow-c), inset 0 0 0 1px var(--sk-border)',
    overflow: 'hidden',
    maxHeight: 260,
    display: 'flex',
    flexDirection: 'column',
  }

  return (
    <div
      className={cn('w-full', containerClassName)}
      style={{ '--field-radius': `${radius}px` } as CSSProperties}
    >
      {label != null && (
        <label
          htmlFor={triggerId}
          className={cn(
            'block mb-[6px] text-[12px] leading-none font-medium text-[var(--sk-text-label)]',
            disabled && 'opacity-60',
          )}
        >
          {label}
        </label>
      )}

      <div className="relative w-full">
        <button
          ref={setRef}
          id={triggerId}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-activedescendant={
            open && activeIdx >= 0 && filtered[activeIdx]
              ? `${listId}-option-${activeIdx}`
              : undefined
          }
          aria-invalid={isInvalid || undefined}
          aria-describedby={describedBy}
          disabled={!!disabled}
          onClick={() => (open ? closePanel() : openPanel())}
          onKeyDown={onTriggerKeyDown}
          className={cn(
            triggerVariants({ variant, tone: effectiveTone, size, invalid: isInvalid }),
            className,
          )}
          style={accentBorderStyle}
        >
          <span className={cn('truncate', !selectedLabel && 'text-[var(--sk-text-placeholder)]')}>
            {selectedLabel ?? placeholder}
          </span>
          <span className="text-[var(--sk-text-muted)]">
            <ChevronIcon open={open} />
          </span>
        </button>

        {(open || closing) && (
          <div
            ref={panelRef}
            role="listbox"
            id={listId}
            onKeyDown={onPanelKeyDown}
            style={{
              ...dropdownStyle,
              animation: closing
                ? 'dropdown-out 140ms cubic-bezier(0.4, 0, 1, 1) both'
                : 'dropdown-in 200ms cubic-bezier(0.34, 1.42, 0.64, 1) both',
              transformOrigin: 'top center',
            }}
            onAnimationEnd={() => {
              if (closing) {
                setOpen(false)
                setClosing(false)
                setSearch('')
                triggerRef.current?.focus()
              }
            }}
          >
            {searchable && (
              <div className="p-[6px] border-b border-[var(--sk-border-subtle)]">
                <input
                  ref={searchRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setActiveIdx(0)
                  }}
                  className="w-full outline-none bg-transparent text-base sm:text-[13px] text-[var(--sk-text)] placeholder:text-[var(--sk-text-placeholder)] px-[6px] py-[4px]"
                />
              </div>
            )}
            <div className="overflow-y-auto p-[4px]" style={{ maxHeight: searchable ? 210 : 252 }}>
              {filtered.length === 0 ? (
                <div className="text-[12px] text-[var(--sk-text-muted)] px-[10px] py-[8px]">
                  {emptyMessage}
                </div>
              ) : (
                filtered.map((opt, idx) => (
                  <button
                    key={opt.value}
                    id={`${listId}-option-${idx}`}
                    type="button"
                    role="option"
                    aria-selected={opt.value === value}
                    aria-disabled={opt.disabled}
                    tabIndex={-1}
                    onMouseEnter={() => setActiveIdx(idx)}
                    onClick={() => selectOption(opt)}
                    className={cn(
                      'w-full flex items-center justify-between gap-2 px-[10px] py-[8px] rounded-[8px]',
                      'text-base sm:text-[13px] text-[var(--sk-text)] leading-[1.2] text-left outline-none cursor-pointer',
                      'transition-colors duration-75',
                      idx === activeIdx && !opt.disabled && 'bg-[var(--sk-surface-filled)]',
                      opt.value === value && 'font-medium',
                      opt.disabled && 'opacity-40 cursor-not-allowed',
                    )}
                  >
                    <span className="truncate">{opt.label}</span>
                    {opt.value === value && (
                      <span
                        className="text-[var(--sk-text-muted)] shrink-0"
                        style={accentCheckStyle}
                      >
                        <CheckIcon />
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {description != null && (
        <div
          id={descriptionId}
          className="mt-[6px] text-[12px] leading-snug text-[var(--sk-text-desc)]"
        >
          {description}
        </div>
      )}
      {error != null && (
        <div id={errorId} className="mt-[6px] text-[12px] leading-snug text-[var(--sk-text-error)]">
          {error}
        </div>
      )}
    </div>
  )
})
