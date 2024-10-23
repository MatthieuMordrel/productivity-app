import containerQueries from "@tailwindcss/container-queries";
import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import { fontFamily } from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        // Add these new color definitions
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        // Add other color schemes as needed
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        "geist-sans": ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      containers: {
        "h-sm": "50px",
        "h-md": "100px",
        "h-lg": "200px",
        // Add more height-based breakpoints as needed
      },
    },
  },
  plugins: [
    plugin(({ theme, addBase }) => {
      console.log("Tailwind plugin is running");
      addBase({
        ":root": {
          "--background": "#F8F9FA",
          "--foreground": "#1C1F2E",
          "--primary": "#1C1F2E",
          "--secondary": "#F8F9FA",
          "--accent": theme("colors.gray.200"),
          // Add these new CSS variables
          "--popover": "hsl(0 0% 100%)",
          "--popover-foreground": "hsl(222.2 84% 4.9%)",
          // Add other variables as needed
        },
        ".dark": {
          "--background": theme("colors.gray.900"),
          "--foreground": theme("colors.gray.100"),
          // Add dark mode versions if needed
          "--popover": "hsl(224 71% 4%)",
          "--popover-foreground": "hsl(215 20.2% 65.1%)",
        },
      });
    }),
    containerQueries,
    animate,
  ],
};

export default config;
