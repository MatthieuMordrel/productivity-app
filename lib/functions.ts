import { PomodoroState, Session, Task } from "@/lib/types";
import { DropResult } from "react-beautiful-dnd";

// Function to create Pomodoro day sessions based on the given state
export function createPomodoroDaySessions(
  state: PomodoroState,
  previousSessions?: Session[],
): Session[] {
  // Initialize an empty array to store the sessions
  const sessions: Session[] = [];

  // Create a map to store previous session titles by their index
  const previousTitles = new Map<number, string>();
  if (previousSessions) {
    previousSessions.forEach((session) => {
      if (session.type === "Work") {
        previousTitles.set(session.index, session.taskTitle);
      }
    });
  }

  // Set the current time to the start time from the state
  let currentTime = new Date(state.startTime);
  // Calculate work duration in milliseconds
  const workDuration = state.pomodoroDuration * 60000;
  // Calculate pause duration in milliseconds
  const pauseDuration = state.pauseDuration * 60000;

  let sessionIndex = 0;

  // Continue creating sessions until we reach the end time
  while (currentTime < state.endTime) {
    // Calculate the end time for the work session
    const sessionEnd = new Date(
      Math.min(currentTime.getTime() + workDuration, state.endTime.getTime()),
    );

    // Determine the task title
    const taskTitle =
      previousTitles.get(sessionIndex) ||
      `Work ${Math.floor(sessionIndex / 2)}`;

    // Add a work session to the array
    sessions.push({
      id: `Work${sessionIndex}`,
      type: "Work",
      start: new Date(currentTime),
      end: new Date(sessionEnd),
      taskTitle: taskTitle,
      index: sessionIndex,
    });

    sessionIndex++;

    // Update the current time to the end of the work session
    currentTime = new Date(sessionEnd);

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
        id: `Pause${sessionIndex}`,
        type: "Pause",
        start: new Date(currentTime),
        end: new Date(pauseEnd),
        taskTitle: "Pause",
        index: sessionIndex,
      });

      // Update the current time to the end of the pause session
      currentTime = new Date(pauseEnd);
      sessionIndex++;
    }
  }

  return sessions;
}

export const onDragEnd = (
  dropResult: DropResult,
  sessions: Session[],
  setSessions: React.Dispatch<React.SetStateAction<Session[]>>,
  tasks: Task[],
) => {
  const { destination, draggableId } = dropResult;

  // If dropped outside the list
  if (!destination) {
    return;
  }

  // If dropped on a calendar event
  if (destination.droppableId.startsWith("event_")) {
    //Get the id of the event
    const eventId = destination.droppableId.split("_")[1];
    //Get the task that is being dragged
    const task = tasks.find((t) => t.id === draggableId);

    if (task) {
      // Update the session with the new task title
      const updatedSessions = sessions.map((session) =>
        session.id === eventId
          ? { ...session, taskTitle: task.content }
          : session,
      );
      setSessions(updatedSessions);
    }
  }
};

// Function to update a specific session
// This funciton is used to update the title of a session when the user is renaming a task
export const updateSession = (
  updatedSession: Session,
  setSessions: React.Dispatch<React.SetStateAction<Session[]>>,
  setFocusedEventId: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  setSessions((prevSessions) => {
    const newSessions = prevSessions.map((session) =>
      session.id === updatedSession.id ? updatedSession : session,
    );
    // Set the focused event ID after updating
    setFocusedEventId(updatedSession.id);
    return newSessions;
  });
};
