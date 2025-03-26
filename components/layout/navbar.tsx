"use client";

import { SoundSettingsPanel } from "@/components/SoundSettings/SoundSettingsPanel";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { NotificationRequest } from "../Notification/NotificationRequest";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Productivity", href: "/productivity" },
];

export default function Navbar({ className }: { className?: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className={cn("sticky top-0 z-50 backdrop-blur-sm", className)}>
      <div className="px-2">
        <div className="flex h-16 items-center justify-between">
          <div className="flex">
            <Link href="/" className="text-2xl font-bold text-primary">
              ProductivityApp
            </Link>
          </div>

          <div className="hidden items-center gap-4 md:flex md:min-w-[168px]">
            <div className="h-10 w-10">
              <NotificationRequest />
            </div>

            <div className="h-10 w-10">
              <SoundSettingsPanel />
            </div>
            <div className="h-10 w-10">
              <ThemeToggle />
            </div>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}

            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-base font-medium text-muted-foreground">
                Sound Settings
              </span>
              <SoundSettingsPanel />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
