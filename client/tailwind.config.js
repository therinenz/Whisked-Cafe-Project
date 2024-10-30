/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#8B4513',
        whiteBg: '#F5F5F5',
        secondary: '#C47B47',
        black: '#2E2E2E',
        hover: '#A95A3C',
        grayme: '#757474'
      },
      fontFamily:{
        sans: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

