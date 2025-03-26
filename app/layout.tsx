import Navbar from "@/components/layout/navbar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { AppProviders } from "@/contexts/AppProviders";
import { DragDropContextProvider } from "@/contexts/DragDropContext";
import SessionManager from "@/contexts/SessionManager";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import Footer from "../components/layout/footer";
import { AppSidebar } from "../components/layout/sidebar";
import { TitleUpdater } from "../components/TitleUpdater";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pomodoro App",
  description: "Pomodoro App",
  // viewport: "width=device-width, initial-scale=1.0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://unpkg.com/react-scan/dist/auto.global.js"
          async
          defer
        />
      </head>
      <body
        className={cn(
          inter.className,
          "min-h-screen bg-background text-foreground",
        )}
      >
        <AppProviders>
          <DragDropContextProvider>
            <AppSidebar />
            {/* TitleUpdater is used to update the title of the page, and handle session completion events */}
            <TitleUpdater />
            <div className="w-full flex-1">
              <div className="sticky top-0 z-50 flex">
                <SidebarTrigger />
                <Navbar className="mb-2 flex-1" />
              </div>

              <main className="container mx-auto">{children}</main>
              <Toaster />
              <Footer />
              <SessionManager />
            </div>
          </DragDropContextProvider>
        </AppProviders>
      </body>
    </html>
  );
}
