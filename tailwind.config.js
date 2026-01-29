/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#1a1a1a',
      },
      fontFamily: {
        archivo: ['Archivo_400Regular'],
        'archivo-semibold': ['Archivo_600SemiBold'],
        'archivo-bold': ['Archivo_700Bold'],
        mono: ['JetBrainsMono_400Regular'],
        'mono-medium': ['JetBrainsMono_500Medium'],
        'mono-semibold': ['JetBrainsMono_600SemiBold'],
      },
    },
  },
  plugins: [],
};
