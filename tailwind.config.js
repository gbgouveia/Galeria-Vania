/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
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
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'Montserrat'", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        gallery: {
          bg: "var(--gallery-bg)",
          surface: "var(--gallery-surface)",
          "surface-secondary": "var(--gallery-surface-secondary)",
          foreground: "var(--gallery-foreground)",
          primary: "var(--gallery-primary)",
          "primary-soft": "var(--gallery-primary-soft)",
          accent: "var(--gallery-accent)",
          "accent-soft": "var(--gallery-accent-soft)",
          border: "var(--gallery-border)",
          muted: "var(--gallery-muted)",
        },
        lightbox: {
          bg: "var(--lightbox-bg)",
          surface: "var(--lightbox-surface)",
          border: "var(--lightbox-border)",
          text: "var(--lightbox-text)",
          muted: "var(--lightbox-muted)",
        },
        border: "var(--gallery-border)",
        background: "var(--gallery-bg)",
        foreground: "var(--gallery-foreground)",
      },
      letterSpacing: {
        widest: ".18em",
        editorial: ".08em",
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [],
};
