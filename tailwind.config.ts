import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff8f0',
          100: '#ffeedb',
          200: '#ffd7b5',
          300: '#ffb985',
          400: '#ff904f',
          500: '#ff6b26', // Main Primary Warm Orange
          600: '#f04e0e',
          700: '#c73809',
          800: '#9e2d0f',
          900: '#7f2810',
          950: '#451105',
        },
        foodAccent: {
          green: '#10B981', // Fresh veggies / dietary tags
          yellow: '#F59E0B', // Ratings / Deals
          red: '#EF4444', // Hot & Spicy / Discounts
          darkBg: '#0b0f19', // Deep dark glass backdrop
          darkCard: '#131b2e',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
