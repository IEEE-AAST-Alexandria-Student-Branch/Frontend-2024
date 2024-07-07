/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'sansramy': ['SF-Pro-Display-Regular', 'Arial', 'sans-serif'],
      'seriframy': ['SF-Pro-Display-Bold', 'Georgia', 'serif'],
      'SFproramy': ['SF-Pro', 'Georgia', 'serif'],
      // Add other font families as needed
    },
    extend: {
      backgroundImage: {
        homeImage: "url('/src/assets/home/ieeeHome.jpg')",
      },
      fontFamily: {
        display: ["SF Pro Display", "sans-serif"],
        body: ["SF Pro", "sans-serif"],
        bold: ["SF-Pro-Display-Bold", "sans-serif"],
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
        '.scrollbar-hide::-webkit-scrollbar': {
          'display': 'none',
        },
      }, ['responsive', 'hover']);
    },
  ],
}
