/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      backgroundImage: theme => ({
        'main-image': 'radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(17,96,241,1) 80%, rgba(17,96,241,1) 100%)',
        'border-carousel': 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(96,45,225,1) 100%);'
      }),
      colors: {
        'purple-uai': '#602DE1',
        'cian-uai': '#90E0EF',
        'blue-uai': '#1160F1',
        'white-uai': '#FFFFFF',
        'darkgray-uai': '#212236',
      },
      height: {
        'carousel': 'calc(100vh - 4rem)',
        '76': '19rem'
      },
      gridTemplateRows: {
        'landing': 'auto 1fr'
      },
      screens: {
        'screen-car-1': '521px'
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

