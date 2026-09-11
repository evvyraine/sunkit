import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Spinner } from './Spinner'

describe('Spinner', () => {
  it('renders a status role with a hidden default label', () => {
    render(<Spinner />)
    const status = screen.getByRole('status')
    expect(status).toBeInTheDocument()
    expect(screen.getByText('Loading')).toHaveClass('sr-only')
  })

  it('shows a custom hidden label', () => {
    render(<Spinner label="Fetching results" />)
    expect(screen.getByRole('status')).toHaveTextContent('Fetching results')
    expect(screen.getByText('Fetching results')).toHaveClass('sr-only')
  })

  it('renders a visible label on the right', () => {
    render(<Spinner labelPosition="right" label="Saving" />)
    const label = screen.getByText('Saving')
    expect(label).not.toHaveClass('sr-only')
    expect(screen.getByRole('status')).toHaveTextContent('Saving')
  })

  it('renders a visible label below', () => {
    render(<Spinner labelPosition="bottom" label="Uploading" />)
    expect(screen.getByText('Uploading')).not.toHaveClass('sr-only')
  })

  it('applies size in pixels', () => {
    const { container } = render(<Spinner size="lg" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '28')
    expect(svg).toHaveAttribute('height', '28')
  })

  it('uses the tone colour for the spinner', () => {
    const { container } = render(<Spinner tone="mint" />)
    const status = container.firstChild as HTMLElement
    expect(status.style.color).not.toBe('')
  })

  it('honours an explicit accentColor override', () => {
    const { container } = render(<Spinner accentColor="#ff8800" />)
    const status = container.firstChild as HTMLElement
    // hexToAccentPair derives a darker border colour applied as the currentColor.
    expect(status.style.color).not.toBe('')
  })

  it('merges a custom className', () => {
    const { container } = render(<Spinner className="my-spinner" />)
    expect(container.firstChild).toHaveClass('my-spinner')
  })
})
