/** @type {import('tailwindcss').Config} */
import scrollbarHide from 'tailwind-scrollbar-hide';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E50914', // Netflix Red
        background: '#141414', // Netflix Black
        surface: '#1F1F1F', // Dark Grey for Cards
      }
    },
  },
  plugins: [
    scrollbarHide
  ],
}