import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#101010",
        "ink-soft": "#000000cc",
      },
      fontFamily: {
        cabinet: ['"Cabinet Grotesk Variable"', '"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', "SimHei", "Arial", "Helvetica", "sans-serif"],
        boska: ['"Boska Variable"', '"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', "SimHei", "Arial", "Helvetica", "sans-serif"],
        satoshi: ['"Satoshi Variable"', '"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', "SimHei", "Arial", "Helvetica", "sans-serif"],
        inter: ["Inter", '"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', "SimHei", "Arial", "Helvetica", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 1s ease-out forwards",
        "fade-in": "fadeIn 1.2s ease-out forwards",
        "arrow-pulse": "arrowPulse 1.8s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        arrowPulse: {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
