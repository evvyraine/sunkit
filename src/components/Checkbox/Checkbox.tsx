import {
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
import { resolveAccent, isColorLight } from '../../lib/accent'
import { TONE_BORDER, TONE_FILL } from '../../tokens/tones'
import { ThemeContext } from '../Theme/ThemeProvider'
import { playCue } from '../../sound'

export type CheckboxTone =
  | 'rose'
  | 'peach'
  | 'lemon'
  | 'mint'
  | 'sky'
  | 'lavender'
  | 'lilac'
  | 'neutral'

export type CheckboxSize = 'default' | 'sm'

export interface CheckboxProps {
  checked?: boolean
  defaultChecked?: boolean
  indeterminate?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: ReactNode
  description?: ReactNode
  error?: ReactNode
  tone?: CheckboxTone
  accentColor?: string
  size?: CheckboxSize
  disabled?: boolean
  required?: boolean
  id?: string
  name?: string
  value?: string
  'aria-describedby'?: string
  containerClassName?: string
  className?: string
}

const BOX: Record<
  CheckboxSize,
  { size: number; radius: number; stroke: number; viewBox: string; path: string }
> = {
  default: { size: 18, radius: 5, stroke: 2, viewBox: '0 0 16 16', path: 'M3 8 L6.5 11.5 L13 4.5' },
  sm: { size: 14, radius: 4, stroke: 1.8, viewBox: '0 0 12 12', path: 'M2 6 L5 9 L10 3' },
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    checked: checkedProp,
    defaultChecked = false,
    indeterminate = false,
    onCheckedChange,
    label,
    description,
    error,
    tone = 'lavender',
    accentColor: accentColorProp,
    size = 'default',
    disabled = false,
    required = false,
    id,
    name,
    value,
    'aria-describedby': ariaDescribedBy,
    containerClassName,
    className,
  },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? `checkbox-${autoId}`
  const descriptionId = description ? `${inputId}-description` : undefined
  const errorId = error ? `${inputId}-error` : undefined
  const describedBy =
    [ariaDescribedBy, descriptionId, errorId].filter(Boolean).join(' ') || undefined

  const { accentColor: ctxAccent } = useContext(ThemeContext)
  const resolvedAccentHex = accentColorProp ?? ctxAccent
  const { fill, border } = resolveAccent(tone, TONE_FILL, TONE_BORDER, resolvedAccentHex)

  const isControlled = checkedProp !== undefined
  const [checkedUncontrolled, setCheckedUncontrolled] = useState(defaultChecked)
  const checked = isControlled ? checkedProp! : checkedUncontrolled

  const inputRef = useRef<HTMLInputElement>(null)

  const setRef = useCallback(
    (node: HTMLInputElement | null) => {
      ;(inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node
      if (typeof ref === 'function') ref(node)
      else if (ref != null) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node
    },
    [ref],
  )

  // Set indeterminate via DOM property (can't be set via attribute)
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    playCue('toggle')
    if (!isControlled) setCheckedUncontrolled(e.target.checked)
    onCheckedChange?.(e.target.checked)
  }

  const isInvalid = Boolean(error)
  const isActive = checked || indeterminate
  const box = BOX[size]

  const boxStyle: CSSProperties = isActive
    ? {
        background: fill,
        borderColor: `${border}55`,
        boxShadow: `0 0 0 1px ${border}22, 0 1px 3px var(--sk-shadow-b)`,
      }
    : {}

  // Mark color: white on dark fills, border color on light fills
  const markColor = isColorLight(fill) ? border : 'rgba(255,255,255,0.90)'

  const checkAnim: CSSProperties = {
    strokeDasharray: 20,
    strokeDashoffset: 0,
    animation: 'checkbox-check 200ms cubic-bezier(0.34,1.42,0.64,1) both',
  }

  return (
    <div className={cn('w-full font-sans', containerClassName)}>
      <label
        htmlFor={inputId}
        className={cn(
          'inline-flex items-start gap-[9px] cursor-pointer select-none',
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        )}
      >
        {/* Visual checkbox box */}
        <div
          className={cn(
            'relative shrink-0 flex items-center justify-center',
            'border border-[var(--sk-border-strong)]',
            'bg-[var(--sk-surface)]',
            'transition-[background-color,border-color,box-shadow] duration-150',
            isInvalid && 'border-red-500/60',
            'btn-shadow',
          )}
          style={{
            width: box.size,
            height: box.size,
            borderRadius: box.radius,
            marginTop: size === 'default' ? 1 : 1,
            ...boxStyle,
          }}
        >
          {/* Hidden native input — covers the visual for click/keyboard */}
          <input
            ref={setRef}
            id={inputId}
            type="checkbox"
            name={name}
            value={value}
            checked={checked}
            disabled={disabled}
            required={required}
            aria-invalid={isInvalid || undefined}
            aria-describedby={describedBy}
            onChange={handleChange}
            className={cn(
              'absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed',
              'focus-visible:outline-none',
              className,
            )}
            style={{ width: box.size, height: box.size, margin: 0 }}
          />

          {/* Focus ring — shown via sibling selector workaround using peer */}
          <div
            className="absolute -inset-[3px] rounded-[7px] pointer-events-none opacity-0 transition-opacity duration-100"
            style={{
              boxShadow: `0 0 0 2px ${border}66`,
            }}
            aria-hidden="true"
          />

          {/* Checkmark SVG — absolute so it never affects the box's layout */}
          {checked && !indeterminate && (
            <svg
              width={box.size - 4}
              height={box.size - 4}
              viewBox={box.viewBox}
              fill="none"
              stroke={markColor}
              strokeWidth={box.stroke}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              style={{ position: 'absolute', inset: 0, margin: 'auto', display: 'block' }}
            >
              <path d={box.path} style={checkAnim} />
            </svg>
          )}

          {/* Indeterminate dash — absolute so it never affects the box's layout */}
          {indeterminate && (
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                margin: 'auto',
                width: box.size - 6,
                height: Math.round(box.stroke),
                borderRadius: 999,
                background: markColor,
                transformOrigin: 'left center',
                animation: 'checkbox-indeterminate 160ms cubic-bezier(0.34,1.42,0.64,1) both',
              }}
            />
          )}
        </div>

        {/* Label + description */}
        {(label != null || description != null) && (
          <div className="flex flex-col gap-[2px] min-w-0">
            {label != null && (
              <span
                className={cn(
                  'leading-snug text-[var(--sk-text)]',
                  size === 'default' ? 'text-[13px]' : 'text-[12px]',
                  required &&
                    "after:content-['*'] after:ml-[2px] after:text-[var(--sk-text-muted)]",
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
          </div>
        )}
      </label>

      {error != null && (
        <div
          id={errorId}
          className="mt-[5px] text-[12px] leading-snug text-[var(--sk-text-error)]"
          style={{ paddingLeft: box.size + 9 }}
        >
          {error}
        </div>
      )}
    </div>
  )
})
