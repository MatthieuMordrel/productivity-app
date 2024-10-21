import PomodoroSettings from "@/components/settings/PomodoroSettings";
import PomodoroDay from "@/components/Timeline/PomodoroDay";
import { PomodoroCalendarProvider } from "@/contexts/SessionsContext";

export default function Home() {
  return (
    <PomodoroCalendarProvider>
      <main className="flex min-h-screen flex-col bg-background p-4 text-foreground md:flex-row md:p-8">
        {/* PomodoroCalendar takes up more space on larger screens */}
        <div className="w-full md:w-1/4">
          <PomodoroSettings />
        </div>
        <div className="mb-8 w-full md:mb-0 md:mr-8 md:w-3/4">
          <PomodoroDay />
        </div>
        {/* PomodoroSettings takes up less space and is positioned on the right on larger screens */}
      </main>
    </PomodoroCalendarProvider>
  );
}
