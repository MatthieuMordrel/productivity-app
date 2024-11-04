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
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        accent: "hsl(var(--accent))",
        work: "hsl(var(--work))",
        pause: "hsl(var(--pause))",
        break: "hsl(var(--break))",
        card: "hsl(var(--card))",
        //We use hsla because we want to use the opacity value
        border: "hsla(var(--border))",
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
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
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        ring: {
          DEFAULT: "hsl(var(--ring))",
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
    plugin(({ addBase, addUtilities }) => {
      console.log("Tailwind plugin is running");
      // console.log(theme);
      addBase({
        ":root": {
          //Blue 500
          "--primary": "217 91.2% 59.8%",
          "--secondary": "48 100% 50%",
          "--accent": "185, 96%, 90%",
          "--muted": "210 40% 96.1%",
          "--muted-foreground": "215.4 16.3% 46.9%",
          "--ring": "215 20.2% 65.1%",
        },
        //Light mode
        ".light": {
          //Gray 100
          "--background": "220, 14%, 96%",
          //Gray 900
          "--foreground": "221, 39%, 11%",
          "--card": "220, 13%, 91%",
          "--work": "200 75% 25%",
          "--pause": "38 92% 50%",
          "--break": "142 72% 29%",
          "--popover": "220, 13%, 91%",
          //Gray 800
          "--popover-foreground": "215, 28%, 17%",
          //theme("colors.gray.300")
          "--border": "216deg, 12%, 84%, 0.4",
          // "--border-opacity": "0.2",
        },
        //Dark mode
        ".dark": {
          //gray900
          "--background": "221, 39%, 11%",
          "--foreground": "220, 14%, 96%",
          "--accent": "196, 64%, 24%",
          "--card": "215, 28%, 17%",
          "--work": "200 75% 25%",
          "--pause": "38 92% 35%",
          "--break": "142 72% 35%",
          //Popover should be slightly lighter than background
          "--popover": "224 71% 4%",
          "--popover-foreground": "215 20.2% 65.1%",
          "--muted": "223 47% 11%",
          "--muted-foreground": "215.4 16.3% 56.9%",
          "--ring": "216 34% 17%",
          //rgb(255, 255, 255, 0.1)
          "--border": "0deg, 0%, 100%, 0.1",
          // "--border-opacity": "0.1",
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
