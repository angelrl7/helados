/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        crema: '#FFF6EC',
        vainilla: '#FFEFDD',
        frutilla: '#FF8FA9',
        frutillaOscuro: '#E8567A',
        pistacho: '#A9D9BE',
        pistachoOscuro: '#5FA97F',
        menta: '#CDEDE0',
        chocolate: '#5A3D34',
        cacao: '#8A6A5E',
        dulceLeche: '#F0B27A',
      },
      fontWeight: {
        400: '400',
        500: '500',
        600: '600',
        700: '700',
        800: '800',
      },
      fontFamily: {
        display: ['"Baloo 2"', 'system-ui', 'sans-serif'],
        sans: ['Quicksand', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 24px -8px rgba(90, 61, 52, 0.18)',
        soft: '0 4px 14px -6px rgba(90, 61, 52, 0.22)',
      },
      borderRadius: {
        '2.5xl': '1.375rem',
      },
    },
  },
  plugins: [],
}
