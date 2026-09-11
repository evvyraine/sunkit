import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton } from './Skeleton'

const meta: Meta<typeof Skeleton> = {
  title: 'Atoms/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'circular', 'rectangular', 'rounded'],
      description: 'Shape of the placeholder',
    },
    width: { control: 'text', description: 'Width (number = px, string = any CSS length)' },
    height: { control: 'text', description: 'Height (number = px, string = any CSS length)' },
    lines: {
      control: { type: 'number', min: 1, max: 8, step: 1 },
      description: 'Number of bars for the text variant',
    },
    animation: { control: 'boolean', description: 'Animate the shimmer' },
    label: { control: 'text', description: 'Accessible status label' },
  },
  args: {
    variant: 'text',
    animation: true,
  },
}

export default meta
type Story = StoryObj<typeof Skeleton>

export const Text: Story = {
  render: (args) => (
    <div style={{ width: 320 }}>
      <Skeleton {...args} />
    </div>
  ),
  args: { variant: 'text' },
}

export const Circular: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
      <Skeleton {...args} variant="circular" width={48} height={48} />
      <Skeleton {...args} variant="circular" width={32} height={32} />
      <Skeleton {...args} variant="circular" width={20} height={20} />
    </div>
  ),
}

export const Rectangular: Story = {
  render: (args) => (
    <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Skeleton {...args} variant="rectangular" width="100%" height={120} />
      <Skeleton {...args} variant="rounded" width="100%" height={64} />
    </div>
  ),
}

export const Lines: Story = {
  render: (args) => (
    <div style={{ width: 320 }}>
      <Skeleton {...args} variant="text" lines={4} />
    </div>
  ),
  args: { lines: 4 },
}

export const NoAnimation: Story = {
  name: 'No Animation',
  render: (args) => (
    <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Skeleton {...args} animation={false} lines={3} />
      <Skeleton {...args} animation={false} variant="circular" width={40} height={40} />
    </div>
  ),
  args: { animation: false },
}
