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
        'purple-uai-50': '#b094f4',
        'cian-uai': '#90E0EF',
        'blue-uai': '#1160F1',
        'blue-uai-10': '#e8ecfc',
        'blue-uai-70': '#d0e8f4',
        'blue-uai-ho-35': '#2596be',
        'blue-light-uai': '#F1F6FF',
        'white-uai': '#FFFFFF',
        'darkgray-uai': '#212236',
      },
      height: {
        'carousel': 'calc(100vh - 4rem)',
        '76': '19rem'
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

