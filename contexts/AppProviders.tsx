import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { CompletionProvider } from "./CompletionContext";
import { CurrentSessionProvider } from "./CurrentSessionContext";
import { EventProvider } from "./EventContext";
import { PomodoroCalendarProvider } from "./SessionsContext";
import { PomodoroProvider } from "./SettingsContext";
import { TaskProvider } from "./TaskContext";

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Combined providers component that wraps all context providers
 * Order matters - providers that are depended on by others should be higher up
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SidebarProvider>
        <PomodoroProvider>
          <TaskProvider>
            <PomodoroCalendarProvider>
              <EventProvider>
                <CurrentSessionProvider>
                  <CompletionProvider>{children}</CompletionProvider>
                </CurrentSessionProvider>
              </EventProvider>
            </PomodoroCalendarProvider>
          </TaskProvider>
        </PomodoroProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}
