import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Popover } from './Popover'

describe('Popover', () => {
  it('renders the trigger with no panel initially', () => {
    render(
      <Popover trigger={<button>Open</button>}>
        <p>Panel content</p>
      </Popover>,
    )
    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens on trigger click and exposes dialog semantics', async () => {
    render(
      <Popover trigger={<button>Open</button>}>
        <p>Panel content</p>
      </Popover>,
    )
    const trigger = screen.getByRole('button', { name: 'Open' })
    await userEvent.click(trigger)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'false')
    expect(screen.getByText('Panel content')).toBeInTheDocument()
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('moves focus to the panel on open', async () => {
    render(
      <Popover trigger={<button>Open</button>}>
        <p>Panel content</p>
      </Popover>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('dialog')).toHaveFocus()
  })

  it('closes on Escape and restores focus to the trigger', async () => {
    render(
      <Popover trigger={<button>Open</button>}>
        <p>Panel content</p>
      </Popover>,
    )
    const trigger = screen.getByRole('button', { name: 'Open' })
    await userEvent.click(trigger)
    await userEvent.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('closes on outside mousedown', async () => {
    render(
      <div>
        <Popover trigger={<button>Open</button>}>
          <p>Panel content</p>
        </Popover>
        <button>Outside</button>
      </div>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Outside' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('calls onOpenChange when toggled (uncontrolled)', async () => {
    const onChange = vi.fn()
    render(
      <Popover trigger={<button>Open</button>} onOpenChange={onChange}>
        <p>Panel</p>
      </Popover>,
    )
    const trigger = screen.getByRole('button', { name: 'Open' })
    await userEvent.click(trigger)
    expect(onChange).toHaveBeenLastCalledWith(true)

    await userEvent.click(trigger)
    expect(onChange).toHaveBeenLastCalledWith(false)
  })

  it('respects a controlled open state', async () => {
    const onChange = vi.fn()
    render(
      <Popover open trigger={<button>Open</button>} onOpenChange={onChange}>
        <p>Panel</p>
      </Popover>,
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    expect(onChange).toHaveBeenLastCalledWith(false)
    // Still open — the parent owns the state.
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('uses a custom close label and closes from the close button', async () => {
    render(
      <Popover trigger={<button>Open</button>} closeLabel="Dismiss panel">
        <p>Panel</p>
      </Popover>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss panel' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('can hide the close button', async () => {
    render(
      <Popover trigger={<button>Open</button>} showClose={false}>
        <p>Panel</p>
      </Popover>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
  })
})
