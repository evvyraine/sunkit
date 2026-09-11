import type { Meta, StoryObj } from '@storybook/react'
import { Sheet } from './Sheet'
import { Button } from '../Button'
import { COLORS } from '../../tokens/colors'

const meta: Meta<typeof Sheet> = {
  title: 'Overlays/Sheet',
  component: Sheet,
  tags: ['autodocs'],
  argTypes: {
    side: { control: 'select', options: ['bottom', 'top', 'right', 'left'] },
    size: { control: 'select', options: ['sm', 'default', 'lg', 'full'] },
    tone: { control: 'select', options: COLORS.map((c) => c.id) },
    title: { control: 'text' },
    description: { control: 'text' },
  },
  args: {
    side: 'bottom',
    size: 'default',
    tone: 'lavender',
    title: 'Project settings',
    description: 'General questions',
    handle: true,
  },
}

export default meta
type Story = StoryObj<typeof Sheet>

export const Default: Story = {
  render: (args) => (
    <Sheet
      {...args}
      trigger={<Button color="lavender">Open sheet</Button>}
      footer={<Button color="lavender">Save</Button>}
    >
      <p>Sheets slide in from any edge and trap focus while open.</p>
      <p>Try Escape, the overlay, or Tab to move around.</p>
    </Sheet>
  ),
}

export const SideRight: Story = {
  args: { side: 'right', handle: false },
  render: Default.render,
}
