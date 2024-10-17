import {
  HourBlock,
  PomodoroState,
  Session,
  Task,
  TimeSegment,
} from "@/lib/types";
import { useMemo } from "react";
import { DropResult } from "react-beautiful-dnd";

// This hook is used to get the sessions for a day
export function usePomodoroDaySessions(state: PomodoroState): Session[] {
  return useMemo(() => {
    const sessions: Session[] = [];
    let currentTime = new Date(`2023-01-01T${state.startTime}:00`);
    const endTime = new Date(`2023-01-01T${state.endTime}:00`);
    while (currentTime < endTime) {
      // Add work session
      const workEnd = new Date(
        currentTime.getTime() + state.pomodoroDuration * 60000,
      );
      if (workEnd > endTime) {
        // If not enough time for a full work session, create a shorter one
        sessions.push({ start: currentTime, end: endTime, type: "work" });
        break; // Exit the loop as we've reached endTime
      }
      sessions.push({ start: currentTime, end: workEnd, type: "work" });
      currentTime = new Date(workEnd.getTime());

      // Add pause session
      const pauseEnd = new Date(
        currentTime.getTime() + state.pauseDuration * 60000,
      );
      if (pauseEnd > endTime) {
        // If not enough time for a full pause session, create a shorter one
        sessions.push({ start: currentTime, end: endTime, type: "pause" });
        break; // Exit the loop as we've reached endTime
      }
      sessions.push({ start: currentTime, end: pauseEnd, type: "pause" });
      currentTime = new Date(pauseEnd.getTime());
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

// This hook is used to get the hours to display on the timeline
export function useHoursToDisplay(startTime: string, endTime: string): Date[] {
  return useMemo(() => {
    const hours = [];
    const currentHour = new Date(`2023-01-01T${startTime.split(":")[0]}:00:00`);
    const endHour = new Date(`2023-01-01T${endTime.split(":")[0]}:00:00`);
    endHour.setHours(endHour.getHours() + 1); // Include the last hour
    while (currentHour < endHour) {
      hours.push(new Date(currentHour));
      currentHour.setHours(currentHour.getHours() + 1);
    }
    // console.log(hours);
    return hours;
  }, [startTime, endTime]);
}

// This hook tailor the sessions to the hours to display and add empty sessions when needed
export function useHourBlocks(
  hoursToDisplay: Date[],
  sessions: Session[],
): HourBlock[] {
  return useMemo(() => {
    return hoursToDisplay.map((hour): HourBlock => {
      const hourEnd = new Date(hour);
      hourEnd.setHours(hourEnd.getHours() + 1); // Calculate the end of the current hour

      // Filter sessions that fall within the current hour
      const hourSessions = sessions.filter(
        (session) => session.start < hourEnd && session.end > hour,
      );

      const segments: TimeSegment[] = [];
      let startHour = new Date(hour); // Initialize startHour to the current hour

      // Iterate through each session within the current hour
      hourSessions.forEach((session) => {
        const segmentStart = new Date(
          Math.max(session.start.getTime(), hour.getTime()),
        );
        const segmentEnd = new Date(
          Math.min(session.end.getTime(), hourEnd.getTime()),
        );

        // If there's a gap before the session starts, add an empty segment
        if (segmentStart > startHour) {
          segments.push({
            start: startHour,
            end: segmentStart,
            type: "empty",
            percentage:
              ((segmentStart.getTime() - startHour.getTime()) / 3600000) * 100,
          });
        }

        // Add the current session segment
        segments.push({
          start: segmentStart,
          end: segmentEnd,
          type: session.type,
          percentage:
            ((segmentEnd.getTime() - segmentStart.getTime()) / 60000 / 60) *
            100,
        });

        startHour = segmentEnd; // Update startHour to the end of the last segment
      });

      // Add an empty session to fill the remaining time in the last hour
      if (startHour < hourEnd) {
        segments.push({
          start: startHour,
          end: hourEnd,
          type: "empty",
          percentage:
            ((hourEnd.getTime() - startHour.getTime()) / 3600000) * 100,
        });
      }

      // Return the hour block with its segments
      return { hour, segments };
    });
  }, [hoursToDisplay, sessions]);
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
