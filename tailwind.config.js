/** @type {import('tailwindcss').Config} */
export default {
  content: {
    relative: true,
    files: ["./src/**/*.ts"],
  },
  theme: {
    extend: {
      colors: {
        "brand-blue": "#004494",
        "brand-pink": "#ba3286",
      },
    },
  },

  plugins: [],
};
