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
          teal: "#58A8B4",
          blue: "#438FB3",
          grey: "#B3B7C1",
          dark: "#0F172A",
          bg: "#F8FAFC",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
      backgroundImage: {
        'soft-blobs': "radial-gradient(circle at 50% 50%, rgba(88, 168, 180, 0.15) 0%, rgba(248, 250, 252, 0) 50%)",
      }
    },
  },
  plugins: [],
};
export default config;
