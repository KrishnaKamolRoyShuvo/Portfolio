/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0C1723',
          surface: '#142536',
          card: '#1B3044',
          border: 'rgba(234, 245, 255, 0.08)',
          text: '#EAF5FF',
          muted: '#A1B6C9'
        },
        light: {
          bg: '#F3F8FC',
          surface: '#E7F1F9',
          card: '#FFFFFF',
          border: 'rgba(91, 113, 136, 0.2)',
          text: '#172E45',
          muted: '#5B7188'
        },
        brand: {
          cyan: '#68B9F5',
          indigo: '#9B9EFF',
          violet: '#9B9EFF',
          emerald: '#4AD1C0'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
