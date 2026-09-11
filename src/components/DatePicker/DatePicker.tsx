import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { cn } from '../../lib/utils'
import { playCue } from '../../sound'
import { resolveAccent } from '../../lib/accent'
import { TONE_BORDER, TONE_FILL } from '../../tokens/tones'
import { ThemeContext } from '../Theme/ThemeProvider'

export type DatePickerTone =
  | 'rose'
  | 'peach'
  | 'lemon'
  | 'mint'
  | 'sky'
  | 'lavender'
  | 'lilac'
  | 'neutral'

export type DatePickerSize = 'default' | 'sm'
export type DatePickerMode = 'single' | 'range'
export type DateRange = [Date | null, Date | null]

export interface DatePickerProps {
  mode?: DatePickerMode
  value?: Date | null
  defaultValue?: Date | null
  onChange?: (date: Date | null) => void
  rangeValue?: DateRange
  defaultRangeValue?: DateRange
  onRangeChange?: (range: DateRange) => void
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
  label?: ReactNode
  description?: ReactNode
  tone?: DatePickerTone
  accentColor?: string
  size?: DatePickerSize
  placeholder?: string
  id?: string
  className?: string
  containerClassName?: string
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function isBeforeDay(a: Date, b: Date) {
  return (
    new Date(a.getFullYear(), a.getMonth(), a.getDate()) <
    new Date(b.getFullYear(), b.getMonth(), b.getDate())
  )
}

function isAfterDay(a: Date, b: Date) {
  return (
    new Date(a.getFullYear(), a.getMonth(), a.getDate()) >
    new Date(b.getFullYear(), b.getMonth(), b.getDate())
  )
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatRange([start, end]: DateRange): string {
  if (!start && !end) return ''
  if (start && !end) return formatDate(start)
  if (!start && end) return formatDate(end)
  return `${formatDate(start!)} – ${formatDate(end!)}`
}

function parseDate(s: string): Date | null {
  const t = s.trim()
  if (!t) return null
  const native = new Date(t)
  if (!isNaN(native.getTime()) && native.getFullYear() > 1000 && native.getFullYear() < 3000)
    return native
  const mdy = t.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)
  if (mdy) {
    const d = new Date(+mdy[3], +mdy[1] - 1, +mdy[2])
    if (!isNaN(d.getTime())) return d
  }
  const ymd = t.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/)
  if (ymd) {
    const d = new Date(+ymd[1], +ymd[2] - 1, +ymd[3])
    if (!isNaN(d.getTime())) return d
  }
  return null
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

function nextMonthOf(year: number, month: number): [number, number] {
  return month === 11 ? [year + 1, 0] : [year, month + 1]
}

// ── icons ──────────────────────────────────────────────────────────────────────

const CalendarIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const ChevronLeft = () => (
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
    <path d="M15 18l-6-6 6-6" />
  </svg>
)

const ChevronRight = () => (
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
    <path d="M9 18l6-6-6-6" />
  </svg>
)

// ── year grid ──────────────────────────────────────────────────────────────────

function YearGrid({
  activeYear,
  fill,
  border,
  onSelect,
}: {
  activeYear: number
  fill: string
  border: string
  onSelect: (y: number) => void
}) {
  const currentYear = new Date().getFullYear()
  const [base, setBase] = useState(activeYear - (activeYear % 12))
  const years = Array.from({ length: 12 }, (_, i) => base + i)

  return (
    <div>
      <div className="flex items-center justify-between px-[14px] py-[12px] border-b border-[var(--sk-border-subtle)]">
        <button
          type="button"
          onClick={() => setBase((b) => b - 12)}
          className="w-[28px] h-[28px] rounded-full flex items-center justify-center text-[var(--sk-text-muted)] hover:bg-[var(--sk-surface-filled)] hover:text-[var(--sk-text)] outline-none cursor-pointer transition-colors duration-100"
        >
          <ChevronLeft />
        </button>
        <span className="text-[13px] font-semibold text-[var(--sk-text-label)] select-none">
          {base}–{base + 11}
        </span>
        <button
          type="button"
          onClick={() => setBase((b) => b + 12)}
          className="w-[28px] h-[28px] rounded-full flex items-center justify-center text-[var(--sk-text-muted)] hover:bg-[var(--sk-surface-filled)] hover:text-[var(--sk-text)] outline-none cursor-pointer transition-colors duration-100"
        >
          <ChevronRight />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-[4px] p-[12px]">
        {years.map((y) => {
          const isActive = y === activeYear
          const isCurrent = y === currentYear
          return (
            <button
              key={y}
              type="button"
              onClick={() => onSelect(y)}
              className={cn(
                'rounded-[8px] py-[9px] text-[13px] cursor-pointer transition-colors duration-75 outline-none',
                isActive
                  ? 'font-semibold'
                  : 'text-[var(--sk-text)] hover:bg-[var(--sk-surface-filled)]',
                isCurrent && !isActive && 'font-semibold',
              )}
              style={isActive ? { background: fill, border: `1.5px solid ${border}55` } : undefined}
            >
              {y}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── month calendar ─────────────────────────────────────────────────────────────

function MonthCalendar({
  year,
  month,
  mode,
  selectedDate,
  rangeStart,
  rangeEnd,
  hoverDate,
  minDate,
  maxDate,
  fill,
  border,
  focusedDate,
  onDayClick,
  onDayHover,
}: {
  year: number
  month: number
  mode: DatePickerMode
  selectedDate?: Date | null
  rangeStart?: Date | null
  rangeEnd?: Date | null
  hoverDate?: Date | null
  minDate?: Date
  maxDate?: Date
  fill: string
  border: string
  focusedDate?: Date | null
  onDayClick: (d: Date) => void
  onDayHover: (d: Date | null) => void
}) {
  const today = new Date()

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const cells: (Date | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))

  const isDisabled = (d: Date) =>
    (minDate != null && isBeforeDay(d, minDate)) || (maxDate != null && isAfterDay(d, maxDate))

  let effStart = rangeStart ?? null
  let effEnd = rangeEnd ?? (rangeStart && !rangeEnd ? (hoverDate ?? null) : null)
  if (effStart && effEnd && isAfterDay(effStart, effEnd)) {
    ;[effStart, effEnd] = [effEnd, effStart]
  }

  return (
    <div>
      <div className="grid grid-cols-7 px-[10px] pt-[10px] pb-[4px]">
        {DAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[11px] font-semibold text-[var(--sk-text-muted)] leading-none py-[2px]"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 px-[10px] pb-[10px] gap-y-[2px]">
        {cells.map((date, idx) => {
          if (date === null) return <div key={`e-${idx}`} />

          const isSelected =
            mode === 'single'
              ? selectedDate != null && isSameDay(date, selectedDate)
              : (rangeStart != null && isSameDay(date, rangeStart)) ||
                (rangeEnd != null && isSameDay(date, rangeEnd))

          const isRangeStart = mode === 'range' && effStart != null && isSameDay(date, effStart)
          const isRangeEnd = mode === 'range' && effEnd != null && isSameDay(date, effEnd)
          const isInRange =
            mode === 'range' &&
            effStart != null &&
            effEnd != null &&
            isAfterDay(date, effStart) &&
            isBeforeDay(date, effEnd)

          const isEdge = isSelected || isRangeStart || isRangeEnd
          const isFocused = focusedDate != null && isSameDay(date, focusedDate)
          const isToday = isSameDay(date, today)
          const isDis = isDisabled(date)

          const cellStyle: CSSProperties = isEdge
            ? {
                background: fill,
                border: `1.5px solid ${border}55`,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35)',
              }
            : isInRange
              ? { background: `${fill}99` }
              : isFocused && !isDis
                ? { background: 'var(--sk-surface-filled)' }
                : {}

          return (
            <button
              key={date.getTime()}
              type="button"
              role="gridcell"
              aria-selected={isSelected}
              aria-disabled={isDis}
              tabIndex={isFocused ? 0 : -1}
              onClick={() => !isDis && onDayClick(date)}
              onMouseEnter={() => !isDis && onDayHover(date)}
              onMouseLeave={() => onDayHover(null)}
              className={cn(
                'relative flex items-center justify-center',
                'text-[12px] text-[var(--sk-text)] leading-none aspect-square',
                'outline-none transition-colors duration-75',
                !isDis && 'cursor-pointer',
                isDis && 'opacity-30 cursor-not-allowed',
                isEdge ? 'rounded-[8px] font-semibold' : 'rounded-[8px]',
                isToday && !isEdge && 'font-semibold',
                !isEdge && !isInRange && !isDis && 'hover:bg-[var(--sk-surface-filled)]',
                isInRange && !isRangeStart && !isRangeEnd && 'rounded-none',
                isRangeStart && !isRangeEnd && 'rounded-l-[8px] rounded-r-none',
                !isRangeStart && isRangeEnd && 'rounded-r-[8px] rounded-l-none',
              )}
              style={cellStyle}
            >
              <span style={isEdge ? { color: 'rgba(20, 15, 40, 0.82)' } : undefined}>
                {date.getDate()}
              </span>
              {isToday && !isEdge && (
                <span
                  className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[3px] h-[3px] rounded-full"
                  style={{ background: border }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── main component ─────────────────────────────────────────────────────────────

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(function DatePicker(
  {
    mode = 'single',
    value: valueProp,
    defaultValue = null,
    onChange,
    rangeValue: rangeProp,
    defaultRangeValue = [null, null],
    onRangeChange,
    minDate,
    maxDate,
    disabled = false,
    label,
    description,
    tone = 'lavender',
    accentColor: accentColorProp,
    size = 'default',
    placeholder,
    id,
    className,
    containerClassName,
  },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? `datepicker-${autoId}`
  const panelId = `${inputId}-panel`
  const descId = description ? `${inputId}-desc` : undefined

  const { accentColor: ctxAccent } = useContext(ThemeContext)
  const resolvedAccentHex = accentColorProp ?? ctxAccent
  const { fill, border } = resolveAccent(tone, TONE_FILL, TONE_BORDER, resolvedAccentHex)

  // ── value state ──────────────────────────────────────────────────────────────

  const isSingleControlled = mode === 'single' && valueProp !== undefined
  const [singleUncontrolled, setSingleUncontrolled] = useState<Date | null>(defaultValue)
  const singleValue = isSingleControlled ? (valueProp ?? null) : singleUncontrolled

  const isRangeControlled = mode === 'range' && rangeProp !== undefined
  const [rangeUncontrolled, setRangeUncontrolled] = useState<DateRange>(defaultRangeValue)
  const rangeValue = isRangeControlled ? rangeProp! : rangeUncontrolled

  // ── calendar nav state ───────────────────────────────────────────────────────

  const today = new Date()
  const baseDate = mode === 'single' ? (singleValue ?? today) : (rangeValue[0] ?? today)
  const [viewYear, setViewYear] = useState(baseDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(baseDate.getMonth())
  const [calView, setCalView] = useState<'days' | 'years'>('days')
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  const [rangePicking, setRangePicking] = useState<'start' | 'end'>('start')

  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)

  // ── text input state ─────────────────────────────────────────────────────────

  const defaultPlaceholder = mode === 'range' ? 'Pick a range…' : 'Pick a date…'
  const resolvedPlaceholder = placeholder ?? defaultPlaceholder

  function getDisplayText(): string {
    if (mode === 'range') return formatRange(rangeValue)
    return singleValue ? formatDate(singleValue) : ''
  }

  const [inputText, setInputText] = useState(getDisplayText)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (!isEditing) setInputText(getDisplayText())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleValue, rangeValue[0], rangeValue[1], isEditing])

  // ── refs ─────────────────────────────────────────────────────────────────────

  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const setRef = useCallback(
    (node: HTMLInputElement | null) => {
      ;(inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node
      if (typeof ref === 'function') ref(node)
      else if (ref != null) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node
    },
    [ref],
  )

  // ── panel helpers ─────────────────────────────────────────────────────────────

  const openPanel = useCallback(() => {
    if (disabled) return
    playCue('menuOpen')
    setClosing(false)
    setCalView('days')
    setOpen(true)
  }, [disabled])

  const closePanel = useCallback(() => {
    setClosing(true)
    setHoverDate(null)
  }, [])

  useEffect(() => {
    if (!open) return
    const handle = (e: MouseEvent) => {
      if (!inputRef.current?.closest('.dp-root')?.contains(e.target as Node)) closePanel()
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open, closePanel])

  // ── nav ───────────────────────────────────────────────────────────────────────

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else setViewMonth((m) => m - 1)
    playCue('navigate')
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else setViewMonth((m) => m + 1)
    playCue('navigate')
  }

  // ── selection ─────────────────────────────────────────────────────────────────

  const selectSingle = (date: Date) => {
    if (!isSingleControlled) setSingleUncontrolled(date)
    onChange?.(date)
    playCue('commit')
    setInputText(formatDate(date))
    closePanel()
  }

  const selectRange = (date: Date) => {
    if (rangePicking === 'start' || (rangeValue[0] && rangeValue[1])) {
      const next: DateRange = [date, null]
      if (!isRangeControlled) setRangeUncontrolled(next)
      onRangeChange?.(next)
      setInputText(formatDate(date))
      setRangePicking('end')
      playCue('commit')
    } else {
      let start = rangeValue[0]!
      let end = date
      if (isAfterDay(start, end)) [start, end] = [end, start]
      const next: DateRange = [start, end]
      if (!isRangeControlled) setRangeUncontrolled(next)
      onRangeChange?.(next)
      setInputText(formatRange(next))
      setRangePicking('start')
      playCue('commit')
      closePanel()
    }
  }

  const handleDayClick = (date: Date) => {
    if (mode === 'range') selectRange(date)
    else selectSingle(date)
  }

  // ── text input handlers ───────────────────────────────────────────────────────

  const commitInput = () => {
    const text = inputText.trim()
    if (!text) {
      if (mode === 'single') {
        if (!isSingleControlled) setSingleUncontrolled(null)
        onChange?.(null)
      } else {
        const next: DateRange = [null, null]
        if (!isRangeControlled) setRangeUncontrolled(next)
        onRangeChange?.(next)
      }
      setInputText('')
      return
    }

    if (mode === 'range') {
      const parts = text.split(/\s*[–-]\s*(?=\w)/)
      const s = parseDate(parts[0] ?? '')
      const e = parts[1] ? parseDate(parts[1]) : null
      if (s) {
        const next: DateRange = [s, e ?? null]
        if (!isRangeControlled) setRangeUncontrolled(next)
        onRangeChange?.(next)
        setInputText(formatRange(next))
        setViewYear(s.getFullYear())
        setViewMonth(s.getMonth())
      } else {
        setInputText(formatRange(rangeValue))
      }
    } else {
      const d = parseDate(text)
      if (d) {
        if (!isSingleControlled) setSingleUncontrolled(d)
        onChange?.(d)
        setInputText(formatDate(d))
        setViewYear(d.getFullYear())
        setViewMonth(d.getMonth())
      } else {
        setInputText(getDisplayText())
      }
    }
  }

  // ── dimensions ────────────────────────────────────────────────────────────────

  const triggerH = size === 'sm' ? 32 : 40
  const triggerPx = size === 'sm' ? 10 : 12
  const triggerFz = size === 'sm' ? 12 : 13

  const headerTitle = `${MONTHS[viewMonth]} ${viewYear}`
  const [rightYear, rightMonth] = nextMonthOf(viewYear, viewMonth)
  const rightTitle = `${MONTHS[rightMonth]} ${rightYear}`

  const panelStyle: CSSProperties = {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    left: 0,
    zIndex: 50,
    width: mode === 'range' ? 560 : 280,
    borderRadius: 16,
    background: 'var(--sk-bg)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    boxShadow:
      '0 8px 32px -6px var(--sk-shadow-b), 0 2px 6px var(--sk-shadow-c), inset 0 0 0 1px var(--sk-border)',
    overflow: 'hidden',
  }

  const navBtnClass =
    'w-[28px] h-[28px] rounded-full flex items-center justify-center text-[var(--sk-text-muted)] hover:bg-[var(--sk-surface-filled)] hover:text-[var(--sk-text)] outline-none cursor-pointer transition-colors duration-100'
  const headingBtnClass =
    'text-[13px] font-semibold text-[var(--sk-text-label)] select-none hover:text-[var(--sk-text)] cursor-pointer transition-colors duration-100 outline-none rounded-[6px] px-[6px] py-[2px] hover:bg-[var(--sk-surface-filled)]'

  return (
    <div
      className={cn(
        'w-full font-[system-ui,_-apple-system,_sans-serif] dp-root',
        containerClassName,
      )}
    >
      {label != null && (
        <label
          htmlFor={inputId}
          className={cn(
            'block mb-[6px] text-[12px] leading-none font-medium text-[var(--sk-text-label)]',
            disabled && 'opacity-60',
          )}
        >
          {label}
        </label>
      )}

      <div className="relative">
        <div
          className={cn(
            'relative w-full inline-flex items-center',
            'bg-[var(--sk-surface)] border rounded-[12px]',
            'btn-shadow hover:btn-shadow-hover hover:brightness-[1.03]',
            'transition-[box-shadow,border-color,background-color] duration-150 ease-out',
            disabled && 'opacity-50 pointer-events-none',
            className,
          )}
          style={{
            height: triggerH,
            borderColor: open ? `${border}88` : `${border}44`,
          }}
        >
          <input
            ref={setRef}
            id={inputId}
            type="text"
            autoComplete="off"
            disabled={!!disabled}
            placeholder={resolvedPlaceholder}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls={open ? panelId : undefined}
            aria-describedby={descId}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value)
              setIsEditing(true)
            }}
            onFocus={() => {
              setIsEditing(true)
              openPanel()
            }}
            onBlur={() => {
              setIsEditing(false)
              commitInput()
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.currentTarget.blur()
              if (e.key === 'Escape') {
                closePanel()
                e.currentTarget.blur()
              }
            }}
            className={cn(
              'flex-1 min-w-0 bg-transparent outline-none cursor-text select-text',
              'placeholder:text-[var(--sk-text-placeholder)] text-[var(--sk-text)]',
            )}
            style={{ paddingInline: triggerPx, fontSize: triggerFz }}
          />
          <button
            type="button"
            tabIndex={-1}
            aria-label="Toggle calendar"
            onMouseDown={(e) => {
              e.preventDefault()
              if (open) {
                closePanel()
              } else {
                inputRef.current?.focus()
                openPanel()
              }
            }}
            className="shrink-0 flex items-center justify-center text-[var(--sk-text-muted)] hover:text-[var(--sk-text)] cursor-pointer pr-[10px] transition-colors duration-100 outline-none"
          >
            <CalendarIcon />
          </button>
        </div>

        {(open || closing) && (
          <div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-label="Date picker"
            tabIndex={-1}
            style={{
              ...panelStyle,
              animation: closing
                ? 'dropdown-out 150ms cubic-bezier(0.4, 0, 1, 1) both'
                : 'dropdown-in 220ms cubic-bezier(0.34, 1.42, 0.64, 1) both',
              transformOrigin: 'top center',
            }}
            onAnimationEnd={() => {
              if (closing) {
                setOpen(false)
                setClosing(false)
              }
            }}
          >
            {calView === 'years' ? (
              <YearGrid
                activeYear={viewYear}
                fill={fill}
                border={border}
                onSelect={(y) => {
                  setViewYear(y)
                  setCalView('days')
                }}
              />
            ) : (
              <div
                className={cn(
                  'flex',
                  mode === 'range' && 'divide-x divide-[var(--sk-border-subtle)]',
                )}
              >
                {/* Left / only month */}
                <div className={cn(mode === 'range' ? 'w-[280px]' : 'w-full')}>
                  <div className="flex items-center justify-between px-[14px] py-[12px] border-b border-[var(--sk-border-subtle)]">
                    <button
                      type="button"
                      aria-label="Previous month"
                      onClick={prevMonth}
                      className={navBtnClass}
                    >
                      <ChevronLeft />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalView('years')}
                      className={headingBtnClass}
                    >
                      {headerTitle}
                    </button>
                    {mode === 'single' && (
                      <button
                        type="button"
                        aria-label="Next month"
                        onClick={nextMonth}
                        className={navBtnClass}
                      >
                        <ChevronRight />
                      </button>
                    )}
                    {mode === 'range' && <div className="w-[28px]" />}
                  </div>
                  <MonthCalendar
                    year={viewYear}
                    month={viewMonth}
                    mode={mode}
                    selectedDate={singleValue}
                    rangeStart={rangeValue[0]}
                    rangeEnd={rangeValue[1]}
                    hoverDate={hoverDate}
                    minDate={minDate}
                    maxDate={maxDate}
                    fill={fill}
                    border={border}
                    onDayClick={handleDayClick}
                    onDayHover={setHoverDate}
                  />
                </div>

                {/* Right month (range mode only) */}
                {mode === 'range' && (
                  <div className="w-[280px]">
                    <div className="flex items-center justify-between px-[14px] py-[12px] border-b border-[var(--sk-border-subtle)]">
                      <div className="w-[28px]" />
                      <button
                        type="button"
                        onClick={() => setCalView('years')}
                        className={headingBtnClass}
                      >
                        {rightTitle}
                      </button>
                      <button
                        type="button"
                        aria-label="Next month"
                        onClick={nextMonth}
                        className={navBtnClass}
                      >
                        <ChevronRight />
                      </button>
                    </div>
                    <MonthCalendar
                      year={rightYear}
                      month={rightMonth}
                      mode={mode}
                      rangeStart={rangeValue[0]}
                      rangeEnd={rangeValue[1]}
                      hoverDate={hoverDate}
                      minDate={minDate}
                      maxDate={maxDate}
                      fill={fill}
                      border={border}
                      onDayClick={handleDayClick}
                      onDayHover={setHoverDate}
                    />
                  </div>
                )}
              </div>
            )}

            {mode === 'range' && calView === 'days' && (
              <div className="px-[14px] py-[10px] border-t border-[var(--sk-border-subtle)] text-[11px] text-[var(--sk-text-muted)] text-center">
                {rangePicking === 'start' || (rangeValue[0] && rangeValue[1])
                  ? 'Click to set start date'
                  : 'Click to set end date'}
              </div>
            )}
          </div>
        )}
      </div>

      {description != null && (
        <div id={descId} className="mt-[6px] text-[12px] leading-snug text-[var(--sk-text-desc)]">
          {description}
        </div>
      )}
    </div>
  )
})
