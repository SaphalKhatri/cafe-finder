/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCF7',
          100: '#F7F4EB',
          200: '#EFE9D9',
        },
        coffee: {
          50: '#F8F6F0',
          100: '#EADECA',
          300: '#C4A482',
          600: '#6F4E37',
          700: '#5A3D28',
          800: '#4A3525',
          900: '#2C1D11',
        },
      },
    },
  },
  plugins: [],
}