"use client";

import { createPomodoroDaySessions } from "@/lib/functions/sessions";
import { Session } from "@/lib/types";
import { useTaskContext } from "@contexts/TaskContext";
import React, { createContext, useContext, useEffect, useState } from "react";
import { DropResult } from "react-beautiful-dnd";
import { useSettingsContext } from "./SettingsContext";

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
  const { state } = useSettingsContext();
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

  // Watch for changes in task list and update sessions accordingly
  useEffect(() => {
    setSessions((prevSessions) =>
      prevSessions.map((session) => {
        const correspondingTask = tasks.find(
          (task) => task.id === session.taskId,
        );
        if (correspondingTask) {
          // Update the session if the task name has changed
          return {
            ...session,
            taskTitle: correspondingTask.content,
          };
        } else if (session.taskId) {
          // If a session has a taskId but no corresponding task, it means task was deleted and we need to reset the session
          return {
            ...session,
            taskTitle: `Work ${session.index + 1}`,
            taskId: "",
          };
        }
        return session;
      }),
    );
  }, [tasks]);

  // Delete single session
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
              ? { ...session, taskTitle: task.content, taskId: task.id }
              : session,
          ),
        );
      }
    }
  };

  console.log(sessions);

  return (
    <PomodoroCalendarContext.Provider
      value={{
        sessions,
        setSessions,
        handleDeleteSession,
        handleResetSessions,
        handleDragEnd,
      }}
    >
      {children}
    </PomodoroCalendarContext.Provider>
  );
};

export const useSessionsContext = () => {
  const context = useContext(PomodoroCalendarContext);
  if (context === undefined) {
    throw new Error(
      "useSessionsContext must be used within a PomodoroCalendarProvider",
    );
  }
  return context;
};
