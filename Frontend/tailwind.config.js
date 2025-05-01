// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{ts,tsx,js,jsx}",
    "./src/**/*.{ts,tsx,js,jsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens: {
        'ph': '400px',   // Custom breakpoint for phones
        'tab': '1024px', // Custom breakpoint for tablets
        'lap': '1080px', // Custom breakpoint for laptops
        'dp': '2560px',  // Custom breakpoint for desktops
      },

      // MOVE YOUR CUSTOM COLORS INSIDE THIS 'colors' OBJECT
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // --- Your Custom Colors START ---
        gold: {
          50: '#FFF9E5',
          100: '#FFF0BF',
          200: '#FFE380', // This should now work for text-gold-200
          300: '#FFD740',
          400: '#FFC700', // This should now work for text-gold-400 etc.
          500: '#D4AF37', // Main gold color
          600: '#B8860B',
          700: '#996515',
          800: '#7B5800',
          900: '#5C4200',
        },
        gray: {
          // Note: Be mindful if you also use Tailwind's default grays.
          // These will extend/override the default gray palette.
          850: '#DADDD8', // Should now work for bg-gray-850 etc.
          950: '#0c0c0e', // Should now work for bg-gray-950 etc.
        },
        amber: {
          500: '#FFD580',
          600: '#FFBF00',
          700: '#FF8C00',
          800: '#996515',
          900: '#996515',
        }
        // --- Your Custom Colors END ---
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },

      // REMOVE the gold and gray definitions from here
      // gold: { ... }, // NO LONGER NEEDED HERE
      // gray: { ... }  // NO LONGER NEEDED HERE
    },
  },
  plugins: [require("tailwindcss-animate")],
}