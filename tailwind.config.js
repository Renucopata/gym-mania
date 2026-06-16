/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        jaro: ["Jaro", "sans-serif"],
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
