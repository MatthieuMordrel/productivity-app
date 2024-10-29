import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { CompletionProvider } from "./CompletionContext";
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
    <SidebarProvider>
      <PomodoroProvider>
        <TaskProvider>
          <PomodoroCalendarProvider>
            <CompletionProvider>{children}</CompletionProvider>
          </PomodoroCalendarProvider>
        </TaskProvider>
      </PomodoroProvider>
    </SidebarProvider>
  );
}
