import { useRef, useCallback, useContext } from 'react'
import type { ButtonHTMLAttributes, ReactNode, CSSProperties, Ref } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { playCue } from '../../sound'
import type { ButtonColor } from '../../tokens/colors'
import { hexToAccentPair, isColorLight } from '../../lib/accent'
import { ThemeContext } from '../Theme/ThemeProvider'

export type { ButtonColor }
export type ButtonSize = 'default' | 'sm' | 'icon-only'
export type ButtonVariant = 'solid' | 'outline' | 'ghost'
export type ButtonIconPosition = 'none' | 'left' | 'right' | 'only'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-[7px]',
    'font-sans font-medium leading-none',
    'cursor-pointer border outline-none select-none relative',
    'focus-visible:ring-2 focus-visible:ring-[var(--sk-accent,#7c6cdc)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sk-bg-solid)]',
    'rounded-[var(--btn-radius)]',
    'btn-transition',
    'active:scale-[0.972]',
    '[-webkit-tap-highlight-color:transparent]',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
  ].join(' '),
  {
    variants: {
      variant: {
        solid: [
          'btn-shadow hover:btn-shadow-hover active:btn-shadow-active',
          'hover:brightness-[1.05]',
        ].join(' '),
        outline: 'bg-transparent transition-colors duration-150',
        ghost: 'bg-transparent border-transparent transition-colors duration-150',
      },
      color: {
        rose: '',
        peach: '',
        lemon: '',
        mint: '',
        sky: '',
        lavender: '',
        lilac: '',
        neutral: '',
        custom: '',
      },
      size: {
        default: 'px-[18px] py-[10px] text-sm',
        sm: 'px-[13px] py-[7px] text-xs',
        'icon-only': 'p-[10px] w-10 h-10 text-sm',
        'icon-sm': 'p-[7px] w-8 h-8 text-xs',
      },
    },
    compoundVariants: [
      // ── SOLID ──────────────────────────────────────────────────────────────
      {
        variant: 'solid',
        color: 'rose',
        className: 'bg-pastel-rose text-pastel-rose-dark border-pastel-rose-dark/[0.22]',
      },
      {
        variant: 'solid',
        color: 'peach',
        className: 'bg-pastel-peach text-pastel-peach-dark border-pastel-peach-dark/[0.22]',
      },
      {
        variant: 'solid',
        color: 'lemon',
        className: 'bg-pastel-lemon text-pastel-lemon-dark border-pastel-lemon-dark/[0.22]',
      },
      {
        variant: 'solid',
        color: 'mint',
        className: 'bg-pastel-mint text-pastel-mint-dark border-pastel-mint-dark/[0.22]',
      },
      {
        variant: 'solid',
        color: 'sky',
        className: 'bg-pastel-sky text-pastel-sky-dark border-pastel-sky-dark/[0.22]',
      },
      {
        variant: 'solid',
        color: 'lavender',
        className:
          'bg-pastel-lavender text-pastel-lavender-dark border-pastel-lavender-dark/[0.22]',
      },
      {
        variant: 'solid',
        color: 'lilac',
        className: 'bg-pastel-lilac text-pastel-lilac-dark border-pastel-lilac-dark/[0.22]',
      },
      {
        variant: 'solid',
        color: 'neutral',
        className: 'bg-pastel-neutral text-pastel-neutral-dark border-pastel-neutral-dark/[0.22]',
      },

      // ── OUTLINE ────────────────────────────────────────────────────────────
      {
        variant: 'outline',
        color: 'rose',
        className: [
          'text-pastel-rose-dark border-pastel-rose-dark/[0.38] hover:bg-pastel-rose/[0.18]',
          'dark:text-pastel-rose dark:border-pastel-rose/[0.42] dark:hover:bg-pastel-rose/[0.13]',
        ].join(' '),
      },
      {
        variant: 'outline',
        color: 'peach',
        className: [
          'text-pastel-peach-dark border-pastel-peach-dark/[0.38] hover:bg-pastel-peach/[0.18]',
          'dark:text-pastel-peach dark:border-pastel-peach/[0.42] dark:hover:bg-pastel-peach/[0.13]',
        ].join(' '),
      },
      {
        variant: 'outline',
        color: 'lemon',
        className: [
          'text-pastel-lemon-dark border-pastel-lemon-dark/[0.38] hover:bg-pastel-lemon/[0.18]',
          'dark:text-pastel-lemon dark:border-pastel-lemon/[0.42] dark:hover:bg-pastel-lemon/[0.13]',
        ].join(' '),
      },
      {
        variant: 'outline',
        color: 'mint',
        className: [
          'text-pastel-mint-dark border-pastel-mint-dark/[0.38] hover:bg-pastel-mint/[0.18]',
          'dark:text-pastel-mint dark:border-pastel-mint/[0.42] dark:hover:bg-pastel-mint/[0.13]',
        ].join(' '),
      },
      {
        variant: 'outline',
        color: 'sky',
        className: [
          'text-pastel-sky-dark border-pastel-sky-dark/[0.38] hover:bg-pastel-sky/[0.18]',
          'dark:text-pastel-sky dark:border-pastel-sky/[0.42] dark:hover:bg-pastel-sky/[0.13]',
        ].join(' '),
      },
      {
        variant: 'outline',
        color: 'lavender',
        className: [
          'text-pastel-lavender-dark border-pastel-lavender-dark/[0.38] hover:bg-pastel-lavender/[0.18]',
          'dark:text-pastel-lavender dark:border-pastel-lavender/[0.42] dark:hover:bg-pastel-lavender/[0.13]',
        ].join(' '),
      },
      {
        variant: 'outline',
        color: 'lilac',
        className: [
          'text-pastel-lilac-dark border-pastel-lilac-dark/[0.38] hover:bg-pastel-lilac/[0.18]',
          'dark:text-pastel-lilac dark:border-pastel-lilac/[0.42] dark:hover:bg-pastel-lilac/[0.13]',
        ].join(' '),
      },
      {
        variant: 'outline',
        color: 'neutral',
        className: [
          'text-pastel-neutral-dark border-pastel-neutral-dark/[0.38] hover:bg-pastel-neutral/[0.18]',
          'dark:text-pastel-neutral dark:border-pastel-neutral/[0.42] dark:hover:bg-pastel-neutral/[0.13]',
        ].join(' '),
      },

      // ── GHOST ──────────────────────────────────────────────────────────────
      {
        variant: 'ghost',
        color: 'rose',
        className: [
          'text-pastel-rose-dark hover:bg-pastel-rose/[0.18]',
          'dark:text-pastel-rose dark:hover:bg-pastel-rose/[0.13]',
        ].join(' '),
      },
      {
        variant: 'ghost',
        color: 'peach',
        className: [
          'text-pastel-peach-dark hover:bg-pastel-peach/[0.18]',
          'dark:text-pastel-peach dark:hover:bg-pastel-peach/[0.13]',
        ].join(' '),
      },
      {
        variant: 'ghost',
        color: 'lemon',
        className: [
          'text-pastel-lemon-dark hover:bg-pastel-lemon/[0.18]',
          'dark:text-pastel-lemon dark:hover:bg-pastel-lemon/[0.13]',
        ].join(' '),
      },
      {
        variant: 'ghost',
        color: 'mint',
        className: [
          'text-pastel-mint-dark hover:bg-pastel-mint/[0.18]',
          'dark:text-pastel-mint dark:hover:bg-pastel-mint/[0.13]',
        ].join(' '),
      },
      {
        variant: 'ghost',
        color: 'sky',
        className: [
          'text-pastel-sky-dark hover:bg-pastel-sky/[0.18]',
          'dark:text-pastel-sky dark:hover:bg-pastel-sky/[0.13]',
        ].join(' '),
      },
      {
        variant: 'ghost',
        color: 'lavender',
        className: [
          'text-pastel-lavender-dark hover:bg-pastel-lavender/[0.18]',
          'dark:text-pastel-lavender dark:hover:bg-pastel-lavender/[0.13]',
        ].join(' '),
      },
      {
        variant: 'ghost',
        color: 'lilac',
        className: [
          'text-pastel-lilac-dark hover:bg-pastel-lilac/[0.18]',
          'dark:text-pastel-lilac dark:hover:bg-pastel-lilac/[0.13]',
        ].join(' '),
      },
      {
        variant: 'ghost',
        color: 'neutral',
        className: [
          'text-pastel-neutral-dark hover:bg-pastel-neutral/[0.18]',
          'dark:text-pastel-neutral dark:hover:bg-pastel-neutral/[0.13]',
        ].join(' '),
      },
    ],
    defaultVariants: {
      variant: 'solid',
      color: 'lavender',
      size: 'default',
    },
  },
)

