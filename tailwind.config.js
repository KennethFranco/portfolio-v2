/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FCFDEB",
        gold: "#DFC08F",
        red1: "#CB0034",
        red2: "#A70022",
        red3: "#7D0719",
      },
    },
    fontFamily: {
      abc: ["Poppins", "sans-serif"],
      xyz: ["Roboto Mono", "sans-serif"],
    },
  },
  plugins: [],
};
