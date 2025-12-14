/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
       backgroundImage: {
        'gold-radial': 'radial-gradient(circle at 60% 40%, #FDAF01 0%, #996901 40%, #BA8100 70%, #D79501 100%)',
        'gold-radial-text': 'radial-gradient(circle at 60% 30%, #FDAF01 0%, #996901 30%, #BA8100 100%, #D79501 30%)',
      },
    },
  },
  plugins: [],
}

