/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // 👈 Very important!
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}