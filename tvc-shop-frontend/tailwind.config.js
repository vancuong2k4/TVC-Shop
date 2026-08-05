/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['Outfit', 'sans-serif'], // Overriding serif to use Outfit for headings to fix the legacy class usage
      }
    },
  },
  plugins: [],
}
