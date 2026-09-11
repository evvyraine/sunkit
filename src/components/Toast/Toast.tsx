import {
  useSyncExternalStore,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../lib/utils'
import { playCue } from '../../sound'

export type ToastTone = 'info' | 'success' | 'warning' | 'error'

export interface ToastOptions {
  id?: string
  title?: ReactNode
  description?: ReactNode
  tone?: ToastTone
  /** Milliseconds before auto-dismiss. `0` keeps it open. Defaults to `4500`. */
  duration?: number
  action?: ReactNode
  icon?: ReactNode
}

export interface ToastItem extends ToastOptions {
  id: string
  leaving?: boolean
}

const TONE: Record<ToastTone, { fill: string; border: string; cue: 'ready' | 'success' | 'error' }> =
  {
    info: { fill: '#B8DFFE', border: '#2a68a0', cue: 'ready' },
    success: { fill: '#B8F0D8', border: '#2a7a58', cue: 'success' },
    warning: { fill: '#FFF1A8', border: '#8a7820', cue: 'ready' },
    error: { fill: '#F9C5D1', border: '#c2607a', cue: 'error' },
  }

const DEFAULT_DURATION = 4500

// ── Store ─────────────────────────────────────────────────────────────────────

let items: ToastItem[] = []
const listeners = new Set<() => void>()
const timers = new Map<string, ReturnType<typeof setTimeout>>()
let seed = 0

function notify() {
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot(): ToastItem[] {
  return items
}

function setItems(next: ToastItem[]) {
  items = next
  notify()
}

function clearTimer(id: string) {
  const timer = timers.get(id)
  if (timer) {
    clearTimeout(timer)
    timers.delete(id)
  }
}

function remove(id: string) {
  clearTimer(id)
  setItems(items.filter((item) => item.id !== id))
}

/** Close a toast by id, playing its exit animation first. */
export function dismissToast(id: string) {
  clearTimer(id)
  const target = items.find((item) => item.id === id)
  if (!target || target.leaving) return
  setItems(items.map((item) => (item.id === id ? { ...item, leaving: true } : item)))
  timers.set(
    id,
    setTimeout(() => remove(id), 180),
  )
}

function schedule(id: string, duration?: number) {
  const ms = duration ?? DEFAULT_DURATION
  if (ms <= 0) return
  clearTimer(id)
  timers.set(
    id,
    setTimeout(() => dismissToast(id), ms),
  )
}

/** Pause a toast's auto-dismiss timer (e.g. on hover/focus). */
export function pauseToast(id: string) {
  clearTimer(id)
}

/** Resume a toast's auto-dismiss timer. */
export function resumeToast(id: string, duration?: number) {
  if (items.find((item) => item.id === id && !item.leaving)) schedule(id, duration)
}

function normalize(options: ToastOptions | string): ToastOptions {
  return typeof options === 'string' ? { title: options } : options
}

function show(options: ToastOptions | string): string {
  const opts = normalize(options)
  const id = opts.id ?? `sk-toast-${++seed}`
  const duration =
    opts.duration ?? (opts.tone === 'error' || opts.action != null ? 0 : DEFAULT_DURATION)
  clearTimer(id)
  setItems([...items.filter((item) => item.id !== id), { ...opts, id, duration, leaving: false }])
  schedule(id, duration)
  playCue(opts.tone ? TONE[opts.tone].cue : 'ready')
  return id
}

/** Imperative toast. Import anywhere — no hook required. */
export const toast = Object.assign(show, {
  success: (options: ToastOptions | string) => show({ ...normalize(options), tone: 'success' }),
  error: (options: ToastOptions | string) => show({ ...normalize(options), tone: 'error' }),
  info: (options: ToastOptions | string) => show({ ...normalize(options), tone: 'info' }),
  warning: (options: ToastOptions | string) => show({ ...normalize(options), tone: 'warning' }),
})

export interface ToastProviderProps {
  children?: ReactNode
  /** Keep at most this many toasts on screen. Defaults to `4`. */
  max?: number
}

const ICONS: Record<ToastTone, ReactNode> = {
  info: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="11" x2="12" y2="16" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  success: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
}

function ToastCard({ item }: { item: ToastItem }) {
  const tone = item.tone ?? 'info'
  const palette = TONE[tone]
  const [paused, setPaused] = useState(false)
  const duration = item.duration ?? DEFAULT_DURATION

  return (
    <div
      role={tone === 'error' || tone === 'warning' ? 'alert' : 'status'}
      className={cn(
        'pointer-events-auto relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-2xl border p-3 pr-10 font-sans',
        'shadow-[0_18px_40px_-14px_var(--sk-shadow-a),0_6px_16px_-6px_var(--sk-shadow-b)]',
        item.leaving ? 'sk-toast-out' : 'sk-toast-in',
      )}
      style={{
        background: 'var(--sk-bg)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderColor: `${palette.border}33`,
      }}
      onMouseEnter={() => {
        setPaused(true)
        pauseToast(item.id)
      }}
      onMouseLeave={() => {
        setPaused(false)
        resumeToast(item.id, duration)
      }}
      onFocus={() => {
        setPaused(true)
        pauseToast(item.id)
      }}
      onBlur={() => {
        setPaused(false)
        resumeToast(item.id, duration)
      }}
    >
      <span
        aria-hidden="true"
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
        style={{ background: `${palette.fill}66`, color: palette.border }}
      >
        {item.icon ?? ICONS[tone]}
      </span>
      <div className="min-w-0 flex-1">
        {item.title != null && (
          <div className="text-[13.5px] leading-snug font-semibold text-[var(--sk-text)]">
            {item.title}
          </div>
        )}
        {item.description != null && (
          <div className="mt-0.5 text-[12.5px] leading-snug text-[var(--sk-text-desc)]">
            {item.description}
          </div>
        )}
        {item.action != null && <div className="mt-2">{item.action}</div>}
      </div>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => dismissToast(item.id)}
        className="absolute top-2 right-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-[var(--sk-text-muted)] outline-none transition-colors hover:bg-[var(--sk-surface-filled)] hover:text-[var(--sk-text)] focus-visible:ring-2 focus-visible:ring-[var(--sk-border-strong)]"
      >
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      {duration > 0 && (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[3px] origin-left"
          style={
            {
              background: palette.border,
              opacity: 0.5,
              animation: `toast-progress ${duration}ms linear forwards`,
              animationPlayState: paused ? 'paused' : 'running',
            } as CSSProperties
          }
        />
      )}
    </div>
  )
}

/** Mount once near the app root. Toasts are rendered into a portal. */
export function ToastProvider({ children, max = 4 }: ToastProviderProps) {
  const list = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  const visible = max > 0 ? list.slice(-max) : list

  return (
    <>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:inset-x-auto sm:right-0 sm:items-end sm:p-4">
          {visible.map((item) => (
            <ToastCard key={item.id} item={item} />
          ))}
        </div>,
        document.body,
      )}
    </>
  )
}

/** Optional hook facade over the imperative API. */
export function useToast() {
  return {
    toast,
    success: toast.success,
    error: toast.error,
    info: toast.info,
    warning: toast.warning,
    dismiss: dismissToast,
  }
}
