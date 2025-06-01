/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ffaa00',
          light: '#ffbb33',
          dark: '#cc8800',
        },
        secondary: {
          DEFAULT: '#f4a7b9',
          light: '#f8c4d1',
          dark: '#d37d90',
        },
        warning: {
          DEFAULT: '#d3381c',
          light: '#e25c4f',
          dark: '#a82c16',
        },
        info: {
          DEFAULT: '#58a6dc',
          light: '#7fbce6',
          dark: '#357bb3',
        },
        success: {
          DEFAULT: '#91c788',
          light: '#afd4aa',
          dark: '#6f9f66',
        },
        background: {
          DEFAULT: '#f9f5ef',
          paper: '#ffffff',
        },
        text: {
          primary: '#333333',
          secondary: '#666666',
        },
      },
    },
  },
  plugins: [],
};
