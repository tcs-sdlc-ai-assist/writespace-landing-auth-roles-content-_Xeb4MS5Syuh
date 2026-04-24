/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        badge: {
          admin: '#dc2626',
          editor: '#2563eb',
          author: '#16a34a',
        },
      },
    },
  },
  plugins: [],
}