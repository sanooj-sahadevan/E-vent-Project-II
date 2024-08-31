import type { Config } from "tailwindcss";

const config: Config = {
  mode: "jit",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rootBg: "#22c55e", // Define your custom color here
        rootBgH: "#22c55e", // Define your custom color here: Hover
        feedBg: "#020617", //black
        secColor: "#1e293b", //secondary color: gray
        secColorH: "#475569", //secondary color:  Hover
        buttonBg: "#ec4899", // button color (pink)
        buttonBgH: "#db2777", // button hover color (darker pink)
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
