import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import type { ComponentProps } from 'react'
import { Tabs } from './Tabs'

function renderTabs(props: ComponentProps<typeof Tabs> = {}) {
  return render(
    <Tabs defaultValue="one" {...props}>
      <Tabs.List>
        <Tabs.Trigger value="one">One</Tabs.Trigger>
        <Tabs.Trigger value="two">Two</Tabs.Trigger>
        <Tabs.Trigger value="three">Three</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="one">First panel</Tabs.Content>
      <Tabs.Content value="two">Second panel</Tabs.Content>
      <Tabs.Content value="three">Third panel</Tabs.Content>
    </Tabs>,
  )
}

describe('Tabs', () => {
  it('renders a tablist with tabs and marks the default tab selected', () => {
    renderTabs()
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getAllByRole('tab')).toHaveLength(3)
    expect(screen.getByRole('tab', { name: 'One' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute('aria-selected', 'false')
  })

  it('only mounts the panel for the active tab', () => {
    renderTabs()
    expect(screen.getByRole('tabpanel')).toHaveTextContent('First panel')
    expect(screen.queryByText('Second panel')).not.toBeInTheDocument()
    expect(screen.queryByText('Third panel')).not.toBeInTheDocument()
  })

  it('wires aria-controls and aria-labelledby between tab and panel', () => {
    renderTabs()
    const tab = screen.getByRole('tab', { name: 'One' })
    const panel = screen.getByRole('tabpanel')
    expect(tab).toHaveAttribute('aria-controls', panel.id)
    expect(panel).toHaveAttribute('aria-labelledby', tab.id)
  })

  it('selects a tab on click (uncontrolled) and fires onValueChange', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderTabs({ defaultValue: 'one', onValueChange: onChange })

    await user.click(screen.getByRole('tab', { name: 'Two' }))

    expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Second panel')
    expect(onChange).toHaveBeenCalledWith('two')
  })

  it('does not fire onValueChange when re-selecting the active tab', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderTabs({ defaultValue: 'one', onValueChange: onChange })

    await user.click(screen.getByRole('tab', { name: 'One' }))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('respects a controlled value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderTabs({ value: 'one', onValueChange: onChange })

    await user.click(screen.getByRole('tab', { name: 'Three' }))

    expect(onChange).toHaveBeenCalledWith('three')
    expect(screen.getByRole('tab', { name: 'One' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('First panel')
  })

  it('moves selection with arrow keys (horizontal)', async () => {
    const user = userEvent.setup()
    renderTabs()

    screen.getByRole('tab', { name: 'One' }).focus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveFocus()

    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('tab', { name: 'One' })).toHaveAttribute('aria-selected', 'true')
  })

  it('supports Home and End', async () => {
    const user = userEvent.setup()
    renderTabs()

    screen.getByRole('tab', { name: 'One' }).focus()
    await user.keyboard('{End}')
    expect(screen.getByRole('tab', { name: 'Three' })).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{Home}')
    expect(screen.getByRole('tab', { name: 'One' })).toHaveAttribute('aria-selected', 'true')
  })

  it('moves selection with up/down arrows when vertical', async () => {
    const user = userEvent.setup()
    renderTabs({ orientation: 'vertical' })
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical')

    screen.getByRole('tab', { name: 'One' }).focus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute('aria-selected', 'true')
  })

  it('skips disabled tabs during keyboard navigation', async () => {
    const user = userEvent.setup()
    render(
      <Tabs defaultValue="one">
        <Tabs.List>
          <Tabs.Trigger value="one">One</Tabs.Trigger>
          <Tabs.Trigger value="two" disabled>
            Two
          </Tabs.Trigger>
          <Tabs.Trigger value="three">Three</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="one">First panel</Tabs.Content>
        <Tabs.Content value="three">Third panel</Tabs.Content>
      </Tabs>,
    )

    screen.getByRole('tab', { name: 'One' }).focus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Three' })).toHaveAttribute('aria-selected', 'true')
  })

  it('applies roving tabindex', () => {
    renderTabs()
    expect(screen.getByRole('tab', { name: 'One' })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute('tabindex', '-1')
  })
})
