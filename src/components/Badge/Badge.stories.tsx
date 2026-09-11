import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'
import { COLORS } from '../../tokens/colors'
import { TONES } from '../../tokens/tones'

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'select',
      options: TONES,
      description: 'Pastel tone',
    },
    variant: {
      control: 'select',
      options: ['solid', 'soft', 'outline'],
      description: 'Visual style',
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Badge size',
    },
    dot: { control: 'boolean', description: 'Show a leading status dot' },
    children: { control: 'text', description: 'Badge label' },
  },
  args: {
    tone: 'neutral',
    variant: 'soft',
    size: 'default',
    dot: false,
    children: 'Badge',
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {}

export const AllTones: Story = {
  name: 'All Tones',
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
      {COLORS.map((c) => (
        <Badge key={c.id} {...args} tone={c.id}>
          {c.label}
        </Badge>
      ))}
    </div>
  ),
  args: { variant: 'soft' },
}

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(['soft', 'solid', 'outline'] as const).map((variant) => (
        <div
          key={variant}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}
        >
          <span style={{ fontSize: 11, color: '#aaa', width: 56, flexShrink: 0 }}>{variant}</span>
          {COLORS.map((c) => (
            <Badge key={c.id} {...args} variant={variant} tone={c.id}>
              {c.label}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Badge {...args} size="sm">
        Small
      </Badge>
      <Badge {...args} size="default">
        Default
      </Badge>
      <Badge {...args} size="lg">
        Large
      </Badge>
    </div>
  ),
  args: { variant: 'solid', tone: 'sky' },
}

export const WithDot: Story = {
  name: 'With Dot',
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
      {COLORS.map((c) => (
        <Badge key={c.id} {...args} tone={c.id} dot>
          {c.label}
        </Badge>
      ))}
    </div>
  ),
  args: { variant: 'soft' },
}
