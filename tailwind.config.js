/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
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
      colors: {
        primary: {
          DEFAULT: "#FF8A3D",
          hover: "#FF7A2D",
          light: "#FFA66B",
          dark: "#E67A2D"
        },
        secondary: {
          DEFAULT: "#FF6B6B",
          hover: "#FF5B5B",
          light: "#FF8B8B",
          dark: "#E65B5B"
        },
        purple: {
          DEFAULT: "#6B46C1",
          hover: "#5B35B0",
          light: "#8B66D1",
          dark: "#4C1D95",
          darker: "#2D1B69"
        },
        background: {
          light: "#FFFFFF",
          dark: "#1A1A1A",
          alt: "#F8F9FA"
        },
        text: {
          primary: "#1A1A1A",
          secondary: "#4A5568",
          muted: "#718096"
        },
        accent: {
          DEFAULT: "#FF8A3D",
          hover: "#FF7A2D",
          light: "#FFA66B"
        },
        success: {
          DEFAULT: "#48BB78",
          light: "#68D391"
        },
        warning: {
          DEFAULT: "#ECC94B",
          light: "#F6E05E"
        },
        error: {
          DEFAULT: "#F56565",
          light: "#FC8181"
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))"
      },
      gradientColorStops: {
        'primary-start': '#FF8A3D',
        'primary-end': '#FF6B6B',
        'purple-start': '#6B46C1',
        'purple-mid': '#4C1D95',
        'purple-end': '#2D1B69'
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(to right, var(--tw-gradient-stops))',
        'purple-gradient': 'linear-gradient(to bottom right, var(--tw-gradient-stops))'
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
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      })
    }
  ],
} 