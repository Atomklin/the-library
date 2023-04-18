/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,svelte}"
  ],
  theme: {
    extend: {
      borderWidth: {
        1: "1px"
      }
    },
  },
  plugins: [],
}

