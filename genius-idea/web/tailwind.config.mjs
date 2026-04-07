/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        white: '#ffffff',
        framer: {
          blue: '#0099ff',
        },
        silver: '#a6a6a6',
        nearblack: '#090909',
        frosted: 'rgba(255,255,255,0.1)',
        subtlewhite: 'rgba(255,255,255,0.5)',
        ghostwhite: 'rgba(255,255,255,0.6)',
      },
      borderRadius: {
        pill: '40px',
        pillLg: '100px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['GT Walsheim', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.055em',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
