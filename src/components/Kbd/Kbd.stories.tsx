import type { Meta, StoryObj } from '@storybook/react'
import { Kbd } from './Kbd'
import { COLORS } from '../../tokens/colors'

const meta: Meta<typeof Kbd> = {
  title: 'Atoms/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'default'] },
    tone: { control: 'select', options: COLORS.map((c) => c.id) },
    children: { control: 'text' },
  },
  args: { size: 'default', tone: 'neutral', children: 'K' },
}

export default meta
type Story = StoryObj<typeof Kbd>

export const Default: Story = {}

export const Chord: Story = {
  name: 'Chord',
  render: (args) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <Kbd {...args}>⌘</Kbd>
      <Kbd {...args}>K</Kbd>
    </span>
  ),
}
