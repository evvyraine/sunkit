import { useEffect } from 'react'
import '../src/styles/globals.css'
import type { Preview, Decorator } from '@storybook/react'
import { setSoundEnabled, setSoundVolume } from '../src/sound'

/**
 * Applies the Storybook "Sound" toolbar toggle to the global Sunkit sound
 * settings, so every story can be auditioned with sound on or off.
 */
const withSound: Decorator = (Story, context) => {
  const enabled = context.globals.sound !== 'off'
  const volume = Number(context.globals.volume ?? 0.7)

  useEffect(() => {
    setSoundEnabled(enabled)
  }, [enabled])

  useEffect(() => {
    setSoundVolume(volume)
  }, [volume])

  return <Story />
}

const preview: Preview = {
  globalTypes: {
    sound: {
      description: 'Sunkit interaction sounds',
      toolbar: {
        title: 'Sound',
        icon: 'speaker',
        items: [
          { value: 'on', title: 'On' },
          { value: 'off', title: 'Off' },
        ],
      },
    },
    volume: {
      description: 'Global sound volume',
      toolbar: {
        title: 'Volume',
        icon: 'circlehollow',
        items: [
          { value: '0.3', title: '30%' },
          { value: '0.7', title: '70%' },
          { value: '1', title: '100%' },
        ],
      },
    },
  },
  initialGlobals: {
    sound: 'on',
    volume: '0.7',
  },
  decorators: [withSound],
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f7f6f3' },
        { name: 'white', value: '#ffffff' },
        { name: 'dark', value: '#222222' },
      ],
    },
    layout: 'centered',
  },
}

export default preview
