import { SidebarProvider } from "@/components/ui/sidebar";
import { PomodoroCalendarProvider } from "@/contexts/SessionsContext";
import { PomodoroProvider } from "@/contexts/SettingsContext";
import { TaskProvider } from "@/contexts/TaskContext";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import Footer from "./footer";
import Navbar from "./navbar";
import { AppSidebar } from "./sidebar";

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
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1">
            <PomodoroProvider>
              <TaskProvider>
                <PomodoroCalendarProvider>
                  <Navbar />
                  {children}
                  <Footer />
                </PomodoroCalendarProvider>
              </TaskProvider>
            </PomodoroProvider>
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
