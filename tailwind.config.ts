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
  safelist: [
    "animate-pulse-light",
    "shadow-md",
    "brightness-110",
    "saturate-[1.2]",
    "from-[var(--work)]",
    "to-[var(--work)]",
    "from-[var(--pause)]",
    "to-[var(--pause)]",
    "from-[var(--break)]",
    "to-[var(--break)]",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        work: "var(--work)",
        pause: "var(--pause)",
        break: "var(--break)",
        card: "var(--card)",
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        ring: {
          DEFAULT: "var(--ring)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        "geist-sans": ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      height: {
        hScreenWithoutNavbar: "calc(100vh-80px)",
      },
      containers: {
        "h-sm": "50px",
        "h-md": "100px",
        "h-lg": "200px",
      },
      animation: {
        "pulse-light": "pulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [
    plugin(({ theme, addBase, addUtilities }) => {
      console.log("Tailwind plugin is running");
      // console.log(theme);
      addBase({
        ":root": {
          "--primary": theme("colors.blue.500"),
          "--secondary": theme("colors.yellow.500"),
          "--accent": theme("colors.cyan.100"),
          "--muted": "hsl(210 40% 96.1%)",
          "--muted-foreground": "hsl(215.4 16.3% 46.9%)",
          "--ring": "hsl(215 20.2% 65.1%)",
        },
        //Light mode
        ".light": {
          "--background": theme("colors.gray.100"),
          "--foreground": theme("colors.gray.900"),
          "--card": theme("colors.gray.200"),
          "--work": theme("colors.sky.800"),
          "--pause": theme("colors.amber.500"),
          "--break": theme("colors.emerald.500"),
          "--popover": theme("colors.gray.200"),
          "--popover-foreground": theme("colors.gray.800"),
          "--border": theme("colors.gray.300"),
        },
        //Dark mode
        ".dark": {
          "--background": theme("colors.gray.900"),
          "--foreground": theme("colors.gray.100"),
          "--accent": theme("colors.cyan.900"),
          "--card": theme("colors.gray.800"),
          "--work": theme("colors.sky.800"),
          "--pause": theme("colors.amber.800"),
          "--break": theme("colors.emerald.600"),
          //Popover should be slightly lighter than background
          "--popover": "hsl(224 71% 4%)",
          "--popover-foreground": "hsl(215 20.2% 65.1%)",
          "--muted": "hsl(223 47% 11%)",
          "--muted-foreground": "hsl(215.4 16.3% 56.9%)",
          "--ring": "hsl(216 34% 17%)",
          "--border": "rgb(255, 255, 255, 0.1)",
        },
      });
      // Add new utility class for 100vh - 40px
      addUtilities({
        ".hScreenWithoutNavbar": {
          height: "calc(100vh - 88px)",
        },
        ".calendarHeight": {
          height: "32rem",
        },
      });
    }),
    containerQueries,
    animate,
  ],
};

export default config;
