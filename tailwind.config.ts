import type { Config } from 'tailwindcss';

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#07111f",
        surface: "rgba(9, 18, 33, 0.82)",
        surfaceAlt: "rgba(255, 255, 255, 0.06)",
        accent: "#f4a51c",
        accentSoft: "rgba(244, 165, 28, 0.18)",
        text: "#f6f8fb",
        muted: "#aec0d6"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(0, 0, 0, 0.35)"
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
