/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'my-primary': 'rgba(61 182 211,2)',
      },
    },
  },
  plugins: [],
};
