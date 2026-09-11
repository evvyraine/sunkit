import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip } from './Tooltip'
import { Button } from '../Button/Button'
import { COLORS } from '../../tokens/colors'

const meta: Meta<typeof Tooltip> = {
  title: 'Overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      description: 'Which side the tooltip is placed on',
    },
    tone: {
      control: 'select',
      options: COLORS.map((c) => c.id),
      description: 'Pastel tone used for the tooltip border',
    },
    delay: {
      control: { type: 'number', min: 0, step: 50 },
      description: 'Hover delay in milliseconds',
    },
    disabled: { control: 'boolean' },
    content: { control: 'text' },
  },
  args: {
    content: 'This is a helpful tooltip',
    side: 'top',
    tone: 'neutral',
    delay: 150,
    disabled: false,
  },
}

export default meta
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  render: (args) => (
    <div style={{ padding: 96, display: 'flex', justifyContent: 'center' }}>
      <Tooltip {...args}>
        <Button>Hover or focus me</Button>
      </Tooltip>
    </div>
  ),
}

export const Sides: Story = {
  name: 'Sides',
  render: (args) => (
    <div
      style={{
        padding: 96,
        display: 'grid',
        gridTemplateColumns: 'repeat(2, max-content)',
        gap: 96,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip key={side} {...args} side={side} content={`Tooltip on ${side}`}>
          <Button variant="outline" color="sky">
            {side}
          </Button>
        </Tooltip>
      ))}
    </div>
  ),
}

export const Disabled: Story = {
  name: 'Disabled',
  render: (args) => (
    <div style={{ padding: 96, display: 'flex', justifyContent: 'center' }}>
      <Tooltip {...args} disabled content="You should never see this">
        <Button color="neutral">Tooltip disabled</Button>
      </Tooltip>
    </div>
  ),
}

export const LongContent: Story = {
  name: 'Long Content',
  render: (args) => (
    <div style={{ padding: 96, display: 'flex', justifyContent: 'center' }}>
      <Tooltip
        {...args}
        content="Tooltips can hold a longer sentence, but they should stay concise and readable rather than becoming a paragraph."
      >
        <Button color="lavender">Long content</Button>
      </Tooltip>
    </div>
  ),
}
