import type { HTMLAttributes, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import type { Tone } from '../../tokens/tones'

const badgeVariants = cva(
  [
    'inline-flex items-center gap-[5px] whitespace-nowrap align-middle',
    'rounded-full border font-medium leading-none',
    'font-sans',
  ].join(' '),
  {
    variants: {
      variant: {
        solid: '',
        soft: '',
        outline: 'bg-transparent',
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
      },
      size: {
        sm: 'text-[10px] px-[7px] py-[3px]',
        default: 'text-[11px] px-[9px] py-[4px]',
        lg: 'text-[12px] px-[11px] py-[5px]',
      },
    },
    compoundVariants: [
      // ── SOLID ──────────────────────────────────────────────────────────────
      {
        variant: 'solid',
        tone: 'rose',
        className: 'bg-pastel-rose text-pastel-rose-dark border-pastel-rose-dark/[0.22]',
      },
      {
        variant: 'solid',
        tone: 'peach',
        className: 'bg-pastel-peach text-pastel-peach-dark border-pastel-peach-dark/[0.22]',
      },
      {
        variant: 'solid',
        tone: 'lemon',
        className: 'bg-pastel-lemon text-pastel-lemon-dark border-pastel-lemon-dark/[0.22]',
      },
      {
        variant: 'solid',
        tone: 'mint',
        className: 'bg-pastel-mint text-pastel-mint-dark border-pastel-mint-dark/[0.22]',
      },
      {
        variant: 'solid',
        tone: 'sky',
        className: 'bg-pastel-sky text-pastel-sky-dark border-pastel-sky-dark/[0.22]',
      },
      {
        variant: 'solid',
        tone: 'lavender',
        className:
          'bg-pastel-lavender text-pastel-lavender-dark border-pastel-lavender-dark/[0.22]',
      },
      {
        variant: 'solid',
        tone: 'lilac',
        className: 'bg-pastel-lilac text-pastel-lilac-dark border-pastel-lilac-dark/[0.22]',
      },
      {
        variant: 'solid',
        tone: 'neutral',
        className: 'bg-pastel-neutral text-pastel-neutral-dark border-pastel-neutral-dark/[0.22]',
      },

      // ── SOFT ───────────────────────────────────────────────────────────────
      {
        variant: 'soft',
        tone: 'rose',
        className:
          'bg-pastel-rose/45 text-pastel-rose-dark border-pastel-rose-dark/[0.18] dark:bg-pastel-rose/[0.18] dark:text-pastel-rose dark:border-pastel-rose/[0.24]',
      },
      {
        variant: 'soft',
        tone: 'peach',
        className:
          'bg-pastel-peach/45 text-pastel-peach-dark border-pastel-peach-dark/[0.18] dark:bg-pastel-peach/[0.18] dark:text-pastel-peach dark:border-pastel-peach/[0.24]',
      },
      {
        variant: 'soft',
        tone: 'lemon',
        className:
          'bg-pastel-lemon/50 text-pastel-lemon-dark border-pastel-lemon-dark/[0.18] dark:bg-pastel-lemon/[0.18] dark:text-pastel-lemon dark:border-pastel-lemon/[0.24]',
      },
      {
        variant: 'soft',
        tone: 'mint',
        className:
          'bg-pastel-mint/45 text-pastel-mint-dark border-pastel-mint-dark/[0.18] dark:bg-pastel-mint/[0.18] dark:text-pastel-mint dark:border-pastel-mint/[0.24]',
      },
      {
        variant: 'soft',
        tone: 'sky',
        className:
          'bg-pastel-sky/45 text-pastel-sky-dark border-pastel-sky-dark/[0.18] dark:bg-pastel-sky/[0.18] dark:text-pastel-sky dark:border-pastel-sky/[0.24]',
      },
      {
        variant: 'soft',
        tone: 'lavender',
        className:
          'bg-pastel-lavender/45 text-pastel-lavender-dark border-pastel-lavender-dark/[0.18] dark:bg-pastel-lavender/[0.18] dark:text-pastel-lavender dark:border-pastel-lavender/[0.24]',
      },
      {
        variant: 'soft',
        tone: 'lilac',
        className:
          'bg-pastel-lilac/45 text-pastel-lilac-dark border-pastel-lilac-dark/[0.18] dark:bg-pastel-lilac/[0.18] dark:text-pastel-lilac dark:border-pastel-lilac/[0.24]',
      },
      {
        variant: 'soft',
        tone: 'neutral',
        className:
          'bg-pastel-neutral/45 text-pastel-neutral-dark border-pastel-neutral-dark/[0.18] dark:bg-pastel-neutral/[0.18] dark:text-pastel-neutral dark:border-pastel-neutral/[0.24]',
      },

      // ── OUTLINE ────────────────────────────────────────────────────────────
      {
        variant: 'outline',
        tone: 'rose',
        className:
          'text-pastel-rose-dark border-pastel-rose-dark/[0.38] dark:text-pastel-rose dark:border-pastel-rose/[0.42]',
      },
      {
        variant: 'outline',
        tone: 'peach',
        className:
          'text-pastel-peach-dark border-pastel-peach-dark/[0.38] dark:text-pastel-peach dark:border-pastel-peach/[0.42]',
      },
      {
        variant: 'outline',
        tone: 'lemon',
        className:
          'text-pastel-lemon-dark border-pastel-lemon-dark/[0.38] dark:text-pastel-lemon dark:border-pastel-lemon/[0.42]',
      },
      {
        variant: 'outline',
        tone: 'mint',
        className:
          'text-pastel-mint-dark border-pastel-mint-dark/[0.38] dark:text-pastel-mint dark:border-pastel-mint/[0.42]',
      },
      {
        variant: 'outline',
        tone: 'sky',
        className:
          'text-pastel-sky-dark border-pastel-sky-dark/[0.38] dark:text-pastel-sky dark:border-pastel-sky/[0.42]',
      },
      {
        variant: 'outline',
        tone: 'lavender',
        className:
          'text-pastel-lavender-dark border-pastel-lavender-dark/[0.38] dark:text-pastel-lavender dark:border-pastel-lavender/[0.42]',
      },
      {
        variant: 'outline',
        tone: 'lilac',
        className:
          'text-pastel-lilac-dark border-pastel-lilac-dark/[0.38] dark:text-pastel-lilac dark:border-pastel-lilac/[0.42]',
      },
      {
        variant: 'outline',
        tone: 'neutral',
        className:
          'text-pastel-neutral-dark border-pastel-neutral-dark/[0.38] dark:text-pastel-neutral dark:border-pastel-neutral/[0.42]',
      },
    ],
    defaultVariants: { variant: 'soft', tone: 'neutral', size: 'default' },
  },
)

export type BadgeTone = Tone
export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>
export type BadgeSize = NonNullable<VariantProps<typeof badgeVariants>['size']>

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  icon?: ReactNode
  children?: ReactNode
}

const DOT_SIZE: Record<BadgeSize, number> = { sm: 4, default: 5, lg: 6 }

export function Badge({
  tone = 'neutral',
  variant = 'soft',
  size = 'default',
  dot = false,
  icon,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, tone, size }), className)} {...rest}>
      {dot && (
        <span
          aria-hidden="true"
          className="inline-block shrink-0 rounded-full"
          style={{
            width: DOT_SIZE[size],
            height: DOT_SIZE[size],
            background: 'currentColor',
          }}
        />
      )}
      {icon != null && <span className="inline-flex items-center shrink-0">{icon}</span>}
      {children}
    </span>
  )
}
