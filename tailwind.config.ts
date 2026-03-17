import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(30 12% 86%)",
        input: "hsl(30 14% 96%)",
        ring: "hsl(25 90% 45%)",
        background: "hsl(34 33% 98%)",
        foreground: "hsl(215 28% 17%)",
        primary: {
          DEFAULT: "hsl(18 82% 50%)",
          foreground: "hsl(0 0% 100%)"
        },
        secondary: {
          DEFAULT: "hsl(40 60% 94%)",
          foreground: "hsl(215 28% 17%)"
        },
        muted: {
          DEFAULT: "hsl(35 24% 93%)",
          foreground: "hsl(215 12% 40%)"
        },
        accent: {
          DEFAULT: "hsl(191 80% 35%)",
          foreground: "hsl(0 0% 100%)"
        },
        destructive: {
          DEFAULT: "hsl(0 72% 51%)",
          foreground: "hsl(0 0% 100%)"
        },
        card: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(215 28% 17%)"
        }
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(15, 23, 42, 0.08)"
      },
      fontFamily: {
        sans: ["IBM Plex Sans", "Avenir Next", "Segoe UI", "sans-serif"]
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(circle at top left, rgba(255,145,77,0.16), transparent 32%), radial-gradient(circle at bottom right, rgba(7,89,133,0.18), transparent 28%)"
      }
    }
  },
  plugins: []
};

export default config;
