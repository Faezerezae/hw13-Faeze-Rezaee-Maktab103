/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lightCyan: "#E4F2FE",
        lightPink: "#FFEEFE",
      },
    },
  },
  plugins: [],
}