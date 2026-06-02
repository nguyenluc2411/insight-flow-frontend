import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "rgb(var(--border) / <alpha-value>)",
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "#6366f1",
          foreground: "#ffffff",
        },
        "primary-dark": "#4f46e5",
        secondary: "#a855f7",
        "bg-base": "#F8FAFC",
        "bg-dark": "#0f172a",
      },
      fontFamily: {
        sans: ["Be Vietnam Pro", "sans-serif"],
        display: ["Space Grotesk", "Be Vietnam Pro", "sans-serif"],
        mono: ["ui-monospace", "monospace"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0, 0, 0, 0.05)",
        brand: "0 8px 30px rgba(99, 102, 241, 0.25)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
        "hero-gradient": "linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)",
      },
    },
  },
  plugins: [],
}

export default config
