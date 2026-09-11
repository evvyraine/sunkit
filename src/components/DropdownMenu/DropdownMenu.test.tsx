import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { DropdownMenu } from './DropdownMenu'

describe('DropdownMenu', () => {
  it('renders the trigger with no menu initially', () => {
    render(
      <DropdownMenu trigger={<button>Actions</button>}>
        <DropdownMenu.Item>Rename</DropdownMenu.Item>
      </DropdownMenu>,
    )
    expect(screen.getByRole('button', { name: 'Actions' })).toBeInTheDocument()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('opens on trigger click with menu semantics and focuses the first item', async () => {
    render(
      <DropdownMenu trigger={<button>Actions</button>}>
        <DropdownMenu.Item>Rename</DropdownMenu.Item>
      </DropdownMenu>,
    )
    const trigger = screen.getByRole('button', { name: 'Actions' })
    await userEvent.click(trigger)

    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'Rename' })).toHaveFocus()
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
  })

  it('cycles through enabled items with the arrow keys', async () => {
    render(
      <DropdownMenu trigger={<button>Actions</button>}>
        <DropdownMenu.Item>One</DropdownMenu.Item>
        <DropdownMenu.Item>Two</DropdownMenu.Item>
        <DropdownMenu.Item>Three</DropdownMenu.Item>
      </DropdownMenu>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }))
    const one = screen.getByRole('menuitem', { name: 'One' })
    const three = screen.getByRole('menuitem', { name: 'Three' })
    expect(one).toHaveFocus()

    await userEvent.keyboard('{ArrowDown}')
    expect(screen.getByRole('menuitem', { name: 'Two' })).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    expect(three).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    expect(one).toHaveFocus()
    await userEvent.keyboard('{ArrowUp}')
    expect(three).toHaveFocus()
  })

  it('supports Home and End', async () => {
    render(
      <DropdownMenu trigger={<button>Actions</button>}>
        <DropdownMenu.Item>One</DropdownMenu.Item>
        <DropdownMenu.Item>Two</DropdownMenu.Item>
        <DropdownMenu.Item>Three</DropdownMenu.Item>
      </DropdownMenu>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }))
    await userEvent.keyboard('{End}')
    expect(screen.getByRole('menuitem', { name: 'Three' })).toHaveFocus()
    await userEvent.keyboard('{Home}')
    expect(screen.getByRole('menuitem', { name: 'One' })).toHaveFocus()
  })

  it('selects the focused item with Enter and closes', async () => {
    const onSelect = vi.fn()
    render(
      <DropdownMenu trigger={<button>Actions</button>}>
        <DropdownMenu.Item onSelect={onSelect}>Rename</DropdownMenu.Item>
      </DropdownMenu>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }))
    await userEvent.keyboard('{Enter}')

    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('selects an item on click', async () => {
    const onSelect = vi.fn()
    render(
      <DropdownMenu trigger={<button>Actions</button>}>
        <DropdownMenu.Item onSelect={onSelect}>Duplicate</DropdownMenu.Item>
      </DropdownMenu>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }))
    await userEvent.click(screen.getByRole('menuitem', { name: 'Duplicate' }))
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('closes on Escape and restores focus to the trigger', async () => {
    render(
      <DropdownMenu trigger={<button>Actions</button>}>
        <DropdownMenu.Item>Rename</DropdownMenu.Item>
      </DropdownMenu>,
    )
    const trigger = screen.getByRole('button', { name: 'Actions' })
    await userEvent.click(trigger)
    await userEvent.keyboard('{Escape}')

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('skips disabled items when navigating and selecting', async () => {
    const onDisabled = vi.fn()
    render(
      <DropdownMenu trigger={<button>Actions</button>}>
        <DropdownMenu.Item>One</DropdownMenu.Item>
        <DropdownMenu.Item disabled onSelect={onDisabled}>
          Two
        </DropdownMenu.Item>
        <DropdownMenu.Item>Three</DropdownMenu.Item>
      </DropdownMenu>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }))
    expect(screen.getByRole('menuitem', { name: 'One' })).toHaveFocus()

    await userEvent.keyboard('{ArrowDown}')
    expect(screen.getByRole('menuitem', { name: 'Three' })).toHaveFocus()

    await userEvent.click(screen.getByRole('menuitem', { name: 'Two' }))
    expect(onDisabled).not.toHaveBeenCalled()
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('renders separators and labels with the right roles', async () => {
    render(
      <DropdownMenu trigger={<button>Actions</button>}>
        <DropdownMenu.Label>Manage</DropdownMenu.Label>
        <DropdownMenu.Item>Rename</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item destructive>Delete</DropdownMenu.Item>
      </DropdownMenu>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }))

    expect(screen.getByRole('separator')).toBeInTheDocument()
    expect(screen.getByText('Manage')).toHaveAttribute('role', 'presentation')
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeInTheDocument()
  })

  it('calls onOpenChange when toggled (uncontrolled)', async () => {
    const onChange = vi.fn()
    render(
      <DropdownMenu trigger={<button>Actions</button>} onOpenChange={onChange}>
        <DropdownMenu.Item>Rename</DropdownMenu.Item>
      </DropdownMenu>,
    )
    const trigger = screen.getByRole('button', { name: 'Actions' })
    await userEvent.click(trigger)
    expect(onChange).toHaveBeenLastCalledWith(true)
    await userEvent.click(trigger)
    expect(onChange).toHaveBeenLastCalledWith(false)
  })

  it('supports typeahead focus', async () => {
    render(
      <DropdownMenu trigger={<button>Actions</button>}>
        <DropdownMenu.Item>Apple</DropdownMenu.Item>
        <DropdownMenu.Item>Banana</DropdownMenu.Item>
        <DropdownMenu.Item>Cherry</DropdownMenu.Item>
      </DropdownMenu>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }))
    await userEvent.keyboard('b')
    expect(screen.getByRole('menuitem', { name: 'Banana' })).toHaveFocus()
  })
})
