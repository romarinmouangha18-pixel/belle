import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rosepastel: {
          50: "#fdf5f6",
          100: "#fbe9ec",
          200: "#f6cfd6",
          300: "#eeb1bd",
          400: "#e38a9c",
          500: "#d36983",
          600: "#b94e6a",
          700: "#933e54",
          800: "#6e2f3f",
          900: "#4a1f2a",
        },
        beige: {
          50: "#fbf8f4",
          100: "#f4ede1",
          200: "#e8dcc4",
          300: "#d8c39e",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        serif: ["'Playfair Display'", "ui-serif", "Georgia"],
      },
    },
  },
  plugins: [],
};

export default config;
