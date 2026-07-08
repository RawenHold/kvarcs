import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        body: ["var(--font-body)", "sans-serif"],
        display: ["var(--font-display)", "sans-serif"]
      },
      borderRadius: {
        stone: "8px"
      },
      boxShadow: {
        mineral: "var(--shadow-soft)"
      }
    }
  },
  plugins: []
};

export default config;
