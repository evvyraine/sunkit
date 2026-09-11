import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ThemeProvider } from '../components/Theme'
import { Alert } from '../components/Alert'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Checkbox } from '../components/Checkbox'
import { ColorPicker } from '../components/ColorPicker'
import { DatePicker } from '../components/DatePicker'
import { Dialog } from '../components/Dialog'
import { Input } from '../components/Input'
import { Progress } from '../components/Progress'
import { Select } from '../components/Select'
import { Shape } from '../components/Shape'
import { Slider } from '../components/Slider'
import { Textarea } from '../components/Textarea'
import { Toggle } from '../components/Toggle'
import type { ButtonColor } from '../components/Button'
import type { ShapeType } from '../components/Shape'

const CATEGORY_OPTIONS = [
  { value: 'design', label: 'Design' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'research', label: 'Research' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'ops', label: 'Operations' },
]

const TEAM_OPTIONS = [
  { value: 'solo', label: 'Just me' },
  { value: 'small', label: 'Small (2–5)' },
  { value: 'medium', label: 'Medium (6–15)' },
  { value: 'large', label: 'Large (16+)' },
]

const TONE_FROM_COLOR: Record<
  ButtonColor,
  'rose' | 'peach' | 'lemon' | 'mint' | 'sky' | 'lavender' | 'lilac' | 'neutral'
> = {
  rose: 'rose',
  peach: 'peach',
  lemon: 'lemon',
  mint: 'mint',
  sky: 'sky',
  lavender: 'lavender',
  lilac: 'lilac',
  neutral: 'neutral',
}

const PREVIEW_SHAPES: ShapeType[] = [
  'hexagon',
  'star5',
  'diamond',
  'shield',
  'octagon',
  'heart',
  'cross',
  'arrow-right',
]

// ── Theme control bar ─────────────────────────────────────────────────────────

function ThemeBar({
  dark,
  accent,
  onDarkChange,
  onAccentChange,
}: {
  dark: boolean
  accent: string
  onDarkChange: (v: boolean) => void
  onAccentChange: (v: string) => void
}) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '10px 24px',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        background: dark ? 'rgba(18,18,22,0.88)' : 'rgba(247,246,243,0.88)',
        borderBottom: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.07)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
        }}
      >
        Theme
      </span>

      {/* Dark mode toggle */}
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          cursor: 'pointer',
          fontSize: 13,
          color: dark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.60)',
          userSelect: 'none',
        }}
      >
        <span style={{ fontSize: 15 }}>{dark ? '🌙' : '☀️'}</span>
        {dark ? 'Dark' : 'Light'}
        <input
          type="checkbox"
          checked={dark}
          onChange={(e) => onDarkChange(e.target.checked)}
          style={{ display: 'none' }}
        />
      </label>

      {/* Toggle switch */}
      <div
        onClick={() => onDarkChange(!dark)}
        style={{
          width: 40,
          height: 22,
          borderRadius: 11,
          background: dark ? '#6d60e8' : '#d1cfc8',
          position: 'relative',
          cursor: 'pointer',
          transition: 'background 200ms',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 3,
            left: dark ? 21 : 3,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#fff',
            transition: 'left 200ms cubic-bezier(0.34,1.42,0.64,1)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
          }}
        />
      </div>

      <div
        style={{
          width: 1,
          height: 18,
          background: dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)',
        }}
      />

      {/* Accent color picker */}
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer',
          fontSize: 13,
          color: dark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.60)',
        }}
      >
        <span>Accent</span>
        <div style={{ position: 'relative', width: 28, height: 28 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: accent,
              border: dark ? '2px solid rgba(255,255,255,0.15)' : '2px solid rgba(0,0,0,0.12)',
              cursor: 'pointer',
            }}
          />
          <input
            type="color"
            value={accent}
            onChange={(e) => onAccentChange(e.target.value)}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0,
              width: '100%',
              height: '100%',
              cursor: 'pointer',
              border: 'none',
              padding: 0,
            }}
          />
        </div>
        <code
          style={{
            fontSize: 11,
            fontFamily: 'monospace',
            color: dark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.35)',
          }}
        >
          {accent}
        </code>
      </label>
    </div>
  )
}

// ── Main demo app ─────────────────────────────────────────────────────────────

