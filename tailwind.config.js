/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      "primary": "#450B59",
      "black": "#000",
      "white": "#fff",
      "grey": "#ccc"
    },
    extend: {
      transitionProperty: {
        height: 'height',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

