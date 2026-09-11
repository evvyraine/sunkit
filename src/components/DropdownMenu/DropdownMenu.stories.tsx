import type { Meta, StoryObj } from '@storybook/react'
import { DropdownMenu } from './DropdownMenu'
import { Button } from '../Button/Button'
import { COLORS } from '../../tokens/colors'

const RenameIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z" />
  </svg>
)

const CopyIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
)

const TrashIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
  </svg>
)

const meta: Meta<typeof DropdownMenu> = {
  title: 'Overlays/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Which side the menu is placed on',
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
      description: 'How the menu is aligned against the trigger',
    },
    tone: {
      control: 'select',
      options: COLORS.map((c) => c.id),
      description: 'Pastel tone used for the border',
    },
  },
  args: {
    side: 'bottom',
    align: 'start',
    tone: 'lavender',
  },
}

export default meta
type Story = StoryObj<typeof DropdownMenu>

export const Default: Story = {
  render: (args) => (
    <div style={{ padding: 120, display: 'flex', justifyContent: 'center' }}>
      <DropdownMenu {...args} trigger={<Button color="lavender">Actions</Button>}>
        <DropdownMenu.Label>File</DropdownMenu.Label>
        <DropdownMenu.Item onSelect={() => {}}>Rename</DropdownMenu.Item>
        <DropdownMenu.Item onSelect={() => {}}>Duplicate</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onSelect={() => {}}>Export…</DropdownMenu.Item>
      </DropdownMenu>
    </div>
  ),
}

export const WithIconsAndShortcuts: Story = {
  name: 'With Icons and Shortcuts',
  render: (args) => (
    <div style={{ padding: 120, display: 'flex', justifyContent: 'center' }}>
      <DropdownMenu {...args} trigger={<Button color="sky">Edit</Button>}>
        <DropdownMenu.Item icon={<RenameIcon />} shortcut="⌘E" onSelect={() => {}}>
          Rename
        </DropdownMenu.Item>
        <DropdownMenu.Item icon={<CopyIcon />} shortcut="⌘D" onSelect={() => {}}>
          Duplicate
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item shortcut="⌘⏎" onSelect={() => {}}>
          Open in new tab
        </DropdownMenu.Item>
      </DropdownMenu>
    </div>
  ),
}

export const Destructive: Story = {
  render: (args) => (
    <div style={{ padding: 120, display: 'flex', justifyContent: 'center' }}>
      <DropdownMenu {...args} trigger={<Button color="rose">Danger zone</Button>}>
        <DropdownMenu.Item icon={<RenameIcon />} onSelect={() => {}}>
          Rename
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item destructive icon={<TrashIcon />} shortcut="⌫" onSelect={() => {}}>
          Delete forever
        </DropdownMenu.Item>
      </DropdownMenu>
    </div>
  ),
}

export const DisabledItems: Story = {
  name: 'Disabled Items',
  render: (args) => (
    <div style={{ padding: 120, display: 'flex', justifyContent: 'center' }}>
      <DropdownMenu {...args} trigger={<Button color="neutral">Actions</Button>}>
        <DropdownMenu.Item icon={<RenameIcon />} onSelect={() => {}}>
          Rename
        </DropdownMenu.Item>
        <DropdownMenu.Item disabled icon={<CopyIcon />}>
          Duplicate (unavailable)
        </DropdownMenu.Item>
        <DropdownMenu.Item destructive disabled icon={<TrashIcon />}>
          Delete (unavailable)
        </DropdownMenu.Item>
      </DropdownMenu>
    </div>
  ),
}
