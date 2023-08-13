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
      gridTemplateColumns: {
        'custom-17-1': '17% repeat(1, 1fr)',
        'custom-10-7': '10% repeat(7, 1fr)',
      },
    },
  },
  plugins: [],
}
