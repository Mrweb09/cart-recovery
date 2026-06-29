import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#020818',
          card: '#060f1e',
          elevated: '#0a1628',
        },
        border: {
          DEFAULT: '#1a2744',
          subtle: '#243656',
        },
        gold: {
          DEFAULT: '#F5C842',
          dim: '#c9a535',
        },
        accent: '#4A90D9',
        text: {
          primary: '#FFFFFF',
          secondary: '#94a3b8',
          muted: '#475569',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'orb-float': 'orbFloat 10s ease-in-out infinite',
        'orb-float-alt': 'orbFloatAlt 13s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        orbFloat: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(40px, -30px) scale(1.05)' },
          '66%': { transform: 'translate(-20px, 15px) scale(0.95)' },
        },
        orbFloatAlt: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(-35px, 25px) scale(1.08)' },
          '66%': { transform: 'translate(25px, -15px) scale(0.92)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
