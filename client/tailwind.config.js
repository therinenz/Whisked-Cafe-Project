/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#8B4513',
        whiteBg: '#FAFAFA',
        black: '#2E2E2E',
        hover: '#A95A3C',
        lightGray: '#E0E0E0',
        mediumGray: '#A9A9A9',
        darkGray: '#757575'

      },
      fontFamily:{
        sans: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

