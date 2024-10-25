import { PomodoroCalendarProvider } from "@/contexts/SessionsContext";
import { PomodoroProvider } from "@/contexts/SettingsContext";
import { TaskProvider } from "@/contexts/TaskContext";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import Footer from "./footer";
import Navbar from "./navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pomodoro App",
  description: "Pomodoro App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-background text-foreground")}>
        <PomodoroProvider>
          <TaskProvider>
            <PomodoroCalendarProvider>
              <Navbar />
              {children}
              <Footer />
            </PomodoroCalendarProvider>
          </TaskProvider>
        </PomodoroProvider>
      </body>
    </html>
  );
}
