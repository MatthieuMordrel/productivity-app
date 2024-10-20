import { usePomodoroContext } from "@/contexts/PomodoroContext";
import { useTaskContext } from "@/contexts/TaskContext";
import {
  createPomodoroDaySessions,
  updateSingleSession,
} from "@/lib/functions";
import { Session } from "@/lib/types";
import moment from "moment";
import { useEffect, useState } from "react";
import { DropResult } from "react-beautiful-dnd";
import { momentLocalizer } from "react-big-calendar";

// Create the localizer
const localizer = momentLocalizer(moment);

export const usePomodoroCalendar = () => {
  const { state } = usePomodoroContext();
  const { tasks } = useTaskContext();

  // Check for invalid time range
  const isInvalidTimeRange = state.startTime >= state.endTime;

  const [sessions, setSessions] = useState<Session[]>(() =>
    isInvalidTimeRange ? [] : createPomodoroDaySessions(state),
  );

  const [showPauses, setShowPauses] = useState(false);
  const [focusedEventId, setFocusedEventId] = useState<string | null>(null);

  // Update sessions when pomodoro settings change
  useEffect(() => {
    if (!isInvalidTimeRange) {
      setSessions((prevSessions) =>
        createPomodoroDaySessions(state, prevSessions),
      );
    } else {
      setSessions([]);
    }
  }, [state, isInvalidTimeRange]);

  // Log warning if no sessions available
  useEffect(() => {
    if (sessions.length === 0) {
      console.warn(
        "No sessions available. This may be due to invalid time settings.",
      );
    }
  }, [sessions]);

  // Filter events based on showPauses state
  const events = showPauses
    ? sessions
    : sessions.filter((session) => session.type !== "Pause");

  const handleDeleteSession = (sessionId: string) => {
    setSessions((prevSessions) =>
      prevSessions.filter((session) => session.id !== sessionId),
    );
  };

  const handleResetSessions = () => {
    setSessions(createPomodoroDaySessions(state));
  };

  const handleDragEnd = (dropResult: DropResult) => {
    const { destination, draggableId } = dropResult;

    // If dropped outside the list
    if (!destination) {
      return;
    }

    // If dropped on a calendar event
    if (destination.droppableId.startsWith("event_")) {
      // Get the id of the event
      const eventId = destination.droppableId.split("_")[1];
      // Get the task that is being dragged
      const task = tasks.find((t) => t.id === draggableId);

      if (task) {
        // Update the session with the new task title
        setSessions((prevSessions) =>
          prevSessions.map((session) =>
            session.id === eventId
              ? { ...session, taskTitle: task.content }
              : session,
          ),
        );
      }
    }
  };

  const handleEventDrop = (dropEvent: {
    event: Session;
    start: Date;
    end: Date;
  }) => {
    const { event, start, end } = dropEvent;
    // console.log("handleEventDrop called with:", { event, start, end, sessions });
    const updatedSessions = sessions.map((session) =>
      session.id === event.id ? { ...session, start, end } : session,
    );
    setSessions([...updatedSessions]); // Explicitly set a new array
  };

  const handleUpdateSession = (updatedSession: Session) => {
    updateSingleSession(updatedSession, setSessions, setFocusedEventId);
  };

  return {
    localizer,
    events,
    sessions,
    isInvalidTimeRange,
    showPauses,
    focusedEventId,
    state,
    handleDeleteSession,
    handleResetSessions,
    handleDragEnd,
    handleEventDrop,
    handleUpdateSession,
    setShowPauses,
    setFocusedEventId,
  };
};
