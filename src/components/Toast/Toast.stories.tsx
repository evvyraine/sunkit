import type { Meta, StoryObj } from '@storybook/react'
import { ToastProvider, toast } from './Toast'
import { Button } from '../Button'

const meta: Meta<typeof ToastProvider> = {
  title: 'Overlays/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ToastProvider>

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
      <Button color="sky" onClick={() => toast.info({ title: 'Heads up', description: 'An info toast.' })}>
        Info
      </Button>
      <Button color="mint" onClick={() => toast.success({ title: 'Saved', description: 'Your changes are live.' })}>
        Success
      </Button>
      <Button color="lemon" onClick={() => toast.warning({ title: 'Careful', description: 'This cannot be undone.' })}>
        Warning
      </Button>
      <Button color="rose" onClick={() => toast.error({ title: 'Something broke', description: 'Try again in a moment.' })}>
        Error
      </Button>
    </div>
  ),
}

export const WithAction: Story = {
  render: () => (
    <Button
      color="lavender"
      onClick={() =>
        toast({
          title: 'Project created',
          description: 'Want to open it now?',
          action: (
            <Button size="sm" color="lavender">
              Open
            </Button>
          ),
        })
      }
    >
      Show toast
    </Button>
  ),
}
