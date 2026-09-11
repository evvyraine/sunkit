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

export type RadioGroupSize = 'default' | 'sm'
export type RadioGroupOrientation = 'horizontal' | 'vertical'

interface RadioItemMeta {
  value: string
  disabled: boolean
}

interface RadioGroupContextValue {
  value?: string
  select: (value: string) => void
  size: RadioGroupSize
  groupDisabled: boolean
  orientation: RadioGroupOrientation
  baseId: string
  fill: string
  border: string
  /** Value that should sit in the tab order (the checked item, or first enabled). */
  tabbableValue?: string
  /** Registers an item so the group can resolve the default tabbable item. */
  register: (value: string, disabled: boolean) => () => void
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)

function useRadioGroupContext(component: string): RadioGroupContextValue {
  const ctx = useContext(RadioGroupContext)
  if (!ctx) throw new Error(`${component} must be used within <RadioGroup>`)
  return ctx
}

export interface RadioGroupProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  name?: string
  tone?: Tone
  accentColor?: string
  size?: RadioGroupSize
  disabled?: boolean
  orientation?: RadioGroupOrientation
  label?: ReactNode
  description?: ReactNode
  error?: ReactNode
  required?: boolean
  children?: ReactNode
}

const CIRCLE: Record<RadioGroupSize, { size: number; dot: number }> = {
  default: { size: 18, dot: 8 },
  sm: { size: 14, dot: 6 },
}

export function RadioGroup({
  value: valueProp,
  defaultValue,
  onValueChange,
  name,
  tone = 'lavender',
  accentColor: accentColorProp,
  size = 'default',
  disabled = false,
  orientation = 'vertical',
  label,
  description,
  error,
  required = false,
  className,
  children,
  onKeyDown,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: RadioGroupProps) {
  const autoId = useId()
  const baseId = name ? `radio-${name}` : `radio-${autoId}`
  const labelId = label != null ? `${baseId}-label` : undefined
  const descriptionId = description != null ? `${baseId}-description` : undefined
  const errorId = error != null ? `${baseId}-error` : undefined
  const describedBy =
    [ariaDescribedBy, descriptionId, errorId].filter(Boolean).join(' ') || undefined
  const isInvalid = Boolean(error)

  const { accentColor: ctxAccent } = useContext(ThemeContext)
  const resolvedAccent = accentColorProp ?? ctxAccent
  const { fill, border } = resolveAccent(tone, TONE_FILL, TONE_BORDER, resolvedAccent)

  const isControlled = valueProp !== undefined
  const [uncontrolled, setUncontrolled] = useState<string | undefined>(defaultValue)
  const value = isControlled ? valueProp : uncontrolled

  const valueRef = useRef(value)
  valueRef.current = value

  // Ordered list of mounted items, used to resolve the default tab stop.
  const itemsRef = useRef<RadioItemMeta[]>([])
  const [, setItemsVersion] = useState(0)

  const register = useCallback((itemValue: string, itemDisabled: boolean) => {
    itemsRef.current = [
      ...itemsRef.current.filter((item) => item.value !== itemValue),
      { value: itemValue, disabled: itemDisabled },
    ]
    setItemsVersion((n) => n + 1)
    return () => {
      itemsRef.current = itemsRef.current.filter((item) => item.value !== itemValue)
      setItemsVersion((n) => n + 1)
    }
  }, [])

  const select = useCallback(
    (next: string) => {
      if (next === valueRef.current) return
      if (!isControlled) setUncontrolled(next)
      playCue('toggle')
      onValueChange?.(next)
    },
    [isControlled, onValueChange],
  )

  const checkedExists = value !== undefined && itemsRef.current.some((item) => item.value === value)
  const firstEnabled = itemsRef.current.find((item) => !item.disabled)?.value
  const tabbableValue = checkedExists ? value : firstEnabled

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e)
    if (e.defaultPrevented) return
    const keys = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp']
    if (!keys.includes(e.key)) return

    const items = Array.from(
      e.currentTarget.querySelectorAll<HTMLElement>(
        '[role="radio"]:not([disabled]):not([aria-disabled="true"])',
      ),
    )
    if (items.length === 0) return
    e.preventDefault()

    const current = items.indexOf(document.activeElement as HTMLElement)
    const forward = e.key === 'ArrowRight' || e.key === 'ArrowDown'
    const next = forward
      ? current < 0
        ? 0
        : current + 1
      : current < 0
        ? items.length - 1
        : current - 1

    const target = items[(next + items.length) % items.length]
    target.focus()
    target.click()
  }

  const ctx = useMemo<RadioGroupContextValue>(
    () => ({
      value,
      select,
      size,
      groupDisabled: disabled,
      orientation,
      baseId,
      fill,
      border,
      tabbableValue,
      register,
    }),
    [value, select, size, disabled, orientation, baseId, fill, border, tabbableValue, register],
  )

  return (
    <RadioGroupContext.Provider value={ctx}>
      <div className={cn('w-full font-[system-ui,_apple-system,_sans-serif]', className)}>
        {label != null && (
          <div
            id={labelId}
            className={cn(
              'block mb-[8px] text-[12px] leading-none font-medium text-[var(--sk-text-label)]',
              disabled && 'opacity-60',
            )}
          >
            {label}
            {required && <span className="ml-[3px] text-[var(--sk-text-muted)]">*</span>}
          </div>
        )}

        <div
          role="radiogroup"
          aria-labelledby={labelId}
          aria-describedby={describedBy}
          aria-required={required || undefined}
          aria-invalid={isInvalid || undefined}
          aria-orientation={orientation}
          onKeyDown={handleKeyDown}
          className={cn(
            'flex gap-[10px]',
            orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
            disabled && 'opacity-60',
          )}
          {...rest}
        >
          {children}
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
          <div
            id={errorId}
            className="mt-[6px] text-[12px] leading-snug text-[var(--sk-text-error)]"
          >
            {error}
          </div>
        )}
      </div>
    </RadioGroupContext.Provider>
  )
}

