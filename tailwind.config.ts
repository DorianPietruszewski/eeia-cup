import type { Config } from 'tailwindcss';

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#120611",
        surface: "rgba(26, 10, 36, 0.82)",
        surfaceAlt: "rgba(255, 255, 255, 0.06)",
        accent: "#ffbf2f",
        accentSoft: "rgba(255, 191, 47, 0.18)",
        text: "#fbf7ff",
        muted: "#d7c9e9"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(0, 0, 0, 0.45)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.18) 1px, transparent 0)"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
