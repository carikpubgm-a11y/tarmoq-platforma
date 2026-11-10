/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 50: '#F3F6FB', 100: '#E4EAF5', 200: '#C5D1E8', 300: '#9AAED3', 400: '#6682B5', 500: '#41609A', 600: '#2B477C', 700: '#1D335F', 800: '#132446', 900: '#0C1A35', 950: '#071023' },
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['"Plus Jakarta Sans Variable"', '"Inter Variable"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(12,26,53,.05), 0 10px 28px -14px rgba(12,26,53,.22)',
        lift: '0 2px 4px rgba(12,26,53,.06), 0 18px 40px -16px rgba(12,26,53,.32)',
      },
    },
  },
  plugins: [],
}
