import type { Meta, StoryObj } from '@storybook/react'
import { ScrollArea } from './ScrollArea'

const meta: Meta<typeof ScrollArea> = {
  title: 'Atoms/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ height: 180, width: 320, border: '1px solid var(--sk-border)', borderRadius: 16 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ScrollArea>

const rows = Array.from({ length: 24 }, (_, i) => i + 1)

export const Default: Story = {
  render: (args) => (
    <ScrollArea {...args}>
      {rows.map((row) => (
        <div key={row} style={{ padding: '8px 12px' }}>
          Row {row}
        </div>
      ))}
    </ScrollArea>
  ),
}

export const Faded: Story = {
  args: { fade: true },
  render: Default.render,
}
