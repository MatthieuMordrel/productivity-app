"use client";

import PomodoroTimer from "@/components/Pomodoro Timer/PomodoroTimer";
import { WorkSessionSummary } from "@/components/Summary/WorkSessionSummary";
import TaskList from "@/components/task_list/TaskList";
import PomodoroDay from "@/components/Timeline/PomodoroDay";
import { useSessionsContext } from "@/contexts/SessionsContext";
import { DragDropContext } from "react-beautiful-dnd";

export default function Home() {
  const { handleDragEnd } = useSessionsContext();

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <main className="px-6">
        {/* Responsive grid container with custom column widths and gaps */}
        <div className="lg:hScreenWithoutNavbar grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-[40%_30%_30%]">
          {/* PomodoroDay component */}
          <div className="mx-auto h-full w-full">
            <PomodoroDay />
          </div>
          {/* TaskList component and PomodoroTimer component */}
          <div className="mx-auto flex w-full flex-col items-center justify-start gap-y-12">
            <PomodoroTimer />
            <TaskList className="w-full" />
          </div>
          {/* WorkSessionSummary component */}
          <div className="mx-auto w-[80%]"></div>
        </div>
        <WorkSessionSummary />
      </main>
    </DragDropContext>
  );
}
