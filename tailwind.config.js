// tailwind.config.js
module.exports = {
  darkMode: 'class', // Mengaktifkan dark mode berbasis class
  content: ["./*.{html,js}"], // Memberitahu Tailwind file mana yang perlu di-scan
  theme: {
    extend: {
      colors: {
        // Mendefinisikan warna kustom Anda
        'navy': '#21325e',
        'light-blue': '#3e497a',
        'yellow-custom': '#f1d00a',
      },
      fontFamily: {
        // Mendefinisikan font kustom Anda
        'sans': ['Poppins', 'sans-serif'],
        'heading': ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}