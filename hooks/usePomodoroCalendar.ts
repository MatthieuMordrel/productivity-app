import { usePomodoroContext } from "@/contexts/PomodoroContext";
import { useTaskContext } from "@/contexts/TaskContext";
import {
  createPomodoroDaySessions,
  updateSingleSession,
} from "@/lib/functions/sessions";
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

  const [sessions, setSessions] = useState<Session[]>(() =>
    createPomodoroDaySessions(state),
  );

  const [showPauses, setShowPauses] = useState(false);
  const [focusedEventId, setFocusedEventId] = useState<string | null>(null);

  // Update sessions when pomodoro settings change
  useEffect(() => {
    console.log("PomodoroCalendar useEffect called");
    setSessions((prevSessions) =>
      createPomodoroDaySessions(state, prevSessions),
    );
  }, [state]);

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
    setSessions((prevSessions) =>
      prevSessions.map((session) =>
        session.id === event.id ? { ...session, start, end } : session,
      ),
    );
  };

  const handleUpdateSession = (updatedSession: Session) => {
    updateSingleSession(updatedSession, setSessions, setFocusedEventId);
  };

  return {
    localizer,
    events,
    sessions,
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
