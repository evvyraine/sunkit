import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Slider } from './Slider'
import { COLORS } from '../../tokens/colors'

const meta: Meta<typeof Slider> = {
  title: 'Atoms/Slider',
  component: Slider,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    tone: { control: 'select', options: COLORS.map((c) => c.id) },
    size: { control: 'select', options: ['default', 'sm'] },
    showValue: { control: 'boolean' },
    showMinMax: { control: 'boolean' },
    disabled: { control: 'boolean' },
    min: { control: { type: 'number' } },
    max: { control: { type: 'number' } },
    step: { control: { type: 'number' } },
  },
  args: {
    tone: 'lavender',
    size: 'default',
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 40,
    label: 'Volume',
    showValue: true,
    disabled: false,
  },
}

export default meta
type Story = StoryObj<typeof Slider>

export const Default: Story = {}

export const WithMinMax: Story = {
  args: {
    label: 'Price range',
    min: 0,
    max: 500,
    step: 10,
    defaultValue: 150,
    showValue: true,
    showMinMax: true,
    tone: 'sky',
  },
}

export const AllTones: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 20, maxWidth: 400 }}>
      {COLORS.map((c) => (
        <Slider key={c.id} {...args} tone={c.id} label={c.label} defaultValue={40} />
      ))}
    </div>
  ),
  args: { showValue: true, size: 'sm', label: undefined },
}

export const WithMarks: Story = {
  args: {
    label: 'Temperature',
    min: 0,
    max: 100,
    step: 25,
    defaultValue: 50,
    showValue: true,
    tone: 'peach',
    marks: [
      { value: 0, label: 'Cold' },
      { value: 25, label: '25' },
      { value: 50, label: 'Med' },
      { value: 75, label: '75' },
      { value: 100, label: 'Hot' },
    ],
  },
}

export const Controlled: Story = {
  render: (args) => {
    const [val, setVal] = useState(30)
    return (
      <div style={{ display: 'grid', gap: 10, maxWidth: 400 }}>
        <Slider {...args} value={val} onValueChange={setVal} showValue label="Controlled" />
        <div style={{ fontSize: 12, color: '#666' }}>Value: {val}</div>
      </div>
    )
  },
  args: { tone: 'mint' },
}
