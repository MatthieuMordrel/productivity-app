"use client";

import { createPomodoroDaySessions } from "@/lib/functions/sessions";
import { Session } from "@/lib/types";
import { usePomodoroContext } from "@contexts/PomodoroContext";
import { useTaskContext } from "@contexts/TaskContext";
import React, { createContext, useContext, useEffect, useState } from "react";
import { DropResult } from "react-beautiful-dnd";

interface PomodoroCalendarContextType {
  sessions: Session[];
  setSessions: React.Dispatch<React.SetStateAction<Session[]>>;
  handleDeleteSession: (sessionId: string) => void;
  handleResetSessions: () => void;
  handleDragEnd: (dropResult: DropResult) => void;
}

const PomodoroCalendarContext = createContext<
  PomodoroCalendarContextType | undefined
>(undefined);

export const PomodoroCalendarProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { state } = usePomodoroContext();
  const { tasks } = useTaskContext();

  const [sessions, setSessions] = useState<Session[]>(() =>
    createPomodoroDaySessions(state),
  );

  //Create or update sessions when state changes
  useEffect(() => {
    setSessions((prevSessions) =>
      createPomodoroDaySessions(state, prevSessions),
    );
  }, [state]);

  const handleDeleteSession = (sessionId: string) => {
    setSessions((prevSessions) =>
      prevSessions.filter((session) => session.id !== sessionId),
    );
  };

  const handleResetSessions = () => {
    setSessions(createPomodoroDaySessions(state));
  };

  //Change task title when task is dragged to session
  const handleDragEnd = (dropResult: DropResult) => {
    const { destination, draggableId } = dropResult;

    if (!destination) {
      return;
    }

    if (destination.droppableId.startsWith("event_")) {
      const eventId = destination.droppableId.split("_")[1];
      const task = tasks.find((t) => t.id === draggableId);

      if (task) {
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

  const contextValue: PomodoroCalendarContextType = {
    sessions,
    setSessions,
    handleDeleteSession,
    handleResetSessions,
    handleDragEnd,
  };

  return (
    <PomodoroCalendarContext.Provider value={contextValue}>
      {children}
    </PomodoroCalendarContext.Provider>
  );
};

export const usePomodoroCalendarContext = () => {
  const context = useContext(PomodoroCalendarContext);
  if (context === undefined) {
    throw new Error(
      "usePomodoroCalendarContext must be used within a PomodoroCalendarProvider",
    );
  }
  return context;
};
