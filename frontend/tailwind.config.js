/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#BBB4DA',
        'primary-dark': '#9d96b8',
        'secondary': '#ffffff',
        'secondary-dark': '#f5f5f5',
        'neutral-light': '#f8f9fa',
        'neutral-dark': '#333333',
      },
      fontFamily: {
        'sans': ['Roboto', 'Arial', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
}