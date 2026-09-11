import type { Meta, StoryObj } from '@storybook/react'
import { useEffect, useState } from 'react'
import { Progress } from './Progress'
import { COLORS } from '../../tokens/colors'

const meta: Meta<typeof Progress> = {
  title: 'Atoms/Progress',
  component: Progress,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    tone: { control: 'select', options: COLORS.map((c) => c.id) },
    size: { control: 'select', options: ['sm', 'default', 'lg'] },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    showValue: { control: 'boolean' },
    animated: { control: 'boolean' },
  },
  args: {
    tone: 'lavender',
    size: 'default',
    value: 65,
    label: 'Upload progress',
    showValue: true,
    animated: true,
  },
}

export default meta
type Story = StoryObj<typeof Progress>

export const Default: Story = {}

export const Indeterminate: Story = {
  args: { value: undefined, label: 'Loading…', showValue: false },
}

export const AllTones: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 400 }}>
      {COLORS.map((c, i) => (
        <Progress key={c.id} {...args} tone={c.id} value={(i + 1) * 11} label={c.label} showValue />
      ))}
    </div>
  ),
  args: { size: 'default', animated: true },
}

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 400 }}>
      <Progress {...args} size="sm" label="Small" value={45} showValue />
      <Progress {...args} size="default" label="Default" value={65} showValue />
      <Progress {...args} size="lg" label="Large" value={80} showValue />
    </div>
  ),
  args: { tone: 'mint', animated: true },
}

export const Animated: Story = {
  render: (args) => {
    const [val, setVal] = useState(0)
    useEffect(() => {
      const t = setInterval(() => setVal((v) => (v >= 100 ? 0 : v + 2)), 80)
      return () => clearInterval(t)
    }, [])
    return <Progress {...args} value={val} showValue label="Simulated upload" />
  },
  args: { tone: 'sky', size: 'default' },
}
