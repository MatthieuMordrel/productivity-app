import { SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { AppProviders } from "@/contexts/AppProviders";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
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
      <body
        className={cn(
          inter.className,
          "min-h-screen bg-background text-foreground",
        )}
      >
        <AppProviders>
          <AppSidebar />
          {/* TitleUpdater is used to update the title of the page, and handle session completion events */}
          <TitleUpdater />
          <div className="w-full flex-1">
            <div className="flex">
              <SidebarTrigger />
              <Navbar className="mb-2 flex-1" />
            </div>

            <main className="container mx-auto">{children}</main>
            <Toaster />
            <Footer />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
