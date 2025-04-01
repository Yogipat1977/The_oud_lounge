// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      screens: {
        'ph': '400px',   // Custom breakpoint for phones
        'tab': '1024px', // Custom breakpoint for tablets
        'lap': '1080px', // Custom breakpoint for laptops
        'dp': '2560px',  // Custom breakpoint for desktops
      },

    },
  },
  plugins: [require("tailwindcss-animate")],
}