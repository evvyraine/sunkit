import React, { forwardRef, useCallback, useContext, useId, useRef, useState } from 'react'
import type { InputHTMLAttributes, CSSProperties, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { playCue } from '../../sound'
import { hexToAccentPair } from '../../lib/accent'
import { ThemeContext } from '../Theme/ThemeProvider'

const inputVariants = cva(
  [
    'w-full min-w-0',
    'font-sans text-base leading-none sm:text-[13px]',
    'text-[var(--sk-text)] placeholder:text-[var(--sk-text-placeholder)]',
    'outline-none',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'transition-[box-shadow,border-color,background-color,opacity] duration-[150ms] ease-out',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'bg-[var(--sk-surface)] border',
          'rounded-[var(--field-radius)]',
          'btn-shadow hover:btn-shadow-hover',
          'focus-visible:btn-shadow-hover',
          'hover:brightness-[1.03]',
        ].join(' '),
        filled: [
          'bg-[var(--sk-surface-filled)] border border-[var(--sk-border)]',
          'rounded-[var(--field-radius)]',
          'shadow-[inset_0_1px_3px_var(--sk-shadow-b)]',
          'hover:bg-[var(--sk-surface-hover)]',
          'focus-visible:bg-[var(--sk-surface)] focus-visible:shadow-[inset_0_1px_2px_var(--sk-shadow-c)]',
        ].join(' '),
        ghost: [
          'bg-transparent border-0 border-b-[1.5px] border-[var(--sk-border-strong)]',
          'rounded-none shadow-none',
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
    compoundVariants: [
      {
        variant: 'ghost',
        tone: 'rose',
        className:
          'border-pastel-rose-dark/[0.40]     focus-visible:border-pastel-rose-dark/[0.70]',
      },
      {
        variant: 'ghost',
        tone: 'peach',
        className:
          'border-pastel-peach-dark/[0.40]    focus-visible:border-pastel-peach-dark/[0.70]',
      },
      {
        variant: 'ghost',
        tone: 'lemon',
        className:
          'border-pastel-lemon-dark/[0.40]    focus-visible:border-pastel-lemon-dark/[0.70]',
      },
      {
        variant: 'ghost',
        tone: 'mint',
        className:
          'border-pastel-mint-dark/[0.40]     focus-visible:border-pastel-mint-dark/[0.70]',
      },
      {
        variant: 'ghost',
        tone: 'sky',
        className: 'border-pastel-sky-dark/[0.40]      focus-visible:border-pastel-sky-dark/[0.70]',
      },
      {
        variant: 'ghost',
        tone: 'lavender',
        className:
          'border-pastel-lavender-dark/[0.40] focus-visible:border-pastel-lavender-dark/[0.70]',
      },
      {
        variant: 'ghost',
        tone: 'lilac',
        className:
          'border-pastel-lilac-dark/[0.40]    focus-visible:border-pastel-lilac-dark/[0.70]',
      },
      {
        variant: 'ghost',
        tone: 'neutral',
        className:
          'border-pastel-neutral-dark/[0.35]  focus-visible:border-pastel-neutral-dark/[0.65]',
      },
    ],
    defaultVariants: {
      variant: 'default',
      tone: 'neutral',
      size: 'default',
      invalid: false,
    },
  },
)

export type InputVariantProps = VariantProps<typeof inputVariants>

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, Omit<InputVariantProps, 'tone'> {
  tone?: NonNullable<InputVariantProps['tone']> | (string & {})
  accentColor?: string
  label?: ReactNode
  description?: ReactNode
  error?: ReactNode
  radius?: number
  leftAdornment?: ReactNode
  rightAdornment?: ReactNode
  containerClassName?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    id,
    label,
    description,
    error,
    radius = 12,
    leftAdornment,
    rightAdornment,
    className,
    containerClassName,
    variant,
    tone,
    size,
    invalid,
    required,
    disabled,
    accentColor: accentColorProp,
    'aria-describedby': ariaDescribedBy,
    ...rest
  },
  ref,
) {
  const innerRef = useRef<HTMLInputElement>(null)
  const autoId = useId()
  const inputId = id ?? `input-${autoId}`
  const descriptionId = description ? `${inputId}-description` : undefined
  const errorId = error ? `${inputId}-error` : undefined
  const describedBy =
    [ariaDescribedBy, descriptionId, errorId].filter(Boolean).join(' ') || undefined
  const isInvalid = invalid ?? Boolean(error)

  const { accentColor: ctxAccent } = useContext(ThemeContext)
  const resolvedAccent = accentColorProp ?? ctxAccent
  const [focused, setFocused] = useState(false)

  const setRef = useCallback(
    (node: HTMLInputElement | null) => {
      ;(innerRef as React.MutableRefObject<HTMLInputElement | null>).current = node
      if (typeof ref === 'function') ref(node)
      else if (ref != null) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node
    },
    [ref],
  )

  const effectiveTone = resolvedAccent
    ? 'custom'
    : ((tone as InputVariantProps['tone'] | undefined) ?? 'neutral')

  let accentStyle: CSSProperties | undefined
  if (resolvedAccent && focused && !isInvalid) {
    const { border } = hexToAccentPair(resolvedAccent)
    accentStyle = { borderColor: `${border}99` }
  } else if (resolvedAccent && !isInvalid) {
    const { border } = hexToAccentPair(resolvedAccent)
    accentStyle = { borderColor: `${border}44` }
  }

  return (
    <div className={cn('w-full', containerClassName)}>
      {label != null && (
        <label
          htmlFor={inputId}
          className={cn(
            'block mb-[6px] text-[12px] leading-none font-medium text-[var(--sk-text-label)]',
            disabled && 'opacity-60',
          )}
        >
          <span className="inline-flex items-center gap-2">
            {label}
            {required ? <span className="text-[var(--sk-text-muted)]">*</span> : null}
          </span>
        </label>
      )}

      <div className="relative w-full" style={{ '--field-radius': `${radius}px` } as CSSProperties}>
        {leftAdornment != null && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 pl-[11px] flex items-center text-[var(--sk-text-muted)] pointer-events-none z-[1]">
            {leftAdornment}
          </div>
        )}

        <input
          ref={setRef}
          id={inputId}
          className={cn(
            inputVariants({ variant, tone: effectiveTone, size, invalid: isInvalid }),
            leftAdornment != null ? (size === 'sm' ? 'pl-[30px]' : 'pl-[34px]') : '',
            rightAdornment != null ? (size === 'sm' ? 'pr-[30px]' : 'pr-[36px]') : '',
            className,
          )}
          style={accentStyle}
          aria-invalid={isInvalid || undefined}
          aria-describedby={describedBy}
          required={required}
          disabled={disabled}
          onFocus={(e) => {
            setFocused(true)
            playCue('focus')
            rest.onFocus?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            rest.onBlur?.(e)
          }}
          {...rest}
        />

        {rightAdornment != null && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 pr-[11px] flex items-center text-[var(--sk-text-muted)] pointer-events-none z-[1]">
            {rightAdornment}
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
