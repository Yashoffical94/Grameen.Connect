/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0F14',
        surface: '#111820',
        surface2: '#161E28',
        border: '#1E2D3D',
        primary: '#22C55E',
        'primary-dark': '#166534',
        accent: '#F59E0B',
        blue: '#3B82F6',
        danger: '#EF4444',
        text: '#F0F6FF',
        'text-muted': '#94A3B8',
      },
      fontFamily: {
        heading: ['Sora', 'sans-serif'],
        body: ['Noto Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
