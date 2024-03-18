/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      backgroundImage: theme => ({
        'main-image': 'radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(17,96,241,1) 80%, rgba(17,96,241,1) 100%)'
      }),
      colors: {
        'purple-uai': '#602DE1',
        'cian-uai': '#90E0EF',
        'blue-uai': '#1160F1',
        'white-uai': '#FFFFFF',
        'darkgray-uai': '#212236',
      },
      height: {
        carousel: 'calc(100vh - 4rem)'
      },
      gridTemplateRows: {
        'landing': 'auto 1fr'
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

