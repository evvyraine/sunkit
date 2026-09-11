import type { Meta, StoryObj } from '@storybook/react'
import {
  Message,
  MessageBubble,
  MessageList,
  MessageMeta,
  TypingIndicator,
} from './Message'
import { Avatar } from '../Avatar'

const meta: Meta<typeof Message> = {
  title: 'Chat/Message',
  component: Message,
  tags: ['autodocs'],
  argTypes: {
    align: { control: 'select', options: ['start', 'end'] },
  },
  args: { align: 'start' },
}

export default meta
type Story = StoryObj<typeof Message>

export const Conversation: Story = {
  render: () => (
    <MessageList label="Example conversation" style={{ maxWidth: 520 }}>
      <Message
        align="start"
        time="15:52"
        avatar={<Avatar name="Skye" tone="lavender" size="sm" />}
      >
        <MessageBubble variant="soft" tone="lavender" tail="start">
          Welcome back. Ask me anything.
        </MessageBubble>
      </Message>
      <Message align="end" time="15:52" avatar={<Avatar name="Evelyn Raine" tone="lilac" size="sm" />}>
        <MessageBubble variant="solid" tone="lilac" tail="end">
          Keep my messages on the right.
        </MessageBubble>
        <MessageMeta>Delivered</MessageMeta>
      </Message>
      <TypingIndicator />
    </MessageList>
  ),
}

export const Streaming: Story = {
  args: { align: 'start' },
  render: (args) => (
    <Message {...args} avatar={<Avatar name="Skye" size="sm" />}>
      <MessageBubble variant="soft" tone="lavender" tail="start" streaming>
        Writing the reply
      </MessageBubble>
    </Message>
  ),
}
