import { useCallback, useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react'
import { cn } from '../../lib/utils'

export type AlertVariant = 'info' | 'success' | 'warning' | 'error'

export interface AlertProps {
  variant?: AlertVariant
  title?: ReactNode
  children?: ReactNode
  dismissable?: boolean
  onDismiss?: () => void
  /** Accessible label for the dismiss button. Defaults to `"Dismiss"`. */
  dismissLabel?: string
  icon?: ReactNode
  className?: string
}

const VARIANT_MAP: Record<
  AlertVariant,
  {
    gradientLight: string
    gradientDark: string
    iconColor: string
    title: string
    titleDark: string
  }
> = {
  info: {
    gradientLight:
      'linear-gradient(135deg, rgba(184,223,254,0.55) 0%, rgba(184,223,254,0.20) 100%)',
    gradientDark: 'linear-gradient(135deg, rgba(184,223,254,0.14) 0%, rgba(184,223,254,0.05) 100%)',
    iconColor: 'text-pastel-sky-dark dark:text-pastel-sky',
    title: 'text-pastel-sky-dark',
    titleDark: 'dark:text-pastel-sky',
  },
  success: {
    gradientLight:
      'linear-gradient(135deg, rgba(184,240,216,0.55) 0%, rgba(184,240,216,0.20) 100%)',
    gradientDark: 'linear-gradient(135deg, rgba(184,240,216,0.14) 0%, rgba(184,240,216,0.05) 100%)',
    iconColor: 'text-pastel-mint-dark dark:text-pastel-mint',
    title: 'text-pastel-mint-dark',
    titleDark: 'dark:text-pastel-mint',
  },
  warning: {
    gradientLight:
      'linear-gradient(135deg, rgba(255,241,168,0.60) 0%, rgba(255,241,168,0.22) 100%)',
    gradientDark: 'linear-gradient(135deg, rgba(255,241,168,0.14) 0%, rgba(255,241,168,0.05) 100%)',
    iconColor: 'text-pastel-lemon-dark dark:text-pastel-lemon',
    title: 'text-pastel-lemon-dark',
    titleDark: 'dark:text-pastel-lemon',
  },
  error: {
    gradientLight:
      'linear-gradient(135deg, rgba(249,197,209,0.55) 0%, rgba(249,197,209,0.20) 100%)',
    gradientDark: 'linear-gradient(135deg, rgba(249,197,209,0.14) 0%, rgba(249,197,209,0.05) 100%)',
    iconColor: 'text-pastel-rose-dark dark:text-pastel-rose',
    title: 'text-pastel-rose-dark',
    titleDark: 'dark:text-pastel-rose',
  },
}

const InfoIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

const SuccessIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

const WarningIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const ErrorIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
)

const CloseIcon = () => (
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
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const DEFAULT_ICONS: Record<AlertVariant, ReactNode> = {
  info: <InfoIcon />,
  success: <SuccessIcon />,
  warning: <WarningIcon />,
  error: <ErrorIcon />,
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function Alert({
  variant = 'info',
  title,
  children,
  dismissable = false,
  onDismiss,
  dismissLabel = 'Dismiss',
  icon,
  className,
}: AlertProps) {
  const [state, setState] = useState<'in' | 'dismissing' | 'out'>('in')
  const finalized = useRef(false)
  const map = VARIANT_MAP[variant]

  const finalize = useCallback(() => {
    if (finalized.current) return
    finalized.current = true
    setState('out')
    onDismiss?.()
  }, [onDismiss])

  // Fallback for environments where `animationend` never fires (reduced motion,
  // jsdom, interrupted animations) so dismissal is never left hanging.
  useEffect(() => {
    if (state !== 'dismissing') return
    const timer = setTimeout(finalize, 260)
    return () => clearTimeout(timer)
  }, [state, finalize])

  if (state === 'out') return null

  const handleDismiss = () => {
    if (state !== 'in') return
    if (prefersReducedMotion()) {
      finalize()
      return
    }
    setState('dismissing')
  }

  const handleAnimationEnd = () => {
    if (state === 'dismissing') finalize()
  }

  const motionSafe = !prefersReducedMotion()

  const alertStyle: CSSProperties = {
    // gradient set via JS so we can react to dark-class at render time;
    // we rely on a CSS custom prop fallback approach via data attribute instead.
    animation: !motionSafe
      ? 'none'
      : state === 'dismissing'
        ? `alert-out 220ms cubic-bezier(0.4, 0, 1, 1) both`
        : `alert-in 240ms cubic-bezier(0.34, 1.42, 0.64, 1) both`,
    overflow: 'hidden',
  }

  return (
    <div
      role="alert"
      data-variant={variant}
      style={alertStyle}
      onAnimationEnd={handleAnimationEnd}
      className={cn(
        'alert-gradient',
        'flex gap-[10px] items-start',
        'rounded-[14px] px-[14px] py-[12px]',
        'font-sans',
        `alert-gradient-${variant}`,
        className,
      )}
    >
      <span className={cn('shrink-0 mt-[1px]', map.iconColor, map.titleDark)}>
        {icon ?? DEFAULT_ICONS[variant]}
      </span>

      <div className="flex-1 min-w-0">
        {title != null && (
          <div
            className={cn(
              'text-[13px] font-semibold leading-none mb-[4px]',
              map.title,
              map.titleDark,
            )}
          >
            {title}
          </div>
        )}
        {children != null && (
          <div className="text-[12px] leading-snug text-[var(--sk-text-muted)]">{children}</div>
        )}
      </div>

      {dismissable && (
        <button
          type="button"
          aria-label={dismissLabel}
          onClick={handleDismiss}
          className="shrink-0 mt-[1px] text-[var(--sk-text-muted)] hover:text-[var(--sk-text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--sk-border-strong)] rounded-[4px] cursor-pointer transition-colors duration-100"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  )
}
