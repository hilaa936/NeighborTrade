/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Leafy green brand with warm earth accents
        leaf: {
          50: "#f1f8f1",
          100: "#dcefdc",
          200: "#b9debb",
          300: "#8cc590",
          400: "#5ea763",
          500: "#3d8a44",
          600: "#2e6f35",
          700: "#26582c",
          800: "#214726",
          900: "#1c3b21",
        },
        earth: {
          50: "#fbf7f1",
          100: "#f5ecdf",
          200: "#eadac0",
          300: "#dcc097",
          400: "#c99f6a",
          500: "#b9834a",
          600: "#a26b3d",
          700: "#865434",
          800: "#6e4630",
          900: "#5b3b2a",
        },
        sand: "#faf8f3",
      },
      fontFamily: {
        sans: ["var(--font-heebo)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