function ProjectSetupApp({ dark, accent }: { dark: boolean; accent: string }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [team, setTeam] = useState('')
  const [deadline, setDeadline] = useState<Date | null>(null)
  const [color, setColor] = useState<ButtonColor>('lavender')
  const [priority, setPriority] = useState(50)
  const [description, setDescription] = useState('')
  const [notifications, setNotifications] = useState(true)
  const [isPublic, setIsPublic] = useState(false)
  const [aiAssist, setAiAssist] = useState(false)

  const [submitted, setSubmitted] = useState(false)
  const [nameError, setNameError] = useState('')

  // Checkbox state
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [dataRetention, setDataRetention] = useState(true)
  const [analytics, setAnalytics] = useState(false)

  // Dialog state
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const tone = TONE_FROM_COLOR[color]

  const filledFields = [
    name.trim().length > 0,
    category !== '',
    team !== '',
    deadline !== null,
    description.trim().length > 0,
  ]
  const completion = Math.round((filledFields.filter(Boolean).length / filledFields.length) * 100)

  const handleSubmit = () => {
    if (!name.trim()) {
      setNameError('Project name is required.')
      return
    }
    setNameError('')
    setConfirmOpen(true)
  }

  const handleConfirm = () => {
    setConfirmOpen(false)
    setSubmitted(true)
  }

  const handleReset = () => {
    setName('')
    setCategory('')
    setTeam('')
    setDeadline(null)
    setColor('lavender')
    setPriority(50)
    setDescription('')
    setNotifications(true)
    setIsPublic(false)
    setAiAssist(false)
    setSubmitted(false)
    setNameError('')
    setTermsAccepted(false)
    setDataRetention(true)
    setAnalytics(false)
  }

  const priorityLabel = priority < 34 ? 'Low' : priority < 67 ? 'Medium' : 'High'

  const textColor = dark ? 'rgba(255,255,255,0.80)' : 'rgba(0,0,0,0.80)'
  const subTextColor = dark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.45)'

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 44px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '40px 24px 64px',
        background: dark ? '#121216' : '#f7f6f3',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ width: '100%', maxWidth: 560 }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 700,
              color: textColor,
              letterSpacing: '-0.3px',
            }}
          >
            New project
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: subTextColor }}>
            Fill in the details below to get started.
          </p>
        </div>

        {/* Shapes showcase */}
        <div
          style={{
            marginBottom: 28,
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {PREVIEW_SHAPES.map((shape, i) => {
            const colors: ButtonColor[] = [
              'lavender',
              'sky',
              'mint',
              'peach',
              'rose',
              'lemon',
              'lilac',
              'neutral',
            ]
            return (
              <Shape
                key={shape}
                shape={shape}
                size="sm"
                color={TONE_FROM_COLOR[colors[i % colors.length]]}
                accentColor={accent}
                radius={shape === 'hexagon' || shape === 'octagon' ? 4 : 0}
                clickable
              />
            )
          })}
        </div>

        {/* Completion progress */}
        <div style={{ marginBottom: 24 }}>
          <Progress value={completion} tone={tone} size="sm" label="Form completion" showValue />
        </div>

        {submitted && (
          <div style={{ marginBottom: 20 }}>
            <Alert variant="success" title="Project created!" dismissable onDismiss={handleReset}>
              <strong>{name}</strong> has been created with {priorityLabel.toLowerCase()} priority.{' '}
              {deadline
                ? `Deadline: ${deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.`
                : ''}
            </Alert>
          </div>
        )}

        {!submitted && priority >= 80 && (
          <div style={{ marginBottom: 20 }}>
            <Alert variant="warning" title="High priority">
              This project is flagged as high priority. Make sure your team is aligned before
              launching.
            </Alert>
          </div>
        )}

        {/* Main card */}
        <Card variant="elevated" tone={tone} radius={20}>
          <Card.Header>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: dark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.65)',
                }}
              >
                Project details
              </span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Button
                  size="sm"
                  color="neutral"
                  variant="ghost"
                  onClick={() => setSettingsOpen(true)}
                >
                  Settings
                </Button>
                <ColorPicker value={color} onChange={(c) => setColor(c)} size="sm" />
              </div>
            </div>
          </Card.Header>

          <Card.Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <Input
                label="Project name"
                placeholder="e.g. Brand refresh 2026"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (e.target.value) setNameError('')
                }}
                tone={tone}
                accentColor={accent}
                error={nameError || undefined}
                required
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Select
                  label="Category"
                  options={CATEGORY_OPTIONS}
                  value={category}
                  onChange={setCategory}
                  placeholder="Pick one…"
                  tone={tone}
                  accentColor={accent}
                  searchable
                />
                <Select
                  label="Team size"
                  options={TEAM_OPTIONS}
                  value={team}
                  onChange={setTeam}
                  placeholder="Pick one…"
                  tone={tone}
                  accentColor={accent}
                />
              </div>

              <DatePicker
                label="Deadline"
                value={deadline}
                onChange={setDeadline}
                tone={tone}
                accentColor={accent}
                minDate={new Date()}
                placeholder="Pick a date…"
              />

              <Textarea
                label="Description"
                placeholder="What is this project about? What's the goal?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                tone={tone}
                rows={3}
                autoResize
                maxLength={300}
                showCount
                description="Briefly describe the scope and objectives."
              />

              <Slider
                label="Priority"
                min={0}
                max={100}
                step={1}
                value={priority}
                onValueChange={setPriority}
                tone={tone}
                accentColor={accent}
                showValue={false}
                marks={[
                  { value: 0, label: 'Low' },
                  { value: 50, label: 'Medium' },
                  { value: 100, label: 'High' },
                ]}
                description={`Currently set to ${priorityLabel.toLowerCase()} priority (${priority}/100).`}
              />
            </div>
          </Card.Body>

          <Card.Footer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Toggle
                tone={tone}
                accentColor={accent}
                checked={notifications}
                onCheckedChange={setNotifications}
                label="Email notifications"
                description="Get notified when collaborators leave comments or update tasks."
              />
              <Toggle
                tone={tone}
                accentColor={accent}
                checked={isPublic}
                onCheckedChange={setIsPublic}
                label="Make project public"
                description="Anyone with the link can view this project in read-only mode."
              />
              <Toggle
                tone={tone}
                accentColor={accent}
                size="sm"
                checked={aiAssist}
                onCheckedChange={setAiAssist}
                label="AI suggestions"
                description="Let the assistant propose tasks and deadlines based on your description."
              />
            </div>
          </Card.Footer>
        </Card>

        {/* Checkboxes */}
        <Card variant="outline" tone={tone} radius={16} style={{ marginTop: 16 }}>
          <Card.Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p
                style={{
                  margin: '0 0 4px',
                  fontSize: 13,
                  fontWeight: 600,
                  color: dark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)',
                }}
              >
                Agreements
              </p>
              <Checkbox
                tone={tone}
                accentColor={accent}
                checked={termsAccepted}
                onCheckedChange={setTermsAccepted}
                label="I accept the Terms of Service"
                description="By checking this you agree to our terms and conditions."
              />
              <Checkbox
                tone={tone}
                accentColor={accent}
                checked={dataRetention}
                onCheckedChange={setDataRetention}
                label="Data retention for 12 months"
                description="Your project data will be kept for one year after deletion."
              />
              <Checkbox
                tone={tone}
                accentColor={accent}
                checked={analytics}
                onCheckedChange={setAnalytics}
                label="Share anonymous usage analytics"
              />
            </div>
          </Card.Body>
        </Card>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
          <Button color="neutral" variant="ghost" onClick={handleReset}>
            Discard
          </Button>
          <Button color={color} accentColor={accent} onClick={handleSubmit}>
            Create project
          </Button>
        </div>

        {/* Info alert at the bottom */}
        <div style={{ marginTop: 24 }}>
          <Alert variant="info" title="You can change these settings later">
            Everything here can be edited from the project settings page at any time.
          </Alert>
        </div>
      </div>

      {/* Confirm dialog */}
      <Dialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Create project?"
        description={`"${name}" will be created with ${priorityLabel.toLowerCase()} priority.`}
        tone={tone}
        accentColor={accent}
        footer={
          <>
            <Button size="sm" color="neutral" variant="ghost" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" color={color} accentColor={accent} onClick={handleConfirm}>
              Confirm
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
            <Shape shape="circle" size="xs" color={tone} accentColor={accent} />
            <span>
              Category: <strong>{category || 'Not set'}</strong>
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
            <Shape shape="circle" size="xs" color={tone} accentColor={accent} />
            <span>
              Team size:{' '}
              <strong>{TEAM_OPTIONS.find((o) => o.value === team)?.label || 'Not set'}</strong>
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
            <Shape shape="circle" size="xs" color={tone} accentColor={accent} />
            <span>
              Deadline:{' '}
              <strong>
                {deadline
                  ? deadline.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Not set'}
              </strong>
            </span>
          </div>
          {!termsAccepted && (
            <Alert variant="warning" title="Terms not accepted">
              You haven&apos;t accepted the Terms of Service yet.
            </Alert>
          )}
        </div>
      </Dialog>

      {/* Settings dialog */}
      <Dialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        title="Project settings"
        description="Configure advanced options for this project."
        tone={tone}
        accentColor={accent}
        size="sm"
        footer={
          <Button
            size="sm"
            color={color}
            accentColor={accent}
            onClick={() => setSettingsOpen(false)}
          >
            Done
          </Button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Toggle
            tone={tone}
            accentColor={accent}
            checked={notifications}
            onCheckedChange={setNotifications}
            label="Email notifications"
            size="sm"
          />
          <Toggle
            tone={tone}
            accentColor={accent}
            checked={isPublic}
            onCheckedChange={setIsPublic}
            label="Public visibility"
            size="sm"
          />
          <Toggle
            tone={tone}
            accentColor={accent}
            checked={aiAssist}
            onCheckedChange={setAiAssist}
            label="AI suggestions"
            size="sm"
          />
        </div>
      </Dialog>
    </div>
  )
}

// ── Wrapper with theme controls ───────────────────────────────────────────────

function ProjectSetupWithTheme() {
  const [dark, setDark] = useState(false)
  const [accent, setAccent] = useState('#7c6cdc')

  return (
    <ThemeProvider dark={dark} accentColor={accent}>
      <div style={{ minHeight: '100vh', background: dark ? '#121216' : '#f7f6f3' }}>
        <ThemeBar dark={dark} accent={accent} onDarkChange={setDark} onAccentChange={setAccent} />
        <ProjectSetupApp dark={dark} accent={accent} />
      </div>
    </ThemeProvider>
  )
}

// ── Story ─────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Examples/Project Setup',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => <ProjectSetupWithTheme />,
}
