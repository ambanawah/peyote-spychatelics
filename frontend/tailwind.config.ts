import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest: { DEFAULT: '#1A2E1A', light: '#2D4A2D' },
        gold: { DEFAULT: '#C9A84C', light: '#E8D08A' },
        cream: '#F7F2E8',
        sage: '#7A9E7E',
        bark: '#5C4A2A',
        mist: '#EEF3EE',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
