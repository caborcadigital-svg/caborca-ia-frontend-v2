/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        sand: { DEFAULT: '#F5EDD8', dark: '#EDE0C4', darker: '#D9CBA8' },
        terracotta: { DEFAULT: '#C4622D', light: '#E8823A' },
        sunset: { orange: '#E8823A', coral: '#E05C3A', purple: '#6B3FA0' },
        desert: { blue: '#1E3A5F', mid: '#2D5F8A', sky: '#4A90C4' },
        cactus: '#4A7C59',
        brand: {
          DEFAULT: '#E05C3A',
          50: '#FEF3EE',
          100: '#FDE0D0',
          500: '#E05C3A',
          600: '#C4622D',
          700: '#A3521F',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
