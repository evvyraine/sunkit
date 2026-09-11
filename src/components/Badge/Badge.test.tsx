import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders its children', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('applies the default soft neutral styling', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toHaveClass('bg-pastel-neutral/45')
  })

  it('applies the requested tone and variant', () => {
    render(
      <Badge tone="sky" variant="solid">
        Info
      </Badge>,
    )
    const badge = screen.getByText('Info')
    expect(badge).toHaveClass('bg-pastel-sky')
    expect(badge).toHaveClass('text-pastel-sky-dark')
  })

  it('renders an outline variant without a background fill', () => {
    render(
      <Badge tone="mint" variant="outline">
        Done
      </Badge>,
    )
    const badge = screen.getByText('Done')
    expect(badge).toHaveClass('bg-transparent')
    expect(badge).toHaveClass('text-pastel-mint-dark')
  })

  it('renders a dot when requested', () => {
    render(<Badge dot>Status</Badge>)
    const badge = screen.getByText('Status')
    expect(badge.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })

  it('renders an icon before the label', () => {
    render(
      <Badge icon={<svg data-testid="badge-icon" />} tone="rose">
        Alert
      </Badge>,
    )
    expect(screen.getByTestId('badge-icon')).toBeInTheDocument()
  })

  it('applies size classes', () => {
    render(<Badge size="sm">Small</Badge>)
    expect(screen.getByText('Small')).toHaveClass('text-[10px]')
  })

  it('merges a custom className and forwards span attributes', () => {
    render(
      <Badge className="my-class" data-testid="badge">
        Tag
      </Badge>,
    )
    const badge = screen.getByTestId('badge')
    expect(badge).toHaveClass('my-class')
    expect(badge).toHaveTextContent('Tag')
  })
})
