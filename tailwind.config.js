/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{ejs,pug,html}", "./public/**/*.{js,html}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
