"use client";

import TaskList from "@/components/task_list/TaskList";
import PomodoroDay from "@/components/Timeline/PomodoroDay";
import { useSessionsContext } from "@/contexts/SessionsContext";
import { DragDropContext } from "react-beautiful-dnd";

export default function CalendarPage() {
  const { handleDragEnd } = useSessionsContext();

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <main className="px-6">
        {/* Responsive grid container with custom column widths and gaps */}
        <div className="lg:h-screen-without-navbar grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
          {/* PomodoroDay component */}
          <div className="mx-auto h-full w-full">
            <PomodoroDay />
          </div>
          {/* TaskList component and PomodoroTimer component */}
          <TaskList className="w-full" />
        </div>
      </main>
    </DragDropContext>
  );
}
