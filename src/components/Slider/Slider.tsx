import React, {
  forwardRef,
  useCallback,
  useContext,
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

const SPRING = 'cubic-bezier(0.34, 1.42, 0.64, 1)'
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)'

export type SliderTone =
  | 'rose'
  | 'peach'
  | 'lemon'
  | 'mint'
  | 'sky'
  | 'lavender'
  | 'lilac'
  | 'neutral'

export type SliderSize = 'default' | 'sm'

export interface SliderMark {
  value: number
  label?: string
}

export interface SliderProps {
  min?: number
  max?: number
  step?: number
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  tone?: SliderTone
  accentColor?: string
  size?: SliderSize
  label?: ReactNode
  description?: ReactNode
  showValue?: boolean
  showMinMax?: boolean
  marks?: SliderMark[]
  disabled?: boolean
  id?: string
  className?: string
}

const TRACK_H: Record<SliderSize, number> = { default: 6, sm: 4 }
const THUMB_D: Record<SliderSize, number> = { default: 20, sm: 15 }

export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  {
    min = 0,
    max = 100,
    step = 1,
    value: valueProp,
    defaultValue = 0,
    onValueChange,
    tone = 'lavender',
    accentColor: accentColorProp,
    size = 'default',
    label,
    description,
    showValue = false,
    showMinMax = false,
    marks,
    disabled = false,
    id,
    className,
  },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autoId = useId()
  const inputId = id ?? `slider-${autoId}`
  const descId = description ? `${inputId}-desc` : undefined

  const { accentColor: ctxAccent } = useContext(ThemeContext)
  const resolvedAccentHex = accentColorProp ?? ctxAccent

  const isControlled = valueProp !== undefined
  const [valueUncontrolled, setValueUncontrolled] = useState(defaultValue)
  const value = isControlled ? valueProp! : valueUncontrolled

  const [pressing, setPressing] = useState(false)
  const lastScrub = useRef(0)

  const setRef = useCallback(
    (node: HTMLInputElement | null) => {
      ;(inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node
      if (typeof ref === 'function') ref(node)
      else if (ref != null) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node
    },
    [ref],
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = parseFloat(e.target.value)
    const now = performance.now()
    if (now - lastScrub.current > 45) {
      lastScrub.current = now
      playCue('scrub')
    }
    if (!isControlled) setValueUncontrolled(next)
    onValueChange?.(next)
  }

  const trackH = TRACK_H[size]
  const thumbD = THUMB_D[size]
  const pct = ((value - min) / (max - min || 1)) * 100

  const { fill: fillColor, border: borderColor } = resolveAccent(
    tone,
    TONE_FILL,
    TONE_BORDER,
    resolvedAccentHex,
  )

  const thumbSize = pressing ? Math.round(thumbD * 1.18) : thumbD

  const trackStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    height: trackH,
    borderRadius: 999,
    background: 'var(--sk-track-empty)',
    boxShadow: 'inset 0 1px 2px var(--sk-shadow-c)',
  }

  const fillStyle: CSSProperties = {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: `${pct}%`,
    borderRadius: 999,
    background: fillColor,
    boxShadow: `0 0 0 1px ${borderColor}33`,
    transition: 'width 60ms ease-out',
  }

  const thumbStyle: CSSProperties = {
    position: 'absolute',
    top: thumbD / 2 + trackH / 2,
    left: `${pct}%`,
    width: thumbSize,
    height: thumbSize,
    borderRadius: 999,
    background: 'var(--sk-knob)',
    boxShadow: '0 2px 8px var(--sk-shadow-b), 0 1px 0 var(--sk-shadow-c)',
    transform: `translate(-50%, -50%)`,
    transition: pressing
      ? `width 60ms ${EASE_IN}, height 60ms ${EASE_IN}, box-shadow 60ms ease`
      : `width 200ms ${SPRING}, height 200ms ${SPRING}, box-shadow 150ms ease`,
    pointerEvents: 'none',
    border: '1.5px solid var(--sk-border)',
    zIndex: 2,
  }

  return (
    <div
      className={cn(
        'w-full select-none font-sans',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      {(label != null || showValue) && (
        <div className="flex items-center justify-between gap-3 mb-[8px]">
          {label != null && (
            <label
              htmlFor={inputId}
              className={cn(
                'min-w-0 truncate text-[12px] leading-none font-medium text-[var(--sk-text-label)]',
                disabled && 'opacity-60',
              )}
            >
              {label}
            </label>
          )}
          {showValue && (
            <span className="shrink-0 text-[12px] leading-none text-[var(--sk-text-muted)] tabular-nums">
              {value}
            </span>
          )}
        </div>
      )}

      <div className="relative" style={{ paddingBlock: thumbD / 2 }}>
        <div style={trackStyle}>
          <div style={fillStyle} />
        </div>

        {/* Thumb rendered outside track so it stacks above marks */}
        <div style={thumbStyle} />

        <input
          ref={setRef}
          id={inputId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-describedby={descId}
          onChange={handleChange}
          onMouseDown={() => !disabled && setPressing(true)}
          onMouseUp={() => setPressing(false)}
          onMouseLeave={() => setPressing(false)}
          onTouchStart={() => !disabled && setPressing(true)}
          onTouchEnd={() => setPressing(false)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          style={{ margin: 0, zIndex: 3 }}
        />

        {marks && marks.length > 0 && (
          <div className="relative mt-[4px]" style={{ height: 16 }}>
            {marks.map((m) => {
              const mPct = ((m.value - min) / (max - min || 1)) * 100
              const atStart = mPct <= 6
              const atEnd = mPct >= 94
              return (
                <div
                  key={m.value}
                  className={cn(
                    'absolute flex flex-col gap-[2px]',
                    atStart ? 'items-start' : atEnd ? 'items-end' : 'items-center',
                  )}
                  style={{
                    left: `${mPct}%`,
                    transform: atStart
                      ? 'translateX(0)'
                      : atEnd
                        ? 'translateX(-100%)'
                        : 'translateX(-50%)',
                  }}
                >
                  <div className="w-[1px] h-[4px] bg-[var(--sk-border-strong)] rounded-full" />
                  {m.label && (
                    <span className="text-[10px] leading-none whitespace-nowrap text-[var(--sk-text-muted)]">
                      {m.label}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {showMinMax && !marks && (
          <div className="flex justify-between mt-[4px]">
            <span className="text-[10px] leading-none text-[var(--sk-text-desc)] tabular-nums">
              {min}
            </span>
            <span className="text-[10px] leading-none text-[var(--sk-text-desc)] tabular-nums">
              {max}
            </span>
          </div>
        )}
      </div>

      {description != null && (
        <div id={descId} className="mt-[4px] text-[12px] leading-snug text-[var(--sk-text-desc)]">
          {description}
        </div>
      )}
    </div>
  )
})
