/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      colors: {
        brown: { DEFAULT: '#4F1903', dark: '#261309', deep: '#1F0A02' },
        burnt: { DEFAULT: '#BE4D00' },
        amber: { DEFAULT: '#D97706' },
        gold: { DEFAULT: '#F59E0B', soft: '#FBBF24' },
        cream: { DEFAULT: '#FFF8ED', light: '#FFFBF5' },
        border: { soft: '#EAD8C4' },
        ink: { DEFAULT: '#261309', muted: '#7C675B' },
        success: '#15803D',
        warning: '#D97706',
        danger: '#B91C1C',
        info: '#0369A1',
      },
      boxShadow: {
        soft: '0 2px 10px rgba(38, 19, 9, 0.06)',
        card: '0 4px 20px rgba(38, 19, 9, 0.08)',
        lifted: '0 12px 32px rgba(38, 19, 9, 0.14)',
        window: '0 24px 60px rgba(31, 10, 2, 0.28)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #BE4D00 0%, #D97706 100%)',
        'welcome-gradient': 'linear-gradient(135deg, #1F0A02 0%, #4F1903 55%, #8A3405 100%)',
        'highlight-gradient': 'linear-gradient(135deg, #FFF8ED 0%, #FDE8C7 100%)',
      },
    },
  },
  plugins: [],
};
