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
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
