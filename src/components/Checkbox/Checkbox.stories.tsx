import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from './Checkbox'
import { COLORS } from '../../tokens/colors'

const meta: Meta<typeof Checkbox> = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'select', options: COLORS.map((c) => c.id) },
    size: { control: 'select', options: ['default', 'sm'] },
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
  },
  args: {
    tone: 'lavender',
    size: 'default',
    label: 'Accept terms and conditions',
    description: undefined,
    disabled: false,
    indeterminate: false,
  },
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {}

export const Controlled: Story = {
  name: 'Controlled',
  render: (args) => {
    const [checked, setChecked] = useState(false)
    return (
      <Checkbox
        {...args}
        checked={checked}
        onCheckedChange={setChecked}
        label={checked ? 'Checked ✓' : 'Click to check'}
      />
    )
  },
}

export const WithDescription: Story = {
  name: 'With Description',
  args: {
    label: 'Email notifications',
    description: "We'll only send you relevant updates, no spam.",
    tone: 'sky',
  },
}

export const WithError: Story = {
  name: 'With Error',
  args: {
    label: 'I agree to the Terms of Service',
    error: 'You must accept the terms to continue.',
    tone: 'rose',
  },
}

export const Indeterminate: Story = {
  name: 'Indeterminate',
  render: (args) => {
    const [items, setItems] = useState([false, true, false])
    const allChecked = items.every(Boolean)
    const someChecked = items.some(Boolean) && !allChecked
    const toggle = (i: number) => setItems((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
    const toggleAll = () => setItems(items.map(() => !allChecked))
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Checkbox
          {...args}
          checked={allChecked}
          indeterminate={someChecked}
          onCheckedChange={toggleAll}
          label="Select all"
          tone="lavender"
        />
        <div style={{ paddingLeft: 27, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {['Option A', 'Option B', 'Option C'].map((opt, i) => (
            <Checkbox
              key={opt}
              checked={items[i]}
              onCheckedChange={() => toggle(i)}
              label={opt}
              size="sm"
              tone="lavender"
            />
          ))}
        </div>
      </div>
    )
  },
}

export const AllTones: Story = {
  name: 'All Tones',
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {COLORS.map((c) => (
        <Checkbox key={c.id} {...args} tone={c.id} defaultChecked label={c.label} />
      ))}
    </div>
  ),
  args: { size: 'default' },
}

export const Sizes: Story = {
  name: 'Sizes',
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Checkbox {...args} size="default" defaultChecked label="Default size (18px)" tone="mint" />
      <Checkbox {...args} size="sm" defaultChecked label="Small size (14px)" tone="mint" />
    </div>
  ),
}

export const Disabled: Story = {
  name: 'Disabled',
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Checkbox {...args} disabled label="Disabled unchecked" />
      <Checkbox {...args} disabled defaultChecked label="Disabled checked" />
    </div>
  ),
  args: { tone: 'neutral' },
}
