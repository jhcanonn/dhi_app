/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: '#427D8D',
        invalid: '#dc3435',
      },
      transitionProperty: {
        bg: 'background-color',
        shadow: 'box-shadow',
      },
      boxShadow: {
        md: 'var(--focus-ring)',
      },
    },
  },
  plugins: [],
};
