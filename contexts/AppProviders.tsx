import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { PomodoroCalendarProvider } from "./SessionsContext";
import { PomodoroProvider } from "./SettingsContext";
import { TaskProvider } from "./TaskContext";
import { CompletionProvider } from "./CompletionContext";

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
      {/* Settings provider first since sessions depend on settings */}
      <PomodoroProvider>
        {/* Task provider before sessions since sessions use task data */}
        <TaskProvider>
          {/* Calendar provider last since it depends on both settings and tasks */}
          <PomodoroCalendarProvider>
            <CompletionProvider>{children}</CompletionProvider>
          </PomodoroCalendarProvider>
        </TaskProvider>
      </PomodoroProvider>
    </SidebarProvider>
  );
}
