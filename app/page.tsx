"use client";

import PomodoroSettings from "@/components/settings/PomodoroSettings";
import TaskList from "@/components/task_list/TaskList";
import PomodoroDay from "@/components/Timeline/PomodoroDay";
import { onDragEnd } from "@/lib/functions";
import { Task } from "@/lib/types";
import { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  // const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]); // For future calendar implementation

  return (
    // onDragEnd is called when the user finishes dragging an item, and result is automatically passed to the function
    <DragDropContext onDragEnd={(result) => onDragEnd(result, tasks, setTasks)}>
      <div className="flex min-h-screen flex-col bg-background p-8 text-foreground">
        {/* Title */}
        <h1 className="mb-8 text-3xl font-bold">Pomodoro App</h1>

        {/* Main content area */}
        <div className="flex flex-1">
          {/* Left column for TaskList */}
          <div className="mr-8 w-1/4 min-w-[300px]">
            <TaskList tasks={tasks} setTasks={setTasks} />
          </div>

          {/* Middle column for PomodoroDay */}
          <div className="mx-8 flex-grow">
            <PomodoroDay />
          </div>

          {/* Right column for PomodoroSettings */}
          <div className="ml-8 w-1/4 min-w-[300px]">
            <PomodoroSettings />
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}