export interface RadioGroupItemProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'value' | 'onChange'
> {
  value: string
  label?: ReactNode
  description?: ReactNode
  disabled?: boolean
  className?: string
}

function RadioGroupItem({
  value,
  label,
  description,
  disabled: disabledProp = false,
  className,
  onClick,
  ...rest
}: RadioGroupItemProps) {
  const {
    value: selectedValue,
    select,
    size,
    groupDisabled,
    baseId,
    fill,
    border,
    tabbableValue,
    register,
  } = useRadioGroupContext('RadioGroup.Item')

  const disabled = groupDisabled || disabledProp
  const selected = selectedValue === value

  useEffect(() => register(value, disabled), [register, value, disabled])

  const circle = CIRCLE[size]
  const descriptionId = description != null ? `${baseId}-item-${value}-description` : undefined
  const markColor = isColorLight(fill) ? border : 'rgba(255,255,255,0.9)'

  const circleStyle: CSSProperties = selected
    ? {
        background: fill,
        borderColor: `${border}55`,
        boxShadow: `0 0 0 1px ${border}22, 0 1px 3px var(--sk-shadow-b)`,
      }
    : {}

  return (
    <button
      {...rest}
      type="button"
      role="radio"
      id={`${baseId}-item-${value}`}
      data-value={value}
      aria-checked={selected}
      aria-disabled={disabled || undefined}
      aria-describedby={descriptionId}
      disabled={disabled}
      tabIndex={value === tabbableValue && !disabled ? 0 : -1}
      onClick={(e) => {
        onClick?.(e)
        if (!disabled) select(value)
      }}
      className={cn(
        'inline-flex items-start gap-[9px] text-left select-none',
        'rounded-[8px] outline-none',
        'focus-visible:ring-2 focus-visible:ring-[var(--sk-border-strong)]',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'relative shrink-0 flex items-center justify-center rounded-full',
          'border border-[var(--sk-border-strong)] bg-[var(--sk-surface)]',
          'transition-[background-color,border-color,box-shadow] duration-150',
          'btn-shadow',
        )}
        style={{ width: circle.size, height: circle.size, marginTop: 1, ...circleStyle }}
      >
        {selected && (
          <span
            className="rounded-full"
            style={{ width: circle.dot, height: circle.dot, background: markColor }}
          />
        )}
      </span>

      {(label != null || description != null) && (
        <span className="flex flex-col gap-[2px] min-w-0">
          {label != null && (
            <span
              className={cn(
                'leading-snug text-[var(--sk-text)]',
                size === 'default' ? 'text-[13px]' : 'text-[12px]',
              )}
            >
              {label}
            </span>
          )}
          {description != null && (
            <span
              id={descriptionId}
              className="text-[11px] leading-snug text-[var(--sk-text-desc)]"
            >
              {description}
            </span>
          )}
        </span>
      )}
    </button>
  )
}

RadioGroup.Item = RadioGroupItem
