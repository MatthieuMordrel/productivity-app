import { PomodoroState, Session, Task } from "@/lib/types";
import { DropResult } from "react-beautiful-dnd";

// Function to create Pomodoro day sessions based on the given state
export function createPomodoroDaySessions(
  state: PomodoroState,
  previousSessions?: Session[],
): Session[] {
  console.log("createPomodoroDaySessions called");
  console.log(state);

  if (state.startTime > state.endTime) {
    console.warn("Start time is after end time. No sessions created.");
    return [];
  }

  const sessions: Session[] = [];
  const previousTitles = new Map<number, string>();
  if (previousSessions) {
    previousSessions.forEach((session) => {
      if (session.type === "Work") {
        previousTitles.set(session.index, session.taskTitle);
      }
    });
  }

  let sessionIndex = 0;

  // First, add all breaks to the sessions array
  state.breaks.forEach((breakItem) => {
    if (breakItem.start >= state.startTime && breakItem.end <= state.endTime) {
      sessions.push({
        id: `Break${sessionIndex}`,
        type: "Break",
        start: new Date(breakItem.start),
        end: new Date(breakItem.end),
        taskTitle: "Break",
        index: sessionIndex,
      });
      sessionIndex++;
    }
  });

  // Sort all sessions (breaks at this point) by start time
  sessions.sort((a, b) => a.start.getTime() - b.start.getTime());

  // Now fill in work and pause sessions
  let currentTime = new Date(state.startTime);
  const workDuration = state.pomodoroDuration * 60000;
  const pauseDuration = state.pauseDuration * 60000;

  while (currentTime < state.endTime) {
    const nextBreak = sessions.find(
      (s) => s.type === "Break" && s.start > currentTime,
    );
    const endTime = nextBreak ? nextBreak.start : state.endTime;

    // Create work session
    const workEndTime = new Date(
      Math.min(currentTime.getTime() + workDuration, endTime.getTime()),
    );
    if (workEndTime > currentTime) {
      sessions.push(
        createWorkSession(
          currentTime,
          workEndTime,
          sessionIndex,
          previousTitles,
        ),
      );
      sessionIndex++;
      currentTime = new Date(workEndTime);
    }

    // If there's time for a pause before the next break or end of day, create it
    if (currentTime < endTime) {
      const pauseEndTime = new Date(
        Math.min(currentTime.getTime() + pauseDuration, endTime.getTime()),
      );
      sessions.push(
        createPauseSession(currentTime, pauseEndTime, sessionIndex),
      );
      sessionIndex++;
      currentTime = new Date(pauseEndTime);
    }

    // If we've reached a break, move current time to after the break
    if (nextBreak && currentTime.getTime() === nextBreak.start.getTime()) {
      currentTime = new Date(nextBreak.end);
    }
  }

  // Final sort to ensure all sessions are in chronological order
  return sessions.sort((a, b) => a.start.getTime() - b.start.getTime());
}

// Helper function to create a work session
function createWorkSession(
  start: Date,
  end: Date,
  index: number,
  previousTitles: Map<number, string>,
): Session {
  return {
    id: `Work${index}`,
    type: "Work",
    start: new Date(start),
    end: new Date(end),
    taskTitle: previousTitles.get(index) || `Work ${Math.floor(index / 2)}`,
    index: index,
  };
}

// Helper function to create a pause session
function createPauseSession(start: Date, end: Date, index: number): Session {
  return {
    id: `Pause${index}`,
    type: "Pause",
    start: new Date(start),
    end: new Date(end),
    taskTitle: "Pause",
    index: index,
  };
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
export const updateSingleSession = (
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
