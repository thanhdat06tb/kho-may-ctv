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
        background: "#07111f",
        surface: "#0d1b2e",
        panel: "#12233a",
        border: "#21344d",
        muted: "#94a3b8",
        mint: "#24d6a2",
        danger: "#fb7185",
        warning: "#fbbf24"
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
