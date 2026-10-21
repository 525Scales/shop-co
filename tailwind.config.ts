import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0d0d0d",
        paper: "#f0eeed",
        sale: "#ff3333",
      },
      fontFamily: {
        display: ['"Archivo"', "system-ui", "sans-serif"],
        sans: ['"Satoshi"', "system-ui", "sans-serif"],
      },
      keyframes: {
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
      },
      animation: { marquee: "marquee 28s linear infinite", shimmer: "shimmer 1.6s infinite" },
    },
  },
  plugins: [],
};
export default config;
