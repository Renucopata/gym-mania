/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Brand/display font. Orbitron (free) stands in for the commercial
        // Ethnocentric; rendered bold + slanted via index.css to mimic
        // "Ethnocentric Bold Italic". Class name kept as `font-jaro`.
        jaro: ["Orbitron", "sans-serif"],
      },
      colors: {
        gymmania: {
          orange: "#F26A21",
          "orange-dark": "#D2570F",
          black: "#0D0D0D",
          panel: "#FDF1E9",
        },
      },
    },
  },
  plugins: [],
}
