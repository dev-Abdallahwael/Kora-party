/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./src/**/*.{ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#E8F5E9",
          100: "#C8E6C9",
          200: "#A5D6A7",
          300: "#81C784",
          400: "#66BB6A",
          500: "#1B5E20",
          600: "#164D1A",
          700: "#114114",
          800: "#0C300E",
          900: "#071F08",
          DEFAULT: "#1B5E20",
        },
        accent: {
          DEFAULT: "#FFC107",
          light: "#FFD54F",
          dark: "#FFA000",
        },
        danger: {
          DEFAULT: "#E53935",
          light: "#EF5350",
          dark: "#C62828",
        },
        success: {
          DEFAULT: "#4CAF50",
          light: "#81C784",
        },
        surface: {
          DEFAULT: "#1A1A2E",
          light: "#232340",
          lighter: "#2A2A4A",
          card: "#252545",
        },
        background: {
          DEFAULT: "#0F0F1A",
          light: "#161625",
        },
      },
      fontFamily: {
        bold: ["InterBold"],
        semi: ["InterSemi"],
        regular: ["Inter"],
      },
    },
  },
  plugins: [],
};
