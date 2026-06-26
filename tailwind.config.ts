import { nextui } from '@nextui-org/react'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        rs: {
          gold: '#f9cf1d',
          'gold-dark': '#d4ad0f',
          ink: '#0a0a0a',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: '#f9cf1d',
              foreground: '#0a0a0a',
            },
            secondary: {
              DEFAULT: '#efefeb',
              foreground: '#0a0a0a',
            },
            background: '#f7f7f5',
            foreground: '#0a0a0a',
            focus: '#f9cf1d',
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: '#f9cf1d',
              foreground: '#0a0a0a',
            },
            secondary: {
              DEFAULT: '#242424',
              foreground: '#fafafa',
            },
            background: '#0a0a0a',
            foreground: '#fafafa',
            focus: '#f9cf1d',
          },
        },
      },
    }),
  ],
}
export default config
