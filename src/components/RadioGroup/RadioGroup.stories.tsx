import type { Meta, StoryObj } from '@storybook/react'
import { RadioGroup } from './RadioGroup'
import { TONES } from '../../tokens/tones'

const meta: Meta<typeof RadioGroup> = {
  title: 'Atoms/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Layout direction of the items',
    },
    size: {
      control: 'select',
      options: ['default', 'sm'],
      description: 'Control size',
    },
    tone: {
      control: 'select',
      options: TONES,
      description: 'Pastel tone applied to the selected item',
    },
    label: { control: 'text', description: 'Group label' },
    description: { control: 'text', description: 'Helper text below the group' },
    error: { control: 'text', description: 'Error message below the group' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Notification frequency',
    tone: 'lavender',
    size: 'default',
    orientation: 'vertical',
  },
}

export default meta
type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
  render: (args) => (
    <RadioGroup {...args} defaultValue="weekly">
      <RadioGroup.Item value="daily" label="Daily" />
      <RadioGroup.Item value="weekly" label="Weekly" />
      <RadioGroup.Item value="never" label="Never" />
    </RadioGroup>
  ),
}

export const Horizontal: Story = {
  render: (args) => (
    <RadioGroup {...args} orientation="horizontal" defaultValue="email">
      <RadioGroup.Item value="email" label="Email" />
      <RadioGroup.Item value="sms" label="SMS" />
      <RadioGroup.Item value="push" label="Push" />
    </RadioGroup>
  ),
}

export const WithDescriptions: Story = {
  name: 'With Descriptions',
  render: (args) => (
    <RadioGroup {...args} defaultValue="standard" label="Shipping speed">
      <RadioGroup.Item
        value="standard"
        label="Standard"
        description="Arrives in 4–6 business days"
      />
      <RadioGroup.Item
        value="express"
        label="Express"
        description="Arrives in 1–2 business days"
      />
      <RadioGroup.Item
        value="overnight"
        label="Overnight"
        description="Arrives tomorrow morning"
      />
    </RadioGroup>
  ),
}

export const Disabled: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <RadioGroup {...args} defaultValue="a" label="Group disabled" disabled>
        <RadioGroup.Item value="a" label="Option A" />
        <RadioGroup.Item value="b" label="Option B" />
      </RadioGroup>
      <RadioGroup {...args} defaultValue="b" label="One item disabled">
        <RadioGroup.Item value="a" label="Option A" />
        <RadioGroup.Item value="b" label="Option B" disabled />
        <RadioGroup.Item value="c" label="Option C" />
      </RadioGroup>
    </div>
  ),
}

export const Error: Story = {
  render: (args) => (
    <RadioGroup
      {...args}
      label="Payment method"
      required
      error="Please choose a payment method"
    >
      <RadioGroup.Item value="card" label="Credit card" />
      <RadioGroup.Item value="paypal" label="PayPal" />
      <RadioGroup.Item value="bank" label="Bank transfer" />
    </RadioGroup>
  ),
}
