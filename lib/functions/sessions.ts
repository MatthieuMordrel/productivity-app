import { Break, PomodoroState, Session } from "@/lib/types";

// Function to create Pomodoro day sessions based on the given state
export function createPomodoroDaySessions(
  state: PomodoroState,
  previousSessions?: Session[],
): Session[] {
  console.log("createPomodoroDaySessions called");

  if (state.startTime >= state.endTime) {
    console.warn("Start time is not before end time. No sessions created.");
    return [];
  }

  // Create sessions without titles
  const sessions = createSessions(state);

  // Remap titles to the correct sessions
  const sessionsWithTitles = remapSessionTitles(sessions, previousSessions);

  return sessionsWithTitles;
}

// Function to create sessions without titles
function createSessions(state: PomodoroState): Session[] {
  // Process and merge overlapping breaks
  const processedBreaks = processBreaks(
    state.breaks,
    state.startTime,
    state.endTime,
  );

  // If there's a break spanning the entire day, return only that break as a session
  if (
    processedBreaks.length === 1 &&
    processedBreaks[0].start.getTime() === state.startTime.getTime() &&
    processedBreaks[0].end.getTime() === state.endTime.getTime()
  ) {
    return [
      {
        id: `Break0`,
        type: "Break",
        start: new Date(state.startTime),
        end: new Date(state.endTime),
        taskTitle: "Break",
        taskId: "",
        index: 0,
      },
    ];
  }

  const sessions: Session[] = [];
  let sessionIndex = 0;

  // Add all processed breaks to the sessions array
  processedBreaks.forEach((breakItem) => {
    sessions.push({
      id: `Break${sessionIndex}`,
      type: "Break",
      start: new Date(breakItem.start),
      end: new Date(breakItem.end),
      taskTitle: "Break",
      taskId: "",
      index: sessionIndex,
    });
    sessionIndex++;
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

    const currentBreak = sessions.find(
      (s) =>
        s.type === "Break" && s.start <= currentTime && s.end > currentTime,
    );

    if (currentBreak) {
      currentTime = new Date(currentBreak.end);
      continue;
    }

    const workEndTime = new Date(
      Math.min(currentTime.getTime() + workDuration, endTime.getTime()),
    );
    if (workEndTime > currentTime) {
      sessions.push(createWorkSession(currentTime, workEndTime, sessionIndex));
      sessionIndex++;
      currentTime = new Date(workEndTime);
    }

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
  }

  return sessions.sort((a, b) => a.start.getTime() - b.start.getTime());
}

function processBreaks(
  breaks: Break[],
  startTime: Date,
  endTime: Date,
): Break[] {
  // Filter out invalid breaks (where start time is after end time)
  const validBreaks = breaks.filter(
    (breakItem) => breakItem.start <= breakItem.end,
  );

  // Sort breaks by start time
  const sortedBreaks = validBreaks.sort(
    (a, b) => a.start.getTime() - b.start.getTime(),
  );

  const processedBreaks: Break[] = [];
  let currentBreak: Break | null = null;

  for (const breakItem of sortedBreaks) {
    // Check if the break spans the entire day
    if (breakItem.start <= startTime && breakItem.end >= endTime) {
      // Return a single break covering the whole day
      return [
        {
          start: new Date(startTime),
          end: new Date(endTime),
        },
      ];
    }

    // Adjust break to fit within day bounds
    const adjustedBreak = {
      start: new Date(Math.max(breakItem.start.getTime(), startTime.getTime())),
      end: new Date(Math.min(breakItem.end.getTime(), endTime.getTime())),
    };

    // Skip breaks that are entirely outside the day bounds
    if (adjustedBreak.start >= endTime || adjustedBreak.end <= startTime) {
      continue;
    }

    if (!currentBreak) {
      currentBreak = adjustedBreak;
    } else if (adjustedBreak.start <= currentBreak.end) {
      // Merge overlapping breaks
      currentBreak.end = new Date(
        Math.max(currentBreak.end.getTime(), adjustedBreak.end.getTime()),
      );
    } else {
      // No overlap, add the current break and start a new one
      processedBreaks.push(currentBreak);
      currentBreak = adjustedBreak;
    }
  }

  // Add the last break if it exists
  if (currentBreak) {
    processedBreaks.push(currentBreak);
  }

  return processedBreaks;
}

// Simplified helper function to create a work session
function createWorkSession(start: Date, end: Date, index: number): Session {
  return {
    id: `Work${index}`,
    index: index,
    type: "Work",
    start: new Date(start),
    end: new Date(end),
    taskTitle: `Work ${Math.floor(index / 2)}`, // Default title
    taskId: "",
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
    taskId: "",
    index: index,
  };
}

// Function to remap titles to the correct sessions
function remapSessionTitles(
  sessions: Session[],
  previousSessions?: Session[],
): Session[] {
  const previousTitlesAndIds = new Map<number, { title: string; id: string }>();
  let titleIndex = 0;

  if (previousSessions) {
    previousSessions.forEach((session) => {
      if (session.type === "Work") {
        previousTitlesAndIds.set(titleIndex, {
          title: session.taskTitle,
          id: session.taskId,
        });
        titleIndex++;
      }
    });
  }

  let workIndex = 0;
  return sessions.map((session) => {
    if (session.type === "Work") {
      const newSession = { ...session };
      const previousData = previousTitlesAndIds.get(workIndex);
      if (previousData) {
        newSession.taskTitle = previousData.title;
        newSession.taskId = previousData.id;
      } else {
        newSession.taskTitle = `Work ${workIndex}`;
        newSession.taskId = ""; // Reset taskId if no previous data
      }
      workIndex++;
      return newSession;
    }
    return session;
  });
}

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
