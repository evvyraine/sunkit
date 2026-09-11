import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '../components/Theme'
import { Alert } from '../components/Alert'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Checkbox } from '../components/Checkbox'
import { ColorPicker } from '../components/ColorPicker'
import { DropdownMenu } from '../components/DropdownMenu'
import { Input } from '../components/Input'
import { Popover } from '../components/Popover'
import { Progress } from '../components/Progress'
import { RadioGroup } from '../components/RadioGroup'
import { Select } from '../components/Select'
import { Skeleton } from '../components/Skeleton'
import { Slider } from '../components/Slider'
import { Spinner } from '../components/Spinner'
import { Tabs } from '../components/Tabs'
import { Textarea } from '../components/Textarea'
import { Toggle } from '../components/Toggle'

const CATEGORY_OPTIONS = [
  { value: 'design', label: 'Design' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'research', label: 'Research' },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card variant="elevated" tone="neutral" radius={18}>
      <Card.Header>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--sk-text-desc)',
          }}
        >
          {title}
        </span>
      </Card.Header>
      <Card.Body>{children}</Card.Body>
    </Card>
  )
}

function Gallery({ dark }: { dark: boolean }) {
  return (
    <ThemeProvider dark={dark} accentColor="#7c6cdc">
      <div
        style={{
          minHeight: '100vh',
          padding: '44px 40px 64px',
          background: dark ? '#121216' : '#f7f6f3',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Static showcase: finish entrance animations instantly so a headless
            screenshot captures the settled state. */}
        <style>{`*, *::before, *::after { animation-duration: 0.001ms !important; animation-delay: 0s !important; }`}</style>
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>
          <div style={{ marginBottom: 26 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: 26,
                  fontWeight: 750,
                  letterSpacing: '-0.4px',
                  color: 'var(--sk-text)',
                }}
              >
                Sunkit
              </h1>
              <Badge tone="lavender">v0.1.0-alpha</Badge>
            </div>
            <p style={{ margin: '8px 0 0', fontSize: 14, color: 'var(--sk-text-desc)' }}>
              Pastel React components with soft shadows, spring motion and Web Audio feedback.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              alignItems: 'start',
            }}
          >
            <Section title="Buttons & badges">
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 10,
                  alignItems: 'center',
                  marginBottom: 14,
                }}
              >
                <Button color="lavender">Primary</Button>
                <Button color="sky" variant="outline">
                  Outline
                </Button>
                <Button color="rose" variant="ghost">
                  Ghost
                </Button>
                <Button color="mint" icon="right">
                  Continue
                </Button>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <Badge tone="mint" variant="solid">
                  Shipped
                </Badge>
                <Badge tone="lemon">In review</Badge>
                <Badge tone="rose" variant="outline">
                  Blocked
                </Badge>
                <Badge tone="sky" dot>
                  Live
                </Badge>
              </div>
              <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
                <Spinner size="sm" tone="lavender" />
                <Spinner tone="sky" label="Loading" labelPosition="right" />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="55%" />
                </div>
              </div>
            </Section>

            <Section title="Feedback">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Alert variant="success" title="Saved">
                  Your changes are live for the whole team.
                </Alert>
                <Alert variant="info" title="Heads up">
                  Everything here can be edited later.
                </Alert>
                <Progress value={64} tone="lavender" label="Project completion" showValue />
              </div>
            </Section>

            <Section title="Form controls">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Input label="Project name" placeholder="Brand refresh 2026" tone="lavender" />
                <Select
                  label="Category"
                  options={CATEGORY_OPTIONS}
                  defaultValue="design"
                  tone="lavender"
                  searchable
                />
                <Textarea
                  label="Description"
                  placeholder="What is this project about?"
                  tone="lavender"
                  rows={2}
                />
                <Slider
                  label="Priority"
                  defaultValue={62}
                  tone="lavender"
                  marks={[
                    { value: 0, label: 'Low' },
                    { value: 50, label: 'Medium' },
                    { value: 100, label: 'High' },
                  ]}
                />
              </div>
            </Section>

            <Section title="Toggles & choices">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Toggle
                  defaultChecked
                  tone="lavender"
                  label="Email notifications"
                  description="Comments and task updates."
                />
                <Checkbox defaultChecked tone="mint" label="Share anonymous analytics" />
                <RadioGroup defaultValue="weekly" label="Digest frequency" tone="sky">
                  <RadioGroup.Item value="daily" label="Daily" />
                  <RadioGroup.Item value="weekly" label="Weekly" />
                  <RadioGroup.Item value="never" label="Never" />
                </RadioGroup>
                <ColorPicker defaultValue="lavender" label="Accent" size="sm" />
              </div>
            </Section>

            <Section title="Navigation">
              <Tabs defaultValue="overview" tone="lavender">
                <Tabs.List>
                  <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                  <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
                  <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="overview">
                  <p style={{ margin: '12px 0 0', fontSize: 13, color: 'var(--sk-text-desc)' }}>
                    A quick summary of everything happening in your workspace.
                  </p>
                </Tabs.Content>
                <Tabs.Content value="activity">
                  <p style={{ margin: '12px 0 0', fontSize: 13, color: 'var(--sk-text-desc)' }}>
                    Recent activity from the people you follow.
                  </p>
                </Tabs.Content>
                <Tabs.Content value="settings">
                  <p style={{ margin: '12px 0 0', fontSize: 13, color: 'var(--sk-text-desc)' }}>
                    Preferences and account configuration.
                  </p>
                </Tabs.Content>
              </Tabs>
            </Section>

            <div
              style={{
                border: '1px solid var(--sk-border)',
                borderRadius: 18,
                background: 'var(--sk-surface)',
                padding: '18px 20px',
                overflow: 'visible',
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: 'var(--sk-text-desc)',
                }}
              >
                Overlays
              </span>
              <div
                style={{
                  display: 'flex',
                  gap: 130,
                  paddingTop: 16,
                  minHeight: 220,
                  alignItems: 'flex-start',
                }}
              >
                <Popover
                  open
                  onOpenChange={() => {}}
                  tone="lavender"
                  trigger={<Button color="lavender">Popover</Button>}
                >
                  <div style={{ maxWidth: 210 }}>
                    <strong style={{ fontSize: 13, color: 'var(--sk-text)' }}>
                      Quick settings
                    </strong>
                    <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--sk-text-desc)' }}>
                      Anchored panels for supporting content.
                    </p>
                  </div>
                </Popover>

                <DropdownMenu
                  open
                  onOpenChange={() => {}}
                  tone="lavender"
                  trigger={
                    <Button color="neutral" variant="outline">
                      Actions
                    </Button>
                  }
                >
                  <DropdownMenu.Item onSelect={() => {}}>Rename</DropdownMenu.Item>
                  <DropdownMenu.Item onSelect={() => {}}>Duplicate</DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item destructive onSelect={() => {}}>
                    Delete
                  </DropdownMenu.Item>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

const meta: Meta = {
  title: 'Examples/Component Gallery',
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj

export const Light: Story = {
  render: () => <Gallery dark={false} />,
}

export const Dark: Story = {
  render: () => <Gallery dark />,
}
