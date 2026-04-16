import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design System Colors from Space Edition
        "background": "#131313",
        "foreground": "#e2e2e2",
        "primary": "#ffffff",
        "primary-foreground": "#1a1c1c",
        "secondary": "#c6c6cf",
        "secondary-foreground": "#1a1b22",
        "tertiary": "#e2e2e2",
        "tertiary-foreground": "#1a1c1c",
        "outline": "#919191",
        "outline-variant": "#474747",
        "border": "#474747", // For compatibility with border-border
        "input": "#1b1b1b",
        "ring": "#ffffff",
        
        // Extended Palette from HTML
        "on-error-container": "#ffdad6",
        "surface-container-low": "#1b1b1b",
        "on-secondary-container": "#e2e1eb",
        "on-error": "#690005",
        "surface-container-lowest": "#0e0e0e",
        "primary-fixed": "#5d5f5f",
        "tertiary-fixed-dim": "#454747",
        "surface-variant": "#353535",
        "primary-fixed-dim": "#454747",
        "on-primary-container": "#000000",
        "on-secondary": "#1a1b22",
        "on-secondary-fixed-variant": "#3a3b42",
        "on-surface": "#e2e2e2",
        "inverse-primary": "#5d5f5f",
        "surface-container-high": "#2a2a2a",
        "tertiary-fixed": "#5d5f5f",
        "on-tertiary-container": "#000000",
        "secondary-fixed": "#c6c6cf",
        "primary-container": "#d4d4d4",
        "inverse-surface": "#e2e2e2",
        "secondary-fixed-dim": "#aaaab3",
        "surface-tint": "#c6c6c7",
        "on-primary": "#1a1c1c",
        "inverse-on-surface": "#303030",
        "on-tertiary": "#1a1c1c",
        "on-primary-fixed": "#ffffff",
        "surface-container": "#1f1f1f",
        "error-container": "#93000a",
        "on-primary-fixed-variant": "#e2e2e2",
        "on-secondary-fixed": "#1a1b22",
        "secondary-container": "#45464e",
        "surface-container-highest": "#353535",
        "surface-dim": "#131313",
        "on-background": "#e2e2e2",
        "error": "#ffb4ab",
        "surface-bright": "#393939",
        "tertiary-container": "#909191",
        "surface": "#131313",
        "on-tertiary-fixed": "#ffffff",
        "on-tertiary-fixed-variant": "#e2e2e2",
        "on-surface-variant": "#c6c6c6",
        
        // Original HSL hooks for any residual usage
        "card": {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "popover": {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        "muted": {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        "accent": {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        "destructive": {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
      },
      borderRadius: {
        "DEFAULT": "0px",
        "lg": "0px",
        "xl": "0px",
        "full": "9999px"
      },
      fontFamily: {
        "headline": ["var(--font-space-grotesk)", "sans-serif"],
        "body": ["var(--font-inter)", "sans-serif"],
        "label": ["var(--font-inter)", "sans-serif"]
      }
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/forms"), require("@tailwindcss/container-queries")],
} satisfies Config;