type CVASize = NonNullable<VariantProps<typeof buttonVariants>['size']>

function resolveSize(size: ButtonSize, icon: ButtonIconPosition): CVASize {
  const isIconOnly = size === 'icon-only' || icon === 'only'
  if (!isIconOnly) return size === 'sm' ? 'sm' : 'default'
  return size === 'sm' ? 'icon-sm' : 'icon-only'
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>
  variant?: ButtonVariant
  color?: ButtonColor
  accentColor?: string
  size?: ButtonSize
  icon?: ButtonIconPosition
  iconLeft?: ReactNode
  iconRight?: ReactNode
  iconOnly?: ReactNode
  radius?: number
  children?: ReactNode
}

const PlayIcon = () => (
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
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
)

const StarIcon = () => (
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
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

export function Button({
  ref: externalRef,
  variant = 'solid',
  color = 'lavender',
  accentColor: accentColorProp,
  size = 'default',
  icon = 'none',
  iconLeft,
  iconRight,
  iconOnly,
  radius = 10,
  children,
  className,
  style,
  onMouseEnter,
  onMouseLeave,
  onPointerDown,
  onPointerUp,
  onKeyDown,
  onKeyUp,
  ...rest
}: ButtonProps) {
  const innerRef = useRef<HTMLButtonElement>(null)
  const { accentColor: ctxAccent, dark } = useContext(ThemeContext)

  const setRef = useCallback(
    (node: HTMLButtonElement | null) => {
      ;(innerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
      if (typeof externalRef === 'function') {
        externalRef(node)
      } else if (externalRef != null) {
        ;(externalRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
      }
    },
    [externalRef],
  )

  const isIconOnly = size === 'icon-only' || icon === 'only'
  const resolvedAccent = accentColorProp ?? ctxAccent

  let accentStyle: CSSProperties | undefined
  if (resolvedAccent) {
    const { fill, border } = hexToAccentPair(resolvedAccent)
    if (variant === 'solid') {
      const textColor = isColorLight(fill) ? border : 'rgba(255,255,255,0.92)'
      accentStyle = {
        backgroundColor: fill,
        color: textColor,
        borderColor: `${border}38`,
      }
    } else if (variant === 'outline') {
      accentStyle = {
        color: dark ? fill : border,
        borderColor: dark ? `${fill}80` : `${border}55`,
      }
    } else {
      // ghost
      accentStyle = {
        color: dark ? fill : border,
      }
    }
  }

  const effectiveColor = resolvedAccent ? 'custom' : color

  const hoverBg = (() => {
    if (!resolvedAccent || variant === 'solid') return null
    const { fill } = hexToAccentPair(resolvedAccent)
    return variant === 'outline' ? `${fill}30` : `${fill}26`
  })()

  return (
    <button
      ref={setRef}
      className={cn(
        buttonVariants({ variant, color: effectiveColor, size: resolveSize(size, icon) }),
        className,
      )}
      style={{ '--btn-radius': `${radius}px`, ...accentStyle, ...style } as CSSProperties}
      onMouseEnter={(e) => {
        if (hoverBg) e.currentTarget.style.backgroundColor = hoverBg
        onMouseEnter?.(e)
      }}
      onMouseLeave={(e) => {
        if (hoverBg) e.currentTarget.style.backgroundColor = 'transparent'
        onMouseLeave?.(e)
      }}
      onPointerDown={(e) => {
        playCue('press')
        onPointerDown?.(e)
      }}
      onPointerUp={(e) => {
        playCue('release')
        onPointerUp?.(e)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') playCue('press')
        onKeyDown?.(e)
      }}
      onKeyUp={(e) => {
        if (e.key === 'Enter' || e.key === ' ') playCue('release')
        onKeyUp?.(e)
      }}
      {...rest}
    >
      {isIconOnly ? (
        <span className="flex items-center leading-none shrink-0">{iconOnly ?? <StarIcon />}</span>
      ) : (
        <>
          {icon === 'left' && (
            <span className="flex items-center leading-none shrink-0">
              {iconLeft ?? <PlayIcon />}
            </span>
          )}
          <span
            className={cn(
              variant === 'solid' &&
                !resolvedAccent &&
                '[text-shadow:0_1px_0_rgba(255,255,255,0.32)]',
              variant === 'solid' &&
                resolvedAccent &&
                isColorLight(hexToAccentPair(resolvedAccent).fill) &&
                '[text-shadow:0_1px_0_rgba(255,255,255,0.32)]',
            )}
          >
            {children}
          </span>
          {icon === 'right' && (
            <span className="flex items-center leading-none shrink-0">
              {iconRight ?? <PlayIcon />}
            </span>
          )}
        </>
      )}
    </button>
  )
}
