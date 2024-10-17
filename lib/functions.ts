import { PomodoroState, Session, Task } from "@/lib/types";
import { DropResult } from "react-beautiful-dnd";

// Function to create Pomodoro day sessions based on the given state
export function createPomodoroDaySessions(
  state: PomodoroState,
  previousSessions?: Session[],
): Session[] {
  // Initialize an empty array to store the sessions
  const sessions: Session[] = [];

  // Create a map to store previous session titles by their rank
  const previousTitles = new Map<number, string>();
  if (previousSessions) {
    previousSessions.forEach((session, index) => {
      if (session.type === "Work") {
        previousTitles.set(Math.floor(index / 2) + 1, session.taskTitle);
      }
    });
  }

  // Set the current time to the start time from the state
  let currentTime = state.startTime;
  // Calculate work duration in milliseconds
  const workDuration = state.pomodoroDuration * 60000;
  // Calculate pause duration in milliseconds
  const pauseDuration = state.pauseDuration * 60000;

  let rank = 0; // Initialize rank counter

  // Continue creating sessions until we reach the end time
  while (currentTime < state.endTime) {
    // Calculate the end time for the work session
    const sessionEnd = new Date(
      Math.min(currentTime.getTime() + workDuration, state.endTime.getTime()),
    );

    // Determine the task title
    const taskTitle = previousTitles.get(rank) || `Work ${rank}`;

    // Add a work session to the array
    sessions.push({
      id: `${currentTime.getTime()}-${sessionEnd.getTime()}`, // Unique ID for the session
      type: "Work",
      start: new Date(currentTime),
      end: sessionEnd,
      taskTitle: taskTitle,
      index: rank,
    });

    // Update the current time to the end of the work session
    currentTime = new Date(sessionEnd.getTime());

    // If there's still time left in the day, add a pause session
    if (currentTime < state.endTime) {
      // Calculate the end time for the pause session
      const pauseEnd = new Date(
        Math.min(
          currentTime.getTime() + pauseDuration,
          state.endTime.getTime(),
        ),
      );
      // Add a pause session to the array
      sessions.push({
        id: `${currentTime.getTime()}-${pauseEnd.getTime()}`, // Unique ID for the session
        type: "Pause",
        start: new Date(currentTime),
        end: pauseEnd,
        taskTitle: "Pause",
        index: rank,
      });
      // Update the current time to the end of the pause session
      currentTime = new Date(pauseEnd.getTime());
    }

    rank++; // Increment rank after each work-pause cycle
  }

  return sessions;
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
