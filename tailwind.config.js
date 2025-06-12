/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#FF9B54',
          DEFAULT: '#FF7629',
          dark: '#E35A00',
        },
        secondary: {
          light: '#F0F9FF',
          DEFAULT: '#38B2AC',
          dark: '#2C7A7B',
        },
        grey: {
          light: '#F7F7F7',
          DEFAULT: '#6B7280',
          dark: '#374151',
        },
        error: {
          light: '#FF7A70',
          DEFAULT: '#FF4B3E',
          dark: '#CC392F',
        },
      },
      boxShadow: {
        custom:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
