import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { RadioGroup } from './RadioGroup'

function renderGroup() {
  return render(
    <RadioGroup label="Choose a plan" defaultValue="pro">
      <RadioGroup.Item value="free" label="Free" />
      <RadioGroup.Item value="pro" label="Pro" />
      <RadioGroup.Item value="team" label="Team" />
    </RadioGroup>,
  )
}

describe('RadioGroup', () => {
  it('renders a labelled radiogroup', () => {
    renderGroup()
    expect(screen.getByRole('radiogroup', { name: 'Choose a plan' })).toBeInTheDocument()
  })

  it('renders radios with aria-checked reflecting the default value', () => {
    renderGroup()
    expect(screen.getAllByRole('radio')).toHaveLength(3)
    expect(screen.getByRole('radio', { name: 'Pro' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'Free' })).toHaveAttribute('aria-checked', 'false')
  })

  it('selects on click (uncontrolled) and fires onValueChange', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <RadioGroup label="Plan" defaultValue="free" onValueChange={onChange}>
        <RadioGroup.Item value="free" label="Free" />
        <RadioGroup.Item value="pro" label="Pro" />
      </RadioGroup>,
    )

    await user.click(screen.getByRole('radio', { name: 'Pro' }))
    expect(screen.getByRole('radio', { name: 'Pro' })).toHaveAttribute('aria-checked', 'true')
    expect(onChange).toHaveBeenCalledWith('pro')
  })

  it('respects a controlled value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <RadioGroup label="Plan" value="free" onValueChange={onChange}>
        <RadioGroup.Item value="free" label="Free" />
        <RadioGroup.Item value="pro" label="Pro" />
      </RadioGroup>,
    )

    await user.click(screen.getByRole('radio', { name: 'Pro' }))
    expect(onChange).toHaveBeenCalledWith('pro')
    expect(screen.getByRole('radio', { name: 'Free' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'Pro' })).toHaveAttribute('aria-checked', 'false')
  })

  it('moves selection with arrow keys', async () => {
    const user = userEvent.setup()
    renderGroup()

    screen.getByRole('radio', { name: 'Pro' }).focus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('radio', { name: 'Team' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'Team' })).toHaveFocus()

    await user.keyboard('{ArrowUp}')
    expect(screen.getByRole('radio', { name: 'Pro' })).toHaveAttribute('aria-checked', 'true')
  })

  it('wraps around when navigating past the ends', async () => {
    const user = userEvent.setup()
    renderGroup()

    screen.getByRole('radio', { name: 'Pro' }).focus()
    await user.keyboard('{ArrowDown}{ArrowDown}')
    expect(screen.getByRole('radio', { name: 'Free' })).toHaveAttribute('aria-checked', 'true')
  })

  it('does not select a disabled item', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <RadioGroup label="Plan" defaultValue="free" onValueChange={onChange}>
        <RadioGroup.Item value="free" label="Free" />
        <RadioGroup.Item value="pro" label="Pro" disabled />
      </RadioGroup>,
    )

    await user.click(screen.getByRole('radio', { name: 'Pro' }))
    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByRole('radio', { name: 'Pro' })).toHaveAttribute('aria-checked', 'false')
  })

  it('disables every item when the group is disabled', () => {
    render(
      <RadioGroup label="Plan" disabled>
        <RadioGroup.Item value="free" label="Free" />
        <RadioGroup.Item value="pro" label="Pro" />
      </RadioGroup>,
    )
    expect(screen.getByRole('radio', { name: 'Free' })).toBeDisabled()
    expect(screen.getByRole('radio', { name: 'Pro' })).toBeDisabled()
  })

  it('wires up description, error and required state', () => {
    render(
      <RadioGroup
        label="Plan"
        description="Pick one"
        error="Required field"
        required
        aria-label="Plan group"
      >
        <RadioGroup.Item value="free" label="Free" description="No cost" />
      </RadioGroup>,
    )

    const group = screen.getByRole('radiogroup')
    expect(group).toHaveAttribute('aria-required', 'true')
    expect(group).toHaveAttribute('aria-invalid', 'true')
    const describedBy = group.getAttribute('aria-describedby') ?? ''
    expect(describedBy).toContain('description')
    expect(describedBy).toContain('error')

    const item = screen.getByRole('radio', { name: /Free/ })
    const itemDescriptionId = item.getAttribute('aria-describedby')
    expect(itemDescriptionId).toBeTruthy()
    expect(screen.getByText('No cost')).toHaveAttribute('id', itemDescriptionId)
  })

  it('applies a roving tabindex to the selected item', () => {
    renderGroup()
    expect(screen.getByRole('radio', { name: 'Pro' })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('radio', { name: 'Free' })).toHaveAttribute('tabindex', '-1')
  })
})
