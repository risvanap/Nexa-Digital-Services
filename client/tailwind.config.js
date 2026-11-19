/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../chatbot.html",
    "../admin.html"
  ],
  theme: {
    extend: {
      colors: {
        nexa: {
          navy: '#01284b',
          blue: '#0453cd',
          container: '#1e3e62',
          surface: '#f9f9ff',
          whatsapp: '#128c7e'
        }
      }
    },
  },
  plugins: [],
}
