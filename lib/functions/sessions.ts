import { Break, PomodoroState, Session } from "@/lib/types";

// Function to create Pomodoro day sessions based on the given state
export function createPomodoroDaySessions(
  state: PomodoroState,
  previousSessions?: Session[],
): Session[] {
  console.log("createPomodoroDaySessions called");
  console.log("state", state);

  if (state.startTime >= state.endTime) {
    console.warn("Start time is not before end time. No sessions created.");
    return [];
  }

  // Create sessions without titles
  const sessions = createSessions(state);

  // Remap titles to the correct sessions
  const sessionsWithTitles = remapSessionTitles(sessions, previousSessions);
  console.log("sessionsWithTitles", sessionsWithTitles);

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

  // Add all processed breaks to the sessions array using createSession function
  processedBreaks.forEach((breakItem) => {
    sessions.push(
      createSession(
        new Date(breakItem.start),
        new Date(breakItem.end),
        sessionIndex,
        "Break",
      ),
    );
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
      sessions.push(
        createSession(currentTime, workEndTime, sessionIndex, "Work"),
      );
      sessionIndex++;
      currentTime = new Date(workEndTime);
    }

    if (currentTime < endTime) {
      const pauseEndTime = new Date(
        Math.min(currentTime.getTime() + pauseDuration, endTime.getTime()),
      );
      sessions.push(
        createSession(currentTime, pauseEndTime, sessionIndex, "Pause"),
      );
      sessionIndex++;
      currentTime = new Date(pauseEndTime);
    }
  }

  return sessions.sort((a, b) => a.start.getTime() - b.start.getTime());
}

/**
 * Processes and merges overlapping breaks within a given time range.
 *
 * @param {Break[]} breaks - Array of Break objects to process.
 * @param {Date} startTime - The start time of the day.
 * @param {Date} endTime - The end time of the day.
 * @returns {Break[]} An array of processed Break objects with merged overlaps.
 */
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

/**
 * Creates a session object for Work, Pause, or Break.
 *
 * @param {Date} start - The start time of the session.
 * @param {Date} end - The end time of the session.
 * @param {number} index - The index of the session.
 * @param {"Work" | "Pause" | "Break"} type - The type of the session.
 * @returns {Session} A Session object with the specified properties.
 */
function createSession(
  start: Date,
  end: Date,
  index: number,
  type: "Work" | "Pause" | "Break",
): Session {
  return {
    id: `${type}${index}`,
    index: index,
    type: type,
    start: new Date(start),
    end: new Date(end),
    taskTitle: type === "Work" ? `Work ${Math.floor(index / 2)}` : type,
    taskId: "",
  };
}

/**
 * Remaps titles and task IDs to the correct sessions based on previous sessions.
 *
 * @param {Session[]} sessions - The current array of sessions to be remapped.
 * @param {Session[]} [previousSessions] - Optional array of previous sessions to use for remapping.
 * @returns {Session[]} A new array of sessions with remapped titles and task IDs.
 */
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
