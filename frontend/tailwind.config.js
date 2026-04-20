/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        premium: {
          light: '#fdfbf7', // ivory/cream background
          dark: '#2c2a29', // warm charcoal text
          accent: '#d4af37', // soft gold
          beige: '#f5f0e6', // beige card backgrounds
          brown: '#8b5a2b', // warm brown
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}
