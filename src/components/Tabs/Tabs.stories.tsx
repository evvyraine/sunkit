import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Tabs } from './Tabs'
import { TONES } from '../../tokens/tones'

const meta: Meta<typeof Tabs> = {
  title: 'Atoms/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Layout direction and the arrow keys used for navigation',
    },
    tone: {
      control: 'select',
      options: TONES,
      description: 'Pastel tone applied to the selected tab',
    },
    defaultValue: {
      control: 'text',
      description: 'Initially selected tab (uncontrolled)',
    },
    value: {
      control: 'text',
      description: 'Selected tab (controlled)',
    },
  },
  args: {
    tone: 'lavender',
    orientation: 'horizontal',
  },
}

export default meta
type Story = StoryObj<typeof Tabs>

const panelStyle = {
  padding: '14px 4px',
  fontSize: 13,
  lineHeight: 1.6,
  color: 'var(--sk-text)',
}

export const Default: Story = {
  render: (args) => (
    <Tabs {...args} defaultValue="overview">
      <Tabs.List>
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="overview" style={panelStyle}>
        A quick summary of everything happening in your workspace.
      </Tabs.Content>
      <Tabs.Content value="activity" style={panelStyle}>
        Recent activity from the people and projects you follow.
      </Tabs.Content>
      <Tabs.Content value="settings" style={panelStyle}>
        Preferences, notifications and account configuration.
      </Tabs.Content>
    </Tabs>
  ),
}

export const Vertical: Story = {
  render: (args) => (
    <Tabs {...args} orientation="vertical" defaultValue="profile">
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        <Tabs.List>
          <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
          <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
          <Tabs.Trigger value="team">Team</Tabs.Trigger>
        </Tabs.List>
        <div style={{ flex: 1 }}>
          <Tabs.Content value="profile" style={panelStyle}>
            Your public profile and display name.
          </Tabs.Content>
          <Tabs.Content value="billing" style={panelStyle}>
            Invoices, payment methods and plan history.
          </Tabs.Content>
          <Tabs.Content value="team" style={panelStyle}>
            Manage members and their permissions.
          </Tabs.Content>
        </div>
      </div>
    </Tabs>
  ),
}

export const WithDisabledTab: Story = {
  name: 'With Disabled Tab',
  render: (args) => (
    <Tabs {...args} defaultValue="inbox">
      <Tabs.List>
        <Tabs.Trigger value="inbox">Inbox</Tabs.Trigger>
        <Tabs.Trigger value="drafts" disabled>
          Drafts
        </Tabs.Trigger>
        <Tabs.Trigger value="archive">Archive</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="inbox" style={panelStyle}>
        Messages that need your attention.
      </Tabs.Content>
      <Tabs.Content value="drafts" style={panelStyle}>
        Unfinished messages.
      </Tabs.Content>
      <Tabs.Content value="archive" style={panelStyle}>
        Everything you have filed away.
      </Tabs.Content>
    </Tabs>
  ),
}

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('one')
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Tabs {...args} value={value} onValueChange={setValue}>
          <Tabs.List>
            <Tabs.Trigger value="one">One</Tabs.Trigger>
            <Tabs.Trigger value="two">Two</Tabs.Trigger>
            <Tabs.Trigger value="three">Three</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="one" style={panelStyle}>
            First panel.
          </Tabs.Content>
          <Tabs.Content value="two" style={panelStyle}>
            Second panel.
          </Tabs.Content>
          <Tabs.Content value="three" style={panelStyle}>
            Third panel.
          </Tabs.Content>
        </Tabs>
        <span style={{ fontSize: 11, color: '#aaa' }}>Selected value: {value}</span>
      </div>
    )
  },
}
