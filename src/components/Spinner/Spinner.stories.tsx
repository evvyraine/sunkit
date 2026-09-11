import type { Meta, StoryObj } from '@storybook/react'
import { Spinner } from './Spinner'
import { COLORS } from '../../tokens/colors'
import { TONES } from '../../tokens/tones'

const meta: Meta<typeof Spinner> = {
  title: 'Atoms/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg'],
      description: 'Spinner diameter',
    },
    tone: {
      control: 'select',
      options: TONES,
      description: 'Pastel tone',
    },
    label: { control: 'text', description: 'Accessible label' },
    labelPosition: {
      control: 'select',
      options: ['hidden', 'right', 'bottom'],
      description: 'Position of the visible label',
    },
  },
  args: {
    size: 'default',
    tone: 'lavender',
    label: 'Loading',
    labelPosition: 'hidden',
  },
}

export default meta
type Story = StoryObj<typeof Spinner>

export const Default: Story = {}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
      {(['xs', 'sm', 'default', 'lg'] as const).map((size) => (
        <div
          key={size}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
        >
          <Spinner {...args} size={size} />
          <span style={{ fontSize: 11, color: '#aaa' }}>{size}</span>
        </div>
      ))}
    </div>
  ),
}

export const Tones: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center' }}>
      {COLORS.map((c) => (
        <div
          key={c.id}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
        >
          <Spinner {...args} tone={c.id} />
          <span style={{ fontSize: 11, color: '#aaa' }}>{c.label}</span>
        </div>
      ))}
    </div>
  ),
}

export const WithLabel: Story = {
  name: 'With Label',
  render: (args) => (
    <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
      <Spinner {...args} labelPosition="right" label="Loading data" />
      <Spinner {...args} labelPosition="bottom" label="Uploading" />
    </div>
  ),
}
