import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        kai: {
          DEFAULT: "#00ff41", // Matrix/Cyber Green
          dark: "#003b0f",
        },
        nova: {
          DEFAULT: "#ff0055", // Cyber Pink/Red
          dark: "#4a0019",
        },
        void: "#050505",
        panel: "#0a0a0a",
      },
      fontFamily: {
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
