import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A0A0A',
        paper: '#F2F0EC',
        mink: '#C4A882',
        taupe: '#9E8B75',
        ghost: '#5A5652',
        line: '#1E1E1E',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Impact', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
    },
  },
}

export default config
