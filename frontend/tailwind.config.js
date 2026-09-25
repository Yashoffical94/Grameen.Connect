/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0A09',
        surface: '#15110D',
        surface2: '#1E1811',
        border: '#332619',
        primary: '#F97316',
        'primary-dark': '#C2410C',
        accent: '#FBBF24',
        blue: '#38BDF8',
        danger: '#EF4444',
        text: '#FDF7F0',
        'text-muted': '#B8A896',
      },
      fontFamily: {
        heading: ['Sora', 'sans-serif'],
        body: ['Noto Sans', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(249, 115, 22, 0.45)',
        'glow-sm': '0 0 20px -6px rgba(249, 115, 22, 0.4)',
        crystal: '0 8px 32px -8px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px) scale(1)' },
          '50%': { transform: 'translateY(-40px) translateX(20px) scale(1.05)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px) scale(1)' },
          '50%': { transform: 'translateY(30px) translateX(-25px) scale(1.08)' },
        },
        shimmerMove: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      animation: {
        float: 'float 14s ease-in-out infinite',
        'float-slow': 'floatSlow 20s ease-in-out infinite',
        'gradient-x': 'shimmerMove 8s ease infinite',
      },
    },
  },
  plugins: [],
};
