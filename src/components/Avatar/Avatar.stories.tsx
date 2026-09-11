import type { Meta, StoryObj } from '@storybook/react'
import { Avatar, AvatarGroup } from './Avatar'
import { COLORS } from '../../tokens/colors'

const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'default', 'lg', 'xl'] },
    shape: { control: 'select', options: ['circle', 'rounded', 'square'] },
    tone: { control: 'select', options: COLORS.map((c) => c.id) },
    status: {
      control: 'select',
      options: [undefined, 'online', 'offline', 'busy', 'away'],
    },
    name: { control: 'text' },
    src: { control: 'text' },
  },
  args: {
    name: 'Evelyn Raine',
    size: 'default',
    shape: 'circle',
    tone: 'lavender',
  },
}

export default meta
type Story = StoryObj<typeof Avatar>

export const Default: Story = {}

export const WithImage: Story = {
  args: {
    name: 'Skye',
    src: 'https://i.pravatar.cc/160?img=47',
  },
}

export const Statuses: Story = {
  name: 'Statuses',
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Avatar {...args} status="online" />
      <Avatar {...args} status="away" />
      <Avatar {...args} status="busy" />
      <Avatar {...args} status="offline" />
    </div>
  ),
}

export const Shapes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Avatar {...args} shape="circle" size="lg" />
      <Avatar {...args} name="Skye Bot" shape="rounded" size="lg" tone="sky" />
      <Avatar {...args} shape="square" size="lg" tone="mint" />
    </div>
  ),
}

export const Group: Story = {
  name: 'Group',
  render: (args) => (
    <AvatarGroup label="Three teammates">
      <Avatar {...args} name="Evelyn Raine" />
      <Avatar {...args} name="Sam Cole" tone="mint" />
      <Avatar {...args} name="Ada Lovelace" tone="sky" />
    </AvatarGroup>
  ),
}
