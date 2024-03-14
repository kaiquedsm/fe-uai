/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'purple-uai': '#602DE1',
        'cian-uai': '#90E0EF',
        'blue-uai': '#1160F1',
        'white-uai': '#FFFFFF',
        'darkgray-uai': '#212236',
      },
      gridTemplateRows: {
        'landing': 'auto 1fr'
      }
    },
  },
  plugins: [],
}

