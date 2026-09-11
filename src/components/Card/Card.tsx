import {
  useContext,
  type CSSProperties,
  type ElementType,
  type ReactNode,
  type HTMLAttributes,
} from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { hexToAccentPair } from '../../lib/accent'
import { ThemeContext } from '../Theme/ThemeProvider'

const cardVariants = cva(
  [
    'font-sans',
    'overflow-hidden',
    'transition-[box-shadow,background-color,border-color] duration-150 ease-out',
  ].join(' '),
  {
    variants: {
      variant: {
        elevated: 'bg-[var(--sk-surface)] border btn-shadow',
        filled: 'border',
        outline: 'bg-transparent border',
      },
      tone: {
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
    },
    compoundVariants: [
      { variant: 'elevated', tone: 'rose', className: 'border-pastel-rose-dark/[0.15]' },
      { variant: 'elevated', tone: 'peach', className: 'border-pastel-peach-dark/[0.15]' },
      { variant: 'elevated', tone: 'lemon', className: 'border-pastel-lemon-dark/[0.15]' },
      { variant: 'elevated', tone: 'mint', className: 'border-pastel-mint-dark/[0.15]' },
      { variant: 'elevated', tone: 'sky', className: 'border-pastel-sky-dark/[0.15]' },
      { variant: 'elevated', tone: 'lavender', className: 'border-pastel-lavender-dark/[0.15]' },
      { variant: 'elevated', tone: 'lilac', className: 'border-pastel-lilac-dark/[0.15]' },
      { variant: 'elevated', tone: 'neutral', className: 'border-pastel-neutral-dark/[0.15]' },
      {
        variant: 'filled',
        tone: 'rose',
        className: 'bg-pastel-rose/40     border-pastel-rose-dark/[0.18]',
      },
      {
        variant: 'filled',
        tone: 'peach',
        className: 'bg-pastel-peach/40    border-pastel-peach-dark/[0.18]',
      },
      {
        variant: 'filled',
        tone: 'lemon',
        className: 'bg-pastel-lemon/45    border-pastel-lemon-dark/[0.18]',
      },
      {
        variant: 'filled',
        tone: 'mint',
        className: 'bg-pastel-mint/40     border-pastel-mint-dark/[0.18]',
      },
      {
        variant: 'filled',
        tone: 'sky',
        className: 'bg-pastel-sky/40      border-pastel-sky-dark/[0.18]',
      },
      {
        variant: 'filled',
        tone: 'lavender',
        className: 'bg-pastel-lavender/40 border-pastel-lavender-dark/[0.18]',
      },
      {
        variant: 'filled',
        tone: 'lilac',
        className: 'bg-pastel-lilac/40    border-pastel-lilac-dark/[0.18]',
      },
      {
        variant: 'filled',
        tone: 'neutral',
        className: 'bg-pastel-neutral/40  border-pastel-neutral-dark/[0.18]',
      },
      { variant: 'outline', tone: 'rose', className: 'border-pastel-rose-dark/[0.35]' },
      { variant: 'outline', tone: 'peach', className: 'border-pastel-peach-dark/[0.35]' },
      { variant: 'outline', tone: 'lemon', className: 'border-pastel-lemon-dark/[0.35]' },
      { variant: 'outline', tone: 'mint', className: 'border-pastel-mint-dark/[0.35]' },
      { variant: 'outline', tone: 'sky', className: 'border-pastel-sky-dark/[0.35]' },
      { variant: 'outline', tone: 'lavender', className: 'border-pastel-lavender-dark/[0.35]' },
      { variant: 'outline', tone: 'lilac', className: 'border-pastel-lilac-dark/[0.35]' },
      { variant: 'outline', tone: 'neutral', className: 'border-pastel-neutral-dark/[0.35]' },
    ],
    defaultVariants: { variant: 'elevated', tone: 'neutral' },
  },
)

export type CardTone = NonNullable<VariantProps<typeof cardVariants>['tone']>
export type CardVariant = NonNullable<VariantProps<typeof cardVariants>['variant']>

export interface CardProps
  extends HTMLAttributes<HTMLElement>, Omit<VariantProps<typeof cardVariants>, 'tone'> {
  tone?: CardTone | (string & {})
  accentColor?: string
  as?: ElementType
  radius?: number
  padding?: number | string
  children?: ReactNode
}

export function Card({
  as: As = 'div',
  variant = 'elevated',
  tone = 'neutral',
  accentColor: accentColorProp,
  radius = 16,
  padding,
  className,
  style,
  children,
  ...rest
}: CardProps) {
  const { accentColor: ctxAccent } = useContext(ThemeContext)
  const resolvedAccent = accentColorProp ?? ctxAccent

  let accentStyle: CSSProperties | undefined
  if (resolvedAccent) {
    const { fill, border } = hexToAccentPair(resolvedAccent)
    if (variant === 'filled') {
      accentStyle = { backgroundColor: `${fill}66`, borderColor: `${border}30` }
    } else if (variant === 'outline') {
      accentStyle = { borderColor: `${border}55` }
    } else {
      accentStyle = { borderColor: `${border}25` }
    }
  }

  const cardStyle: CSSProperties = {
    borderRadius: radius,
    ...(padding != null ? { padding } : {}),
    ...accentStyle,
    ...style,
  }

  const effectiveTone = (resolvedAccent ? 'custom' : tone) as CardTone

  return (
    <As
      className={cn(cardVariants({ variant, tone: effectiveTone }), className)}
      style={cardStyle}
      {...rest}
    >
      {children}
    </As>
  )
}

interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

function CardHeader({ className, children, ...rest }: CardSectionProps) {
  return (
    <div
      className={cn(
        'px-[20px] py-[16px] border-b border-[var(--sk-border-subtle)] text-[var(--sk-text)]',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

function CardBody({ className, children, ...rest }: CardSectionProps) {
  return (
    <div className={cn('px-[20px] py-[16px] text-[var(--sk-text)]', className)} {...rest}>
      {children}
    </div>
  )
}

function CardFooter({ className, children, ...rest }: CardSectionProps) {
  return (
    <div
      className={cn(
        'px-[20px] py-[14px] border-t border-[var(--sk-border-subtle)] text-[var(--sk-text)]',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

Card.Header = CardHeader
Card.Body = CardBody
Card.Footer = CardFooter
