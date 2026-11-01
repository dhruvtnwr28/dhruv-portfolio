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
        aesthetic: {
          bg: '#09080d',
          surface: '#13111b',
          card: 'rgba(19, 17, 27, 0.7)',
          border: 'rgba(243, 210, 162, 0.12)',
          champagne: '#f3d2a2',
          gold: '#e8a87c',
          lavender: '#d8a7ff',
          rose: '#f2b8c6',
          textMuted: '#a39ea8',
        }
      },
      fontFamily: {
        megante: ['Megante', 'Syne', 'serif'],
        syne: ['Syne', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
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
