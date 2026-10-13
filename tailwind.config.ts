import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#070d18",
        surface: "#0d1726",
        panel: "#142238",
        border: "#263750",
        muted: "#9fb0c7",
        mint: "#2dd4bf",
        danger: "#fb7185",
        warning: "#f59e0b"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "Arial", "sans-serif"]
      },
      boxShadow: {
        soft: "0 20px 70px rgba(0, 0, 0, 0.22)"
      }
    }
  },
  plugins: []
};

export default config;
