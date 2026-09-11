import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  // GitHub Pages serves project sites from a sub-path, so the production build
  // needs the repository name as its base. Set `STORYBOOK_BASE_PATH=/sunkit/`
  // when building for Pages; local dev stays at `/`.
  viteFinal: async (viteConfig, { configType }) => {
    if (configType === 'PRODUCTION') {
      viteConfig.base = process.env.STORYBOOK_BASE_PATH ?? '/'
    }
    return viteConfig
  },
}

export default config
