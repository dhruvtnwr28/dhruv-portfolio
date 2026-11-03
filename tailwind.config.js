/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        tesseract: {
          void: '#030712',
          deep: '#060f26',
          surface: '#0a1638',
          card: 'rgba(6, 15, 38, 0.75)',
          border: 'rgba(56, 189, 248, 0.2)',
          cyan: '#00f0ff',
          electric: '#38bdf8',
          ice: '#e0f2fe',
          sapphire: '#1d4ed8',
          textMuted: '#94a3b8',
        }
      },
      fontFamily: {
        megante: ['Megante', 'Syne', 'serif'],
        syne: ['Syne', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.03)' },
        }
      }
    },
  },
  plugins: [],
}
