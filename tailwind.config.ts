import type { Config } from "tailwindcss";

const config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef6fd",
          100: "#d9eafb",
          200: "#b8d8f5",
          300: "#8fc1ef",
          400: "#64a6e6",
          500: "#3f8cd7",
          600: "#2f71b7",
          700: "#0059a9",
          800: "#003d7a",
          900: "#002f5f",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
