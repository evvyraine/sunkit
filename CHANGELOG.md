# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `SoundProvider` / `useSound` — a shared sound layer built on [cuelume](https://cuelume.dev): one `AudioContext`, global mute/volume, and `prefers-reduced-motion` support
- Semantic sound mapping (`playCue`, `playSound`, `playColorCue`) and per-tone voices for the colour picker
- New components: `Tooltip`, `Popover`, `DropdownMenu`, `Tabs`, `RadioGroup`, `Badge`, `Skeleton`, `Spinner`
- `Tone` / `TONES` / `TONE_FILL` / `TONE_BORDER` in `src/tokens/tones.ts` — one source of truth for the pastel scale
- Hosted Storybook preview (GitHub Pages) and Chromatic visual-test workflows
- README screenshots generated with `pnpm screenshots`, plus a sound on/off + volume toolbar in Storybook

### Changed

- Replaced the nine bespoke Web Audio hooks with cuelume, fixing the "one `AudioContext` per component" issue
- `Alert` dismissal now has a fallback timer and respects `prefers-reduced-motion` (no longer depends solely on `animationend`)
- `Select` exposes `aria-activedescendant` for screen readers and configurable `searchPlaceholder` / `emptyMessage`
- `Alert` (dismissLabel) and `Dialog` (closeLabel) accessible labels are now overridable
- `Button` outline/ghost accents adapt to dark mode for better contrast
- Fixed dark-mode theming: Tailwind's `dark:` variant is now bound to the `.dark` / `[data-theme='dark']` scope (plus OS preference) instead of only `prefers-color-scheme`, so Alerts, Badges, outline/ghost Buttons and Tabs are readable in dark mode; Tabs active state now picks a contrast-aware label colour
- Redesigned `Tabs`: inset track with an inner shadow and a raised pastel pill using `btn-shadow`, spring transition and press feedback
- `Slider` / `Progress` header rows no longer collide at narrow widths (truncating label, fixed value) and `Slider` mark labels align inward at the ends
- CI pins pnpm 10 and all pre-existing lint errors are fixed

### Removed

- `src/hooks/use*Sound.ts` (superseded by `src/sound`)

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
