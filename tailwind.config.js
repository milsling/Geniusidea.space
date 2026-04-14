/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Apple system colors
        'apple-blue':    '#007AFF',
        'apple-green':   '#34C759',
        'apple-red':     '#FF3B30',
        'apple-orange':  '#FF9500',
        'apple-purple':  '#AF52DE',
        'apple-indigo':  '#5856D6',
        'apple-teal':    '#30B0C7',
        'apple-gray-1':  '#8E8E93',
        'apple-gray-6':  '#F2F2F7',
        // Legacy aliases kept for backwards compat
        primary: { DEFAULT: '#007AFF', light: '#3395FF' },
        accent:  { DEFAULT: '#007AFF', light: '#3395FF' },
        background: '#F2F2F7',
        surface: '#FFFFFF',
        muted: '#8E8E93',
        border: 'rgba(60,60,67,0.12)',
        'text-primary': '#000000',
        'text-secondary': 'rgba(60,60,67,0.6)',
      },
      borderRadius: {
        'sm':  '8px',
        'md':  '12px',
        'lg':  '16px',
        'xl':  '20px',
        '2xl': '28px',
      },
      boxShadow: {
        'soft':   '0 2px 8px rgba(0,0,0,0.06)',
        'medium': '0 8px 24px rgba(0,0,0,0.10)',
        'blue':   '0 4px 14px rgba(0,122,255,0.35)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'SF Pro Text',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      letterSpacing: {
        tight: '-0.022em',
      },
    },
  },
  plugins: [],
};
