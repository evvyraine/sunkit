import type { Meta, StoryObj } from '@storybook/react'
import { EmptyState } from './EmptyState'
import { Button } from '../Button'
import { COLORS } from '../../tokens/colors'

const meta: Meta<typeof EmptyState> = {
  title: 'Atoms/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'default', 'lg'] },
    tone: { control: 'select', options: COLORS.map((c) => c.id) },
    title: { control: 'text' },
    description: { control: 'text' },
  },
  args: {
    tone: 'lavender',
    size: 'default',
    title: 'Nothing here yet',
    description: 'Create your first project to begin.',
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
}

export default meta
type Story = StoryObj<typeof EmptyState>

export const Default: Story = {}

export const WithAction: Story = {
  args: {
    action: <Button color="lavender">New project</Button>,
  },
}
