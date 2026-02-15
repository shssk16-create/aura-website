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
          teal: "#58A8B4",      // الطاقة، الإشراق
          blue: "#438FB3",      // العمق، التكنولوجيا
          silver: "#B3B7C1",    // الفخامة (ثانوي)
          dark: "#0F172A",      // للنصوص والتباين
        },
      },
      fontFamily: {
        din: ["DIN Next LT Arabic", "sans-serif"], // تأكد من استيراد الخط
      },
      backgroundImage: {
        'aura-gradient': 'linear-gradient(135deg, #58A8B4 0%, #438FB3 100%)',
      },
    },
  },
  plugins: [],
};
export default config;
