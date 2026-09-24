import type { Config } from 'tailwindcss';

import plugin from 'tailwindcss/plugin';

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        inmo: {
          accent: '#FA003F',
          primary: '#FFFFFF',
          secondary: '#333333',
          tertiary: '#E6E6E6',
          darkbg: '#1f1f1f',
          darkcard: '#333333',
          darktertiary: '#474747',
          success: '#10B981',
          warning: '#F59E0B',
          info: '#3B82F6',
          danger: '#EF4444'
        }
      },
      boxShadow: {
        soft: '0 10px 40px -10px rgba(0,0,0,0.15)',
        glow: '0 10px 40px -10px rgba(250, 0, 63, 0.4)',
      }
    }
  },
  plugins: [
    plugin(function({ addComponents }) {
      addComponents({
        /* Tipografía Semántica Global */
        '.text-hero': {
          '@apply font-inter font-black text-3xl text-inmo-secondary dark:text-white': {},
        },
        '.text-title': {
          '@apply font-inter font-bold text-3xl text-inmo-secondary dark:text-white': {},
        },
        '.text-subtitle': {
          '@apply font-montserrat font-bold text-xl text-inmo-secondary dark:text-white': {},
        },
        '.text-body': {
          '@apply font-inter font-normal text-sm text-gray-500 dark:text-gray-400': {},
        },
        '.text-input': {
          '@apply font-inter font-normal text-base text-inmo-secondary dark:text-white placeholder-gray-500 dark:placeholder-gray-400': {},
        },
        '.text-price': {
          '@apply font-inter font-black text-2xl text-inmo-secondary dark:text-white/90': {},
          'letter-spacing': '0.05em',
        },
        '.text-section-label': {
          '@apply font-inter font-bold text-lg text-inmo-secondary/30 dark:text-white/10': {},
          'text-indent': '1.25rem',
        },
        '.text-caption': {
          '@apply font-inter font-normal text-xs text-gray-500 dark:text-gray-400': {},
        },
        '.text-nav': {
          '@apply font-inter font-medium text-sm text-inmo-secondary dark:text-white': {},
        },
        '.text-button': {
          '@apply font-inter font-bold text-sm': {},
        },
        '.text-banner-title': {
          '@apply font-montserrat font-bold text-2xl text-white': {},
        },
        '.text-banner-body': {
          '@apply font-inter font-normal text-xs text-white/95': {},
        },
        '.text-subtitle-sm': {
          '@apply font-montserrat font-bold text-sm text-inmo-secondary dark:text-white': {},
        },
        /* Bordes y Geometría Semántica */
        '.rounded-atom': {
          '@apply rounded-full': {},
        },
        '.rounded-card': {
          '@apply rounded-3xl': {},
        }
      })
    })
  ],
} satisfies Config;