import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Tooltip } from './Tooltip'

describe('Tooltip', () => {
  it('renders the trigger', () => {
    render(
      <Tooltip content="Helpful hint">
        <button>Hover me</button>
      </Tooltip>,
    )
    expect(screen.getByRole('button', { name: 'Hover me' })).toBeInTheDocument()
  })

  it('does not render the tooltip until it is shown', () => {
    render(
      <Tooltip content="Helpful hint">
        <button>Hover me</button>
      </Tooltip>,
    )
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('shows on pointer hover and hides on leave', async () => {
    render(
      <Tooltip content="Helpful hint" delay={0}>
        <button>Hover me</button>
      </Tooltip>,
    )
    await userEvent.hover(screen.getByRole('button'))
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Helpful hint')

    await userEvent.unhover(screen.getByRole('button'))
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('shows on keyboard focus and wires aria-describedby', async () => {
    render(
      <Tooltip content="Helpful hint" delay={0}>
        <button>Hover me</button>
      </Tooltip>,
    )
    const trigger = screen.getByRole('button')
    await userEvent.tab()
    expect(trigger).toHaveFocus()

    const tooltip = screen.getByRole('tooltip')
    expect(trigger).toHaveAttribute('aria-describedby', tooltip.id)
  })

  it('hides on Escape while visible', async () => {
    render(
      <Tooltip content="Helpful hint" delay={0}>
        <button>Hover me</button>
      </Tooltip>,
    )
    const trigger = screen.getByRole('button')
    await userEvent.tab()
    expect(screen.getByRole('tooltip')).toBeInTheDocument()

    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('respects the delay before showing', () => {
    vi.useFakeTimers()
    try {
      render(
        <Tooltip content="Delayed" delay={30}>
          <button>Hover me</button>
        </Tooltip>,
      )
      fireEvent.mouseOver(screen.getByRole('button'))
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()

      act(() => {
        vi.advanceTimersByTime(30)
      })
      expect(screen.getByRole('tooltip')).toHaveTextContent('Delayed')
    } finally {
      vi.useRealTimers()
    }
  })

  it('does not show when disabled', async () => {
    render(
      <Tooltip content="Nope" disabled>
        <button>Hover me</button>
      </Tooltip>,
    )
    await userEvent.hover(screen.getByRole('button'))
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('applies the requested side', async () => {
    render(
      <Tooltip content="Right side" side="right" delay={0}>
        <button>Hover</button>
      </Tooltip>,
    )
    await userEvent.tab()
    await waitFor(() => expect(screen.getByRole('tooltip')).toHaveAttribute('data-side', 'right'))
  })
})
