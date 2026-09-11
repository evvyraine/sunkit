import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Skeleton } from './Skeleton'

describe('Skeleton', () => {
  it('is decorative by default', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('exposes a status role with a visually hidden label', () => {
    render(<Skeleton label="Loading profile" />)
    const status = screen.getByRole('status')
    expect(status).toBeInTheDocument()
    expect(screen.getByText('Loading profile')).toHaveClass('sr-only')
  })

  it('supports an aria-label without a visible label prop', () => {
    render(<Skeleton aria-label="Loading content" />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading content')
  })

  it('renders multiple lines for the text variant', () => {
    const { container } = render(<Skeleton variant="text" lines={3} />)
    const root = container.firstChild as HTMLElement
    expect(root.children).toHaveLength(3)
    const last = root.children[2] as HTMLElement
    expect(last.style.width).toBe('60%')
  })

  it('ignores lines for non-text variants', () => {
    const { container } = render(<Skeleton variant="rectangular" lines={3} />)
    expect(container.querySelectorAll('div')).toHaveLength(1)
  })

  it('applies width and height as inline styles', () => {
    const { container } = render(<Skeleton variant="circular" width={48} height={48} />)
    const el = container.firstChild as HTMLElement
    expect(el.style.width).toBe('48px')
    expect(el.style.height).toBe('48px')
  })

  it('animates by default and can be made static', () => {
    const { container: animated } = render(<Skeleton />)
    expect(animated.firstChild).toHaveClass('sk-skeleton-animated')

    const { container: staticSkeleton } = render(<Skeleton animation={false} />)
    expect(staticSkeleton.firstChild).not.toHaveClass('sk-skeleton-animated')
  })

  it('merges a custom className', () => {
    const { container } = render(<Skeleton className="my-skeleton" />)
    expect(container.firstChild).toHaveClass('my-skeleton')
  })
})
