import { useSyncExternalStore } from 'react'
import {
  getSoundSettings,
  playColorCue,
  playCue,
  playSound,
  setSoundEnabled,
  setSoundVolume,
  subscribeSound,
} from './sound'

/**
 * React binding for the global Sunkit sound settings.
 *
 * ```tsx
 * const { enabled, setEnabled, playCue } = useSound()
 * ```
 */
export function useSound() {
  const settings = useSyncExternalStore(subscribeSound, getSoundSettings, getSoundSettings)

  return {
    ...settings,
    setEnabled: setSoundEnabled,
    setVolume: setSoundVolume,
    playCue,
    playSound,
    playColorCue,
  }
}
