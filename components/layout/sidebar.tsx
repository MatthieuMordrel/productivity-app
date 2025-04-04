"use client";

import { SessionTracker } from "@/components/SessionTracker/SessionTracker";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Calendar, ChartBar, Home, LucideIcon, Target } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Define navigation items with typed URL
const items: Array<{
  title: string;
  url: string;
  icon: LucideIcon;
}> = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  // {
  //   title: "Task manager",
  //   url: "/task-manager",
  //   icon: List,
  // },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Summary",
    url: "/summary",
    icon: ChartBar,
  },
  {
    title: "Focus",
    url: "/focus",
    icon: Target,
  },
  // {
  //   title: "Habit tracker",
  //   url: "/habittracker",
  //   icon: Activity,
  // },
];

export function AppSidebar() {
  // Get current pathname for active state
  const pathname = usePathname();
  return (
    //3 variants: sidebar, floating, inset
    //2side: left, right
    //3collapsible: offcanvas, icon, none
    <Sidebar side="left" variant="sidebar">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    variant="default"
                    size="sm"
                    asChild
                    isActive={pathname === item.url}
                  >
                    {/*Use link to avoid page refresh and losing states*/}
                    <Link href={item.url}>
                      <item.icon
                        className={cn(
                          "h-4 w-4",
                          pathname === item.url && "text-primary",
                        )}
                      />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* Only show SessionTracker when not on focus page */}
        {pathname !== "/focus" && (
          <div className="mb-4 mt-auto">
            <SessionTracker />
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
