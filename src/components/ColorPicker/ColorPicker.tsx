import React, { useId } from 'react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { COLORS, type ButtonColor } from '../../tokens/colors'
import { playColorCue } from '../../sound'

export type ColorPickerSize = 'default' | 'sm'

export interface ColorPickerProps {
  value?: ButtonColor
  defaultValue?: ButtonColor
  onChange?: (value: ButtonColor) => void
  size?: ColorPickerSize
  disabled?: boolean
  label?: ReactNode
  description?: ReactNode
  className?: string
  id?: string
}

const SWATCH_D: Record<ColorPickerSize, number> = { default: 32, sm: 24 }
const CHECK_D: Record<ColorPickerSize, number> = { default: 14, sm: 11 }

const CheckIcon = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
)

export function ColorPicker({
  value: valueProp,
  defaultValue,
  onChange,
  size = 'default',
  disabled = false,
  label,
  description,
  className,
  id,
}: ColorPickerProps) {
  const autoId = useId()
  const groupId = id ?? `colorpicker-${autoId}`
  const descId = description ? `${groupId}-desc` : undefined

  const [valueUncontrolled, setValueUncontrolled] = React.useState<ButtonColor | undefined>(
    defaultValue,
  )
  const isControlled = valueProp !== undefined
  const value = isControlled ? valueProp : valueUncontrolled

  const swatchD = SWATCH_D[size]
  const checkD = CHECK_D[size]

  const handleSelect = (colorId: ButtonColor) => {
    if (disabled) return
    if (!isControlled) setValueUncontrolled(colorId)
    onChange?.(colorId)
    playColorCue(colorId)
  }

  return (
    <div
      className={cn(
        'inline-flex flex-col gap-[8px] font-[system-ui,_-apple-system,_sans-serif]',
        className,
      )}
    >
      {label != null && (
        <div
          className={cn(
            'text-[12px] leading-none font-medium text-[var(--sk-text-label)]',
            disabled && 'opacity-60',
          )}
        >
          {label}
        </div>
      )}

      <div
        role="radiogroup"
        id={groupId}
        aria-describedby={descId}
        aria-label={typeof label === 'string' ? label : undefined}
        className="flex flex-wrap gap-[8px]"
      >
        {COLORS.map((color) => {
          const isSelected = color.id === value

          return (
            <button
              key={color.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={color.label}
              disabled={disabled}
              onClick={() => handleSelect(color.id)}
              className={cn(
                'rounded-full outline-none cursor-pointer',
                'transition-[transform,box-shadow] duration-150 ease-out',
                'hover:scale-[1.12]',
                'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--sk-border-strong)]',
                disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
                isSelected
                  ? 'scale-[1.08] shadow-[0_0_0_2.5px_var(--sk-border-strong),inset_0_2px_6px_rgba(0,0,0,0.15)]'
                  : 'btn-shadow',
              )}
              style={{
                width: swatchD,
                height: swatchD,
                background: color.hex,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1.5px solid ${color.darkHex}33`,
              }}
            >
              {isSelected && (
                <span style={{ color: color.darkHex, display: 'flex' }}>
                  <CheckIcon size={checkD} />
                </span>
              )}
            </button>
          )
        })}
      </div>

      {description != null && (
        <div id={descId} className="text-[12px] leading-snug text-[var(--sk-text-desc)]">
          {description}
        </div>
      )}
    </div>
  )
}
