import type { Meta, StoryObj } from '@storybook/react'
import { Shape } from './Shape'
import { COLORS } from '../../tokens/colors'
import type { ShapeType } from './Shape'

const ALL_SHAPES: ShapeType[] = [
  'circle',
  'square',
  'triangle',
  'triangle-down',
  'diamond',
  'pentagon',
  'hexagon',
  'hexagon-flat',
  'octagon',
  'star4',
  'star5',
  'star6',
  'heart',
  'parallelogram',
  'shield',
  'cross',
  'arrow-right',
  'arrow-left',
  'arrow-up',
  'arrow-down',
]

const meta: Meta<typeof Shape> = {
  title: 'Atoms/Shape',
  component: Shape,
  tags: ['autodocs'],
  argTypes: {
    shape: { control: 'select', options: ALL_SHAPES },
    color: { control: 'select', options: COLORS.map((c) => c.id) },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] },
    rotation: { control: { type: 'range', min: 0, max: 360, step: 1 } },
    radius: { control: { type: 'range', min: 0, max: 49, step: 1 } },
    clickable: { control: 'boolean' },
  },
  args: {
    shape: 'hexagon',
    color: 'lavender',
    size: 'lg',
    rotation: 0,
    radius: 0,
    clickable: false,
  },
}

export default meta
type Story = StoryObj<typeof Shape>

export const Default: Story = {}

export const AllShapes: Story = {
  name: 'All Shapes',
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center' }}>
      {ALL_SHAPES.map((shape) => (
        <div
          key={shape}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
        >
          <Shape {...args} shape={shape} size="lg" />
          <span style={{ fontSize: 10, color: '#aaa', whiteSpace: 'nowrap' }}>{shape}</span>
        </div>
      ))}
    </div>
  ),
  args: { color: 'lavender', radius: 0 },
}

export const AllColors: Story = {
  name: 'All Colors',
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
      {COLORS.map((c) => (
        <Shape key={c.id} {...args} color={c.id} />
      ))}
    </div>
  ),
  args: { shape: 'hexagon', size: 'lg' },
}

export const RoundedCorners: Story = {
  name: 'Rounded Corners',
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {([0, 8, 18, 30] as number[]).map((r) => (
        <div key={r} style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#aaa', width: 42, flexShrink: 0 }}>r={r}</span>
          {(
            [
              'square',
              'triangle',
              'diamond',
              'pentagon',
              'hexagon',
              'hexagon-flat',
              'octagon',
              'star5',
              'parallelogram',
              'shield',
              'cross',
              'arrow-right',
            ] as ShapeType[]
          ).map((shape) => (
            <Shape key={shape} {...args} shape={shape} radius={r} size="md" />
          ))}
        </div>
      ))}
    </div>
  ),
  args: { color: 'lavender' },
}

export const WithChildren: Story = {
  name: 'With Children (Avatar / Badge)',
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center' }}>
      {(['circle', 'hexagon', 'hexagon-flat', 'square', 'shield', 'star6'] as ShapeType[]).map(
        (shape) => (
          <Shape key={shape} {...args} shape={shape} size="xl" radius={shape === 'square' ? 20 : 0}>
            <img
              src="https://i.pravatar.cc/96"
              alt="avatar"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Shape>
        ),
      )}
      {COLORS.map((c) => (
        <Shape key={c.id} shape="hexagon" color={c.id} size="md">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </Shape>
      ))}
    </div>
  ),
}

export const Clickable: Story = {
  name: 'Clickable',
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
      {COLORS.map((c) => (
        <Shape
          key={c.id}
          {...args}
          color={c.id}
          clickable
          onClick={() => alert(`Clicked ${c.label}!`)}
        />
      ))}
    </div>
  ),
  args: { shape: 'hexagon', size: 'lg', clickable: true },
}

export const Rotation: Story = {
  name: 'Rotation',
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center' }}>
      {[0, 30, 45, 60, 90, 120, 135, 180].map((deg) => (
        <div
          key={deg}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
        >
          <Shape {...args} rotation={deg} />
          <span style={{ fontSize: 10, color: '#aaa' }}>{deg}°</span>
        </div>
      ))}
    </div>
  ),
  args: { shape: 'triangle', color: 'peach', size: 'md' },
}

export const Sizes: Story = {
  name: 'Sizes',
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((s) => (
        <div
          key={s}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
        >
          <Shape {...args} size={s} />
          <span style={{ fontSize: 10, color: '#aaa' }}>{s}</span>
        </div>
      ))}
    </div>
  ),
  args: { shape: 'hexagon', color: 'sky' },
}
