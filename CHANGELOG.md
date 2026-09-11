# Changelog

## 0.2.0-alpha.7

### Minor Changes

- 3b7e328: Add chat and layout components: `Avatar`/`AvatarGroup`, `Separator`, `Kbd`,
  `EmptyState`, `ScrollArea`, `Sheet`, `Toast`/`ToastProvider`/`useToast`, and the
  `Message` family (`MessageList`, `Message`, `MessageBubble`, `MessageMeta`,
  `TypingIndicator`).

  Also make components inherit the surrounding font (`font-sans` instead of a
  hard-coded system stack) so consumers can supply their own type family, and
  export `ButtonVariant` from the package root.

  Accessibility fixes: `Button` and clickable shapes now show a visible
  `focus-visible` ring; `Dialog` and `Sheet` restore focus to their trigger on
  close; toasts carrying an `error` or an `action` stay until dismissed.

  Contrast fixes: darken the rose/peach/lemon/mint/sky border tones (now ≥ 4.5:1
  on their own fill), and raise the muted/description/placeholder text tokens in
  both themes to meet 4.5:1 on their surfaces.

  Mobile fixes: inputs and textareas render at 16px on small screens so iOS
  Safari no longer zooms the page when a field is focused.

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.2.0-alpha.0

### Minor Changes

- Adopt [cuelume](https://cuelume.dev) for interaction sounds: one shared `AudioContext`, global mute/volume and `prefers-reduced-motion` support, exposed through `SoundProvider`, `useSound` and `playCue`.
- Add `Tooltip`, `Popover`, `DropdownMenu`, `Tabs`, `RadioGroup`, `Badge`, `Skeleton` and `Spinner`.
- Fix dark-mode contrast across Alerts, Badges, outline/ghost Buttons and Tabs by binding Tailwind's `dark:` variant to the theme class.
- Redesign `Tabs` with an inset track and a raised, spring-animated pill.
- `Alert` dismissal has a fallback timer and respects reduced motion; `Select` exposes `aria-activedescendant`; Alert/Dialog labels are overridable.
- `Slider` and `Progress` header rows no longer collide at narrow widths.
- Add a hosted Storybook preview (GitHub Pages), Chromatic visual tests and a `pnpm screenshots` script.
- Centralise the pastel tone scale in `src/tokens/tones.ts` and remove the nine bespoke Web Audio hooks.

## [0.1.0] - 2026-04-14

### Added

- `Button` — pastel button with 8 color tones, size variants, icon support, and sound feedback
- `Toggle` — accessible switch component with animated knob and label/description support
- `Input` — text input with 3 variants (default, filled, ghost), adornments, label, description, and error state
- `Select` — styled select with tone and size variants
- `Slider` — range slider with marks, tone, and size support
- `Textarea` — auto-resizable textarea with variants matching Input
- `Progress` — progress bar with determinate and indeterminate modes
- `Card` — composable card with `Card.Header`, `Card.Body`, `Card.Footer` sub-components
- `ColorPicker` — pastel color picker with preset tokens
- `DatePicker` — single date and date range picker
- `Alert` — dismissable alert with info / success / warning / error variants
- `ThemeProvider` — context provider for global accent color overrides
- `COLORS` / `COLOR_MAP` — exported pastel color tokens
- `resolveAccent` / `hexToAccentPair` — accent color utility functions
- Web Audio sound feedback on interactive components via custom hooks
- Tailwind CSS v4 design tokens (`--sk-*` CSS variables) for theming
