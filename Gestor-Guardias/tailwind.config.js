/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
      fontFamily: {
        quicksand: ['"Quicksand"', 'sans-serif']
      },
      colors: {
        night: {
          DEFAULT: '#151515',
          100: '#040404',
          200: '#080808',
          300: '#0c0c0c',
          400: '#101010',
          500: '#151515',
          600: '#434343',
          700: '#727272',
          800: '#a1a1a1',
          900: '#d0d0d0'
        },
        redwood: {
          DEFAULT: '#a63d40',
          100: '#220c0d',
          200: '#43191a',
          300: '#652527',
          400: '#863234',
          500: '#a63d40',
          600: '#c25b5f',
          700: '#d28487',
          800: '#e1adaf',
          900: '#f0d6d7'
        },
        earth_yellow: {
          DEFAULT: '#e9b872',
          100: '#3c2709',
          200: '#784e13',
          300: '#b4751c',
          400: '#e09936',
          500: '#e9b872',
          600: '#edc68e',
          700: '#f2d4aa',
          800: '#f6e2c7',
          900: '#fbf1e3'
        },
        asparagus: {
          DEFAULT: '#90a959',
          100: '#1d2212',
          200: '#3a4523',
          300: '#576735',
          400: '#748947',
          500: '#90a959',
          600: '#a7bb7b',
          700: '#bdcc9c',
          800: '#d3ddbd',
          900: '#e9eede'
        },
        air_force_blue: {
          DEFAULT: '#6494aa',
          100: '#131e23',
          200: '#263c46',
          300: '#3a5a69',
          400: '#4d788b',
          500: '#6494aa',
          600: '#83a9bb',
          700: '#a2bfcc',
          800: '#c1d4dd',
          900: '#e0eaee'
        }
      }
    }
  },
  plugins: []
}
