import { PomodoroState, Session, Task } from "@/lib/types";
import { useMemo } from "react";
import { DropResult } from "react-beautiful-dnd";

// This hook is used to get the sessions for a day
export function usePomodoroDaySessions(state: PomodoroState): Session[] {
  return useMemo(() => {
    const sessions: Session[] = [];

    let currentTime = state.startTime;
    const workDuration = state.pomodoroDuration * 60000;
    const pauseDuration = state.pauseDuration * 60000;

    while (currentTime < state.endTime) {
      const sessionEnd = new Date(
        Math.min(currentTime.getTime() + workDuration, state.endTime.getTime()),
      );
      sessions.push({
        id: `${currentTime.getTime()}-${sessionEnd.getTime()}`,
        type: "Work",
        start: new Date(currentTime),
        end: sessionEnd,
      });

      currentTime = new Date(sessionEnd.getTime());

      if (currentTime < state.endTime) {
        const pauseEnd = new Date(
          Math.min(
            currentTime.getTime() + pauseDuration,
            state.endTime.getTime(),
          ),
        );
        sessions.push({
          id: `${currentTime.getTime()}-${pauseEnd.getTime()}`,
          type: "Pause",
          start: new Date(currentTime),
          end: pauseEnd,
        });
        currentTime = new Date(pauseEnd.getTime());
      }
    }

    // console.log(sessions);
    return sessions;
  }, [
    state.startTime,
    state.endTime,
    state.pomodoroDuration,
    state.pauseDuration,
  ]);
}

// This hook is used to handle the drag and drop events
export const onDragEnd = (
  result: DropResult,
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
) => {
  const { source, destination } = result;

  // Dropped outside the list
  if (!destination) return;

  // Handle reordering within the task list
  // Check if the drag and drop operation is within the task list
  if (source.droppableId === "tasks" && destination.droppableId === "tasks") {
    // Create a new array from the existing tasks
    const newTasks = Array.from(tasks);
    // Remove the dragged item from its original position by using the index of the source item and removing 1 item
    const [reorderedItem] = newTasks.splice(source.index, 1);
    // Insert the dragged item at its new position by using the index of the destination item and inserting the reordered item at that position
    newTasks.splice(destination.index, 0, reorderedItem);
    // Update the state with the new order of tasks
    setTasks(newTasks);
  }

  // Handle moving task to calendar
  // This is a placeholder for future implementation
  if (
    source.droppableId === "tasks" &&
    destination.droppableId === "calendar"
  ) {
    // Logic to add task to calendar and remove from task list
    // Example:
    // const taskToMove = tasks[source.index];
    // setCalendarEvents(prev => [...prev, { ...taskToMove, date: selectedDate }]);
    // setTasks(prev => prev.filter((_, index) => index !== source.index));
    console.log("Task moved to calendar:", tasks[source.index]);
  }
};
