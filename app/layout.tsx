import { AppProviders } from "@/contexts/AppProviders";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import Footer from "./footer";
import Navbar from "./navbar";
import { AppSidebar } from "./sidebar";
import { TitleUpdater } from "./TitleUpdater";

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
        <AppProviders>
          <AppSidebar />
          {/* TitleUpdater is used to update the title of the page, and handle session completion events */}
          <TitleUpdater />
          <main className="flex-1">
            <Navbar />
            <main className="container min-h-screen">{children}</main>
            <Toaster />
            <Footer />
          </main>
        </AppProviders>
      </body>
    </html>
  );
}
