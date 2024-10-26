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
        <div className="lg:h-screen-without-navbar grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-[40%_60%]">
          {/* PomodoroDay component */}
          <div className="mx-auto h-full w-full">
            <PomodoroDay />
          </div>
          {/* TaskList component and PomodoroTimer component */}
          <div className="mx-auto flex w-full flex-col items-center justify-center gap-y-12">
            <PomodoroTimer />
          </div>
          {/* WorkSessionSummary component */}
        </div>
        <WorkSessionSummary />
        <TaskList className="w-full" />
      </main>
    </DragDropContext>
  );
}
