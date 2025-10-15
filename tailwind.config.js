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
        linkedin: {
          blue: '#0077B5',
          dark: '#004182',
          light: '#E7F3FF',
        },
        gray: {
          50: '#F3F2EF',
          100: '#E7E5DD',
          200: '#DAD7CC',
          300: '#CDC9BB',
          400: '#C0BAAA',
          500: '#B3AB99',
          600: '#8F8A7A',
          700: '#6B695B',
          800: '#47483C',
          900: '#23271D',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'wave-pulse': 'wave-pulse 4s ease-in-out infinite',
      },
      keyframes: {
        'wave-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}

