import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Alert } from './Alert'

describe('Alert', () => {
  it('renders title and children', () => {
    render(<Alert title="Heads up">Something happened</Alert>)
    expect(screen.getByText('Heads up')).toBeInTheDocument()
    expect(screen.getByText('Something happened')).toBeInTheDocument()
  })

  it('has role alert', () => {
    render(<Alert>Message</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('renders dismiss button when dismissable', () => {
    render(<Alert dismissable>Message</Alert>)
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument()
  })

  it('hides after dismiss', async () => {
    render(<Alert dismissable>Message</Alert>)
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())
  })

  it('calls onDismiss callback', async () => {
    const handler = vi.fn()
    render(
      <Alert dismissable onDismiss={handler}>
        Message
      </Alert>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
    await waitFor(() => expect(handler).toHaveBeenCalledTimes(1))
  })

  it('renders custom icon', () => {
    render(<Alert icon={<span data-testid="custom-icon" />}>Message</Alert>)
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it.each(['info', 'success', 'warning', 'error'] as const)('renders variant %s', (variant) => {
    render(<Alert variant={variant}>Message</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
