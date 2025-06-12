/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Make sure this line is present
  ],
  theme: {
    // The `colors` and `fontFamily` are extended from your globals.css @theme rule.
    // Tailwind will automatically read the variables from your :root selector.
    extend: {
      colors: {
        background: 'var(--color-background)',
        text: 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        primary: 'var(--color-primary)',
        'primary-muted': 'var(--color-primary-muted)',
        accent: 'var(--color-accent)',
      },
      fontFamily: {
        // Add your custom font families here
        'body': ['var(--font-body)', ...fontFamily.serif],
        'display': ['var(--font-display)', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};