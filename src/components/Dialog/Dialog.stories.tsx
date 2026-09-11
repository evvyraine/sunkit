import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Dialog } from './Dialog'
import { Button } from '../Button/Button'
import { COLORS } from '../../tokens/colors'

const meta: Meta<typeof Dialog> = {
  title: 'Atoms/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'default', 'lg', 'full'] },
    tone: { control: 'select', options: COLORS.map((c) => c.id) },
    closable: { control: 'boolean' },
    closeOnOverlay: { control: 'boolean' },
    radius: { control: { type: 'range', min: 0, max: 32, step: 1 } },
    title: { control: 'text' },
    description: { control: 'text' },
  },
  args: {
    tone: 'lavender',
    size: 'default',
    closable: true,
    closeOnOverlay: true,
    radius: 16,
    title: 'Dialog title',
    description: 'A short description of what this dialog is about.',
  },
}

export default meta
type Story = StoryObj<typeof Dialog>

export const Controlled: Story = {
  name: 'Controlled',
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button color="lavender" onClick={() => setOpen(true)}>
          Open Dialog
        </Button>
        <Dialog
          {...args}
          open={open}
          onOpenChange={setOpen}
          footer={
            <>
              <Button variant="ghost" color="neutral" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button color="lavender" onClick={() => setOpen(false)}>
                Confirm
              </Button>
            </>
          }
        >
          <p style={{ margin: 0, color: 'var(--sk-text-desc)', lineHeight: 1.6 }}>
            This is the dialog body. You can put any content here — forms, information,
            confirmations, or complex UI. The dialog traps focus and closes on Escape.
          </p>
        </Dialog>
      </>
    )
  },
}

export const WithTrigger: Story = {
  name: 'With Trigger Prop',
  render: (args) => (
    <Dialog
      {...args}
      trigger={<Button color="sky">Open via trigger prop</Button>}
      footer={<Button color="sky">Got it</Button>}
    >
      <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--sk-text-desc)' }}>
        The <code>trigger</code> prop wraps any element to become the dialog opener. No state
        management needed on your side.
      </p>
    </Dialog>
  ),
  args: { tone: 'sky', title: 'Trigger prop', description: undefined },
}

export const AllTones: Story = {
  name: 'All Tones',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
      {COLORS.map((c) => (
        <Dialog
          key={c.id}
          tone={c.id}
          title={c.label}
          description="Tone accent on border and close button."
          trigger={
            <Button color={c.id} size="sm">
              {c.label}
            </Button>
          }
          footer={
            <Button color={c.id} size="sm">
              Close
            </Button>
          }
        >
          <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--sk-text-desc)' }}>
            Dialog with <strong>{c.label}</strong> tone accent.
          </p>
        </Dialog>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  name: 'Sizes',
  render: () => (
    <div style={{ display: 'flex', gap: 10 }}>
      {(['sm', 'default', 'lg'] as const).map((size) => (
        <Dialog
          key={size}
          size={size}
          title={`Size: ${size}`}
          description="Dialog size controls the max width."
          trigger={
            <Button variant="outline" color="lavender" size="sm">
              {size}
            </Button>
          }
          footer={
            <Button color="lavender" size="sm">
              OK
            </Button>
          }
        >
          <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--sk-text-desc)' }}>
            This is a <strong>{size}</strong> dialog. Width:{' '}
            {{ sm: '360px', default: '480px', lg: '640px' }[size]}.
          </p>
        </Dialog>
      ))}
    </div>
  ),
}

export const NoFooter: Story = {
  name: 'No Footer',
  render: (args) => (
    <Dialog {...args} trigger={<Button color="mint">Info only</Button>}>
      <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--sk-text-desc)' }}>
        A dialog without a footer — just dismiss via the × button or Escape key.
      </p>
    </Dialog>
  ),
  args: { tone: 'mint', title: 'Information', footer: undefined },
}
