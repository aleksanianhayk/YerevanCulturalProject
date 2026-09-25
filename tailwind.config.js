/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        arm: {
          red: '#D90012',
          blue: '#0033A0',
          orange: '#F2A800',
          stone: '#1E1B18',
          tuff: '#C86D51'
        }
      }
    },
  },
  plugins: [],
}