/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f2',
          100: '#ffe1e1',
          200: '#ffc8c8',
          300: '#ffa3a3',
          400: '#ff6b6b',
          500: '#ff3b3b',
          600: '#ed1c1c',
          700: '#c81010',
          800: '#a61111',
          900: '#891515',
          950: '#4b0505',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
        display: ['"Noto Sans SC"', '"PingFang SC"', 'sans-serif'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            h2: {
              fontWeight: '700',
              marginTop: '2em',
              marginBottom: '0.75em',
            },
            h3: {
              fontWeight: '600',
              marginTop: '1.5em',
              marginBottom: '0.5em',
            },
            a: {
              color: theme('colors.primary.600'),
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
