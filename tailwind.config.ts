import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        aura: {
          teal: "#58A8B4",      // Soft Teal — accent, AI activity, links
          blue: "#438FB3",      // Slate Blue — primary nav/buttons, trust
          silver: "#B3B7C1",    // Cool Grey — borders, low-contrast text
          dark: "#0F172A",      // Text/contrast
          ink: "#0B1220",       // Deep background for dashboard
          mist: "#F4F7FB",      // Light surface
        },
      },
      fontFamily: {
        sans: ["var(--font-cairo)", "system-ui", "sans-serif"],
        din: ["var(--font-cairo)", "DIN Next LT Arabic", "sans-serif"],
        display: ["var(--font-cairo)", "sans-serif"],
      },
      backgroundImage: {
        "aura-gradient": "linear-gradient(135deg, #58A8B4 0%, #438FB3 100%)",
        "aura-radial":
          "radial-gradient(circle at 30% 20%, rgba(88,168,180,0.25), transparent 60%), radial-gradient(circle at 80% 70%, rgba(67,143,179,0.25), transparent 60%)",
      },
      boxShadow: {
        "aura-glow": "0 10px 40px -10px rgba(67,143,179,0.45)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
