"use client";

import PomodoroTimer from "@/components/Pomodoro Timer/PomodoroTimer";
import TaskList from "@/components/task_list/TaskList";
import PomodoroDay from "@/components/Timeline/PomodoroDay";
import { useSessionsContext } from "@/contexts/SessionsContext";
import { DragDropContext } from "react-beautiful-dnd";

export default function Home() {
  const { handleDragEnd } = useSessionsContext();

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <main className="flex min-h-screen flex-col bg-background p-4 text-foreground md:flex-row md:p-8">
        {/* Left column: PomodoroDay (Calendar) */}
        <div className="mb-8 w-full md:mb-0 md:w-3/5 md:pr-8">
          <h2 className="text-2xl font-bold">Pomodoro Calendar</h2>
          <div className="h-[calc(100vh-12rem)]">
            <PomodoroDay />
          </div>
        </div>

        {/* Right column: PomodoroTimer and TaskList */}
        <div className="flex w-full flex-col items-center md:w-2/5">
          <div className="mb-8">
            <PomodoroTimer />
          </div>
          <div className="flex-grow overflow-auto">
            <TaskList />
          </div>
        </div>
      </main>
    </DragDropContext>
  );
}
