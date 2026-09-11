import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { cn } from '../../lib/utils'
import { isColorLight, resolveAccent } from '../../lib/accent'
import { TONE_BORDER, TONE_FILL } from '../../tokens/tones'
import type { Tone } from '../../tokens/tones'
import { ThemeContext } from '../Theme/ThemeProvider'
import { playCue } from '../../sound'

export type TabsOrientation = 'horizontal' | 'vertical'

interface TabsContextValue {
  value?: string
  select: (value: string) => void
  orientation: TabsOrientation
  /** Stable id prefix shared by every trigger/panel pair. */
  baseId: string
  fill: string
  border: string
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext(component: string): TabsContextValue {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error(`${component} must be used within <Tabs>`)
  return ctx
}

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  tone?: Tone
  accentColor?: string
  orientation?: TabsOrientation
  children?: ReactNode
}

export function Tabs({
  value: valueProp,
  defaultValue,
  onValueChange,
  tone = 'lavender',
  accentColor: accentColorProp,
  orientation = 'horizontal',
  className,
  children,
  ...rest
}: TabsProps) {
  const autoId = useId()
  const baseId = `tabs-${autoId}`
  const { accentColor: ctxAccent } = useContext(ThemeContext)
  const resolvedAccent = accentColorProp ?? ctxAccent
  const { fill, border } = resolveAccent(tone, TONE_FILL, TONE_BORDER, resolvedAccent)

  const isControlled = valueProp !== undefined
  const [uncontrolled, setUncontrolled] = useState<string | undefined>(defaultValue)
  const value = isControlled ? valueProp : uncontrolled

  // `select` must stay referentially stable while still seeing the latest value.
  const valueRef = useRef(value)
  valueRef.current = value

  const rootRef = useRef<HTMLDivElement>(null)

  // Uncontrolled with no initial value → select the first enabled tab.
  useEffect(() => {
    if (isControlled || valueRef.current !== undefined) return
    const first = rootRef.current?.querySelector<HTMLElement>(
      '[role="tab"]:not([disabled]):not([aria-disabled="true"])',
    )
    if (first?.dataset.value != null) setUncontrolled(first.dataset.value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const select = useCallback(
    (next: string) => {
      if (next === valueRef.current) return
      if (!isControlled) setUncontrolled(next)
      playCue('navigate')
      onValueChange?.(next)
    },
    [isControlled, onValueChange],
  )

  const ctx = useMemo<TabsContextValue>(
    () => ({ value, select, orientation, baseId, fill, border }),
    [value, select, orientation, baseId, fill, border],
  )

  return (
    <TabsContext.Provider value={ctx}>
      <div
        ref={rootRef}
        className={cn('font-[system-ui,_-apple-system,_sans-serif]', className)}
        {...rest}
      >
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

function TabsList({ className, children, onKeyDown, ...rest }: TabsListProps) {
  const { orientation } = useTabsContext('Tabs.List')

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e)
    if (e.defaultPrevented) return

    const isVertical = orientation === 'vertical'
    const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft'
    const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight'
    if (e.key !== prevKey && e.key !== nextKey && e.key !== 'Home' && e.key !== 'End') return

    const tabs = Array.from(
      e.currentTarget.querySelectorAll<HTMLElement>(
        '[role="tab"]:not([disabled]):not([aria-disabled="true"])',
      ),
    )
    if (tabs.length === 0) return
    e.preventDefault()

    const current = tabs.indexOf(document.activeElement as HTMLElement)
    let next: number
    if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = tabs.length - 1
    else if (e.key === nextKey) next = current < 0 ? 0 : current + 1
    else next = current < 0 ? tabs.length - 1 : current - 1

    const target = tabs[(next + tabs.length) % tabs.length]
    target.focus()
    target.click()
  }

  return (
    <div
      role="tablist"
      aria-orientation={orientation}
      onKeyDown={handleKeyDown}
      className={cn(
        'inline-flex gap-[4px] p-[4px]',
        'rounded-[14px] border border-[var(--sk-border)]',
        'bg-[var(--sk-surface-filled)]',
        'shadow-[inset_0_1px_3px_var(--sk-shadow-b),inset_0_-1px_0_var(--sk-inset-light)]',
        orientation === 'vertical' ? 'flex-col items-stretch' : 'items-center',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

export interface TabsTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  value: string
  disabled?: boolean
  children?: ReactNode
  className?: string
}

function TabsTrigger({
  value,
  disabled = false,
  className,
  children,
  onClick,
  ...rest
}: TabsTriggerProps) {
  const { value: selectedValue, select, baseId, fill, border } = useTabsContext('Tabs.Trigger')
  const selected = selectedValue === value

  const selectedText = isColorLight(fill) ? border : 'rgba(255, 255, 255, 0.95)'

  const activeStyle: CSSProperties | undefined = selected
    ? { backgroundColor: fill, color: selectedText }
    : undefined

  return (
    <button
      {...rest}
      type="button"
      role="tab"
      id={`${baseId}-tab-${value}`}
      data-value={value}
      aria-selected={selected}
      aria-controls={`${baseId}-panel-${value}`}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      tabIndex={selected ? 0 : -1}
      onClick={(e) => {
        onClick?.(e)
        if (!disabled) select(value)
      }}
      className={cn(
        'inline-flex items-center justify-center gap-[6px] whitespace-nowrap',
        'rounded-[11px] px-[14px] py-[7px] text-[13px] font-medium leading-none select-none',
        'outline-none cursor-pointer',
        'transition-[transform,box-shadow,background-color,color] duration-200 ease-out',
        'active:scale-[0.97]',
        'focus-visible:ring-2 focus-visible:ring-[var(--sk-border-strong)]',
        'disabled:opacity-45 disabled:cursor-not-allowed disabled:active:scale-100',
        selected && 'btn-shadow',
        !selected &&
          'text-[var(--sk-text-muted)] hover:text-[var(--sk-text)] hover:bg-[var(--sk-surface-hover)]',
        className,
      )}
      style={activeStyle}
    >
      {children}
    </button>
  )
}

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string
  children?: ReactNode
}

function TabsContent({ value, className, children, ...rest }: TabsContentProps) {
  const { value: selectedValue, baseId } = useTabsContext('Tabs.Content')
  if (selectedValue !== value) return null

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      tabIndex={0}
      className={cn(
        'outline-none text-[13px] leading-relaxed text-[var(--sk-text)]',
        'focus-visible:ring-2 focus-visible:ring-[var(--sk-border-strong)]',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

Tabs.List = TabsList
Tabs.Trigger = TabsTrigger
Tabs.Content = TabsContent
