"use client";

import TaskList from "@/components/task_list/TaskList";
import PomodoroDay from "@/components/Timeline/PomodoroDay";
import { useSessionsContext } from "@/contexts/SessionsContext";
import { DragDropContext } from "react-beautiful-dnd";

export default function CalendarPage() {
  const { handleDragEnd } = useSessionsContext();

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="px-6 lg:min-h-screen">
        {/* Responsive grid container with custom column widths and gaps */}
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-[60%_40%]">
          {/* PomodoroDay component */}
          <div className="mx-auto w-full">
            <PomodoroDay />
          </div>
          {/* TaskList component and PomodoroTimer component */}
          <div className="container flex flex-col gap-y-12">
            <TaskList className="" />
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}
