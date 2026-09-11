import type { Meta, StoryObj } from '@storybook/react'
import { Separator } from './Separator'
import { COLORS } from '../../tokens/colors'

const meta: Meta<typeof Separator> = {
  title: 'Atoms/Separator',
  component: Separator,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    tone: {
      control: 'select',
      options: ['muted', ...COLORS.map((c) => c.id)],
    },
    label: { control: 'text' },
  },
  args: {
    orientation: 'horizontal',
    tone: 'muted',
  },
}

export default meta
type Story = StoryObj<typeof Separator>

export const Default: Story = {}

export const WithLabel: Story = {
  args: { label: 'Appearance', tone: 'lavender' },
}

export const Vertical: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 40 }}>
      <span>Left</span>
      <Separator {...args} orientation="vertical" />
      <span>Right</span>
    </div>
  ),
}
