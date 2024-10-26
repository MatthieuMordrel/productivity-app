"use client";

import PomodoroTimer from "@/components/Pomodoro Timer/PomodoroTimer";
import { WorkSessionSummary } from "@/components/Pomodoro Timer/WorkSessionSummary";
import TaskList from "@/components/task_list/TaskList";
import PomodoroDay from "@/components/Timeline/PomodoroDay";
import { useSessionsContext } from "@/contexts/SessionsContext";
import { DragDropContext } from "react-beautiful-dnd";

export default function Home() {
  const { handleDragEnd } = useSessionsContext();

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <main className="flex min-h-screen flex-col justify-center p-4">
        {/* Responsive grid container with custom column widths and gaps */}
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-[40%_20%_40%]">
          {/* PomodoroDay component */}
          <div className="mx-auto w-full">
            <PomodoroDay />
          </div>
          {/* TaskList component */}
          <div className="mx-auto">
            <TaskList />
          </div>
          {/* PomodoroTimer component */}
          <div className="mx-auto flex flex-col items-center gap-4">
            <WorkSessionSummary />
            <PomodoroTimer />
          </div>
        </div>
      </main>
    </DragDropContext>
  );
}
