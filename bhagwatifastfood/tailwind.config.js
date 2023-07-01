/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {},
    screens: {
      'mobile': '500px',
      'tablet1': '730px',
      'tablet': '980px',
      'laptop': '1200px',
      'desktop1': '1700px',
      'desktop2': '1950px',
      'desktop3': '2200px'
    },
  },
  plugins: [],
}

