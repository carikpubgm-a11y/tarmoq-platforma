/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* Simulyator paneli uchun chuqur siyoh-binafsha (avvalgi yassi navy emas) */
        navy: { 50: '#F5F6FF', 100: '#E8EAFD', 200: '#CBD0F8', 300: '#A3ABF0', 400: '#7681E3', 500: '#5560D1', 600: '#4049B4', 700: '#333A8F', 800: '#262B6B', 900: '#1C2050', 950: '#121437' },
        /* Asosiy brend rangi — quvnoq binafsha */
        brand: { 50: '#F5F3FF', 100: '#EDE9FE', 200: '#DDD6FE', 300: '#C4B5FD', 400: '#A78BFA', 500: '#8B5CF6', 600: '#7C3AED', 700: '#6D28D9', 800: '#5B21B6', 900: '#4C1D95' },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans Variable"', '"Inter Variable"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['"Plus Jakarta Sans Variable"', '"Inter Variable"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: { '4xl': '2rem' },
      boxShadow: {
        card: '0 2px 4px rgba(28,32,80,.05), 0 12px 28px -14px rgba(28,32,80,.22)',
        lift: '0 4px 8px rgba(28,32,80,.07), 0 24px 44px -18px rgba(28,32,80,.34)',
        pop: '0 8px 0 0 rgba(0,0,0,.08)',
      },
      keyframes: {
        'fade-up': { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'none' } },
        pop: { '0%': { transform: 'scale(.82)', opacity: 0 }, '70%': { transform: 'scale(1.04)' }, '100%': { transform: 'scale(1)', opacity: 1 } },
        wiggle: { '0%,100%': { transform: 'translateX(0)' }, '20%': { transform: 'translateX(-7px)' }, '40%': { transform: 'translateX(7px)' }, '60%': { transform: 'translateX(-4px)' }, '80%': { transform: 'translateX(4px)' } },
        'bounce-in': { '0%': { transform: 'scale(.3)', opacity: 0 }, '55%': { transform: 'scale(1.18)' }, '75%': { transform: 'scale(.94)' }, '100%': { transform: 'scale(1)', opacity: 1 } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-7px)' } },
        shine: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        'dash-move': { to: { strokeDashoffset: -24 } },
        'pulse-soft': { '0%,100%': { opacity: 1 }, '50%': { opacity: .4 } },
      },
      animation: {
        'fade-up': 'fade-up .45s cubic-bezier(.22,.7,.3,1) both',
        pop: 'pop .34s cubic-bezier(.34,1.56,.64,1) both',
        wiggle: 'wiggle .45s ease-in-out',
        'bounce-in': 'bounce-in .5s cubic-bezier(.34,1.56,.64,1) both',
        float: 'float 3.5s ease-in-out infinite',
        shine: 'shine 2.4s linear infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
