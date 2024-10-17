import type { Config } from "tailwindcss";
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        "geist-sans": ["var(--font-geist-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [
    plugin(({ theme, addBase }) => {
      console.log("Tailwind plugin is running");
      addBase({
        ":root": {
          "--background": theme("colors.gray.50"),
          "--foreground": theme("colors.gray.900"),
          "--primary": theme("colors.teal.800"),
          "--secondary": theme("colors.rose.200"),
        },
        ".dark": {
          "--background": theme("colors.gray.900"),
          "--foreground": theme("colors.gray.100"),
        },
      });
    }),
  ],
};

export default config;
