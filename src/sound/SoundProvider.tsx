import { useEffect, type ReactNode } from 'react'
import {
  setRespectReducedMotion,
  setSoundEnabled,
  setSoundVolume,
  type SoundSettings,
} from './sound'

export interface SoundProviderProps {
  children?: ReactNode
  /** Enable or disable all Sunkit interaction sounds. */
  enabled?: boolean
  /** Global loudness multiplier, `0`–`1`. */
  volume?: number
  /** Suppress sounds under `prefers-reduced-motion: reduce` (default `true`). */
  respectReducedMotion?: boolean
}

/**
 * Configures global Sunkit sound settings for the tree below it.
 *
 * Rendering this provider is optional — components work without it — but it is
 * the recommended place to wire up an app-level sound preference (e.g. a mute
 * toggle persisted to storage).
 */
export function SoundProvider({
  children,
  enabled,
  volume,
  respectReducedMotion,
}: SoundProviderProps): ReactNode {
  useEffect(() => {
    if (enabled !== undefined) setSoundEnabled(enabled)
  }, [enabled])

  useEffect(() => {
    if (volume !== undefined) setSoundVolume(volume)
  }, [volume])

  useEffect(() => {
    if (respectReducedMotion !== undefined) setRespectReducedMotion(respectReducedMotion)
  }, [respectReducedMotion])

  return children
}

export type { SoundSettings }
