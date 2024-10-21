import { PomodoroProvider } from "@/contexts/SettingsContext";
import { TaskProvider } from "@/contexts/TaskContext";
import "@/styles/globals.css";
import { Inter } from "next/font/google";

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
      <body className={inter.className}>
        <TaskProvider>
          <PomodoroProvider>{children}</PomodoroProvider>
        </TaskProvider>
      </body>
    </html>
  );
}
