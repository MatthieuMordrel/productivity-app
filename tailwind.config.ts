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
  // Safelist classes for condition
  safelist: [
    "animate-pulse-light",
    "shadow-md",
    "brightness-110",
    "saturate-[1.2]",
    "from-[hsl(var(--work))]",
    "to-[hsl(var(--work))]",
    "from-[hsl(var(--pause))]",
    "to-[hsl(var(--pause))]",
    "from-[hsl(var(--break))]",
    "to-[hsl(var(--break))]",
    "bg-[hsl(var(--work))]",
    "bg-[hsl(var(--pause))]",
    "bg-[hsl(var(--break))]",
    "text-[hsl(var(--work))]",
    "text-[hsl(var(--pause))]",
    "text-[hsl(var(--break))]",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "hsl(var(--primary))",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        work: "hsl(var(--work))",
        pause: "hsl(var(--pause))",
        break: "hsl(var(--break))",
        card: "var(--card)",
        border: "var(--border)",
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        //Defined in globals.css
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
        "pulse-light": "pulse 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [
    plugin(({ theme, addBase, addUtilities }) => {
      console.log("Tailwind plugin is running");
      // console.log(theme);
      addBase({
        ":root": {
          "--primary": "217 91.2% 59.8%",
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
          "--work": "200 75% 25%",
          "--pause": "38 92% 50%",
          "--break": "142 72% 29%",
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
          "--work": "200 75% 25%",
          "--pause": "38 92% 35%",
          "--break": "142 72% 35%",
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
