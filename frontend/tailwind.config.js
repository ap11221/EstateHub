/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f9f6",
          100: "#dbf0e8",
          200: "#b8e0d3",
          300: "#8bcab8",
          400: "#5aab97",
          500: "#38907c",
          600: "#297564",
          700: "#215e52",
          800: "#1c4b43",
          900: "#193f39",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
