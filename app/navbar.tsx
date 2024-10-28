import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand section */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-foreground">
              Pomodoro Calendar
            </Link>
          </div>

          {/* Navigation section */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/productivity"
                  className={navigationMenuTriggerStyle()}
                >
                  Productivity Rhythms
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
}
