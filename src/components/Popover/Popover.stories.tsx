import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Popover } from './Popover'
import { Button } from '../Button/Button'
import { Input } from '../Input/Input'
import { COLORS } from '../../tokens/colors'

const meta: Meta<typeof Popover> = {
  title: 'Overlays/Popover',
  component: Popover,
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Which side the panel is placed on',
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
      description: 'How the panel is aligned against the trigger',
    },
    tone: {
      control: 'select',
      options: COLORS.map((c) => c.id),
      description: 'Pastel tone used for the border and glow',
    },
    showClose: { control: 'boolean' },
    closeLabel: { control: 'text' },
  },
  args: {
    side: 'bottom',
    align: 'start',
    tone: 'lavender',
    showClose: true,
    closeLabel: 'Close',
  },
}

export default meta
type Story = StoryObj<typeof Popover>

export const Default: Story = {
  render: (args) => (
    <div style={{ padding: 140, display: 'flex', justifyContent: 'center' }}>
      <Popover
        {...args}
        trigger={<Button color="lavender">Open popover</Button>}
      >
        <div style={{ maxWidth: 240, paddingRight: 18 }}>
          <strong style={{ fontSize: 13 }}>Popover title</strong>
          <p style={{ margin: '6px 0 0', color: 'var(--sk-text-desc)' }}>
            Popovers hold supporting content, controls or short explanations next to their
            trigger.
          </p>
        </div>
      </Popover>
    </div>
  ),
}

export const Sides: Story = {
  name: 'Sides',
  render: (args) => (
    <div
      style={{
        padding: 160,
        display: 'grid',
        gridTemplateColumns: 'repeat(2, max-content)',
        gap: 120,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Popover
          key={side}
          {...args}
          side={side}
          align="center"
          trigger={
            <Button variant="outline" color="sky">
              {side}
            </Button>
          }
        >
          <span style={{ whiteSpace: 'nowrap' }}>Panel on {side}</span>
        </Popover>
      ))}
    </div>
  ),
}

export const Controlled: Story = {
  name: 'Controlled',
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <div style={{ padding: 140, display: 'flex', justifyContent: 'center' }}>
        <Popover
          {...args}
          open={open}
          onOpenChange={setOpen}
          trigger={
            <Button color="mint" onClick={() => setOpen((v) => !v)}>
              {open ? 'Hide details' : 'Show details'}
            </Button>
          }
        >
          <div style={{ maxWidth: 220, paddingRight: 18 }}>
            <p style={{ margin: 0 }}>This popover is fully controlled by the parent.</p>
            <Button size="sm" color="mint" onClick={() => setOpen(false)} style={{ marginTop: 10 }}>
              Got it
            </Button>
          </div>
        </Popover>
      </div>
    )
  },
}

export const WithForm: Story = {
  name: 'With Form',
  render: (args) => (
    <div style={{ padding: 160, display: 'flex', justifyContent: 'center' }}>
      <Popover
        {...args}
        align="start"
        trigger={<Button color="peach">Edit profile</Button>}
      >
        <form
          style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 240, paddingRight: 8 }}
          onSubmit={(e) => e.preventDefault()}
        >
          <Input label="Display name" placeholder="Ada Lovelace" />
          <Input label="Email" placeholder="ada@example.com" />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button type="submit" size="sm" color="peach">
              Save
            </Button>
          </div>
        </form>
      </Popover>
    </div>
  ),
}
