"use client";

import { useSessionsContext } from "@/contexts/SessionsContext";
import {
  playCompletionSound,
  showSystemNotificationOnCompletion,
  showToastOnCompletion,
} from "@/lib/functions/completion";
import {
  calculateSessionProgress,
  findCurrentSession,
} from "@/lib/functions/sessionsUtils";
import { Session } from "@/lib/types";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface CompletionContextType {
  handleCompletion: () => void;
  currentSession: Session | null;
  remainingTime: string;
  progress: number;
  isComplete: boolean;
}

const CompletionContext = createContext<CompletionContextType | undefined>(
  undefined,
);

export function CompletionProvider({ children }: { children: ReactNode }) {
  const { sessions } = useSessionsContext();
  const [sessionInfo, setSessionInfo] = useState({
    currentSession: null as Session | null,
    remainingTime: "",
    progress: 0,
    isComplete: false,
  });

  // Trigger when a session is completed
  const handleCompletion = useCallback(() => {
    playCompletionSound();
    showToastOnCompletion(sessionInfo.currentSession ?? null);
    showSystemNotificationOnCompletion(sessionInfo.currentSession ?? null);
  }, [sessionInfo.currentSession]);

  // Calculate time and progress
  const calculateTimeAndProgress = useCallback(
    (current: Session | null, now: Date) => {
      if (!current)
        return { remainingTime: "", progress: 0, isComplete: false };

      return calculateSessionProgress(current, now);
    },
    [],
  );

  // Set up an interval to update the session and time every second
  useEffect(() => {
    const updateSessionAndTime = () => {
      const now = new Date();
      const current = findCurrentSession(sessions);
      const { remainingTime, progress, isComplete } = calculateTimeAndProgress(
        current,
        now,
      );

      // If se
      if (isComplete && !sessionInfo.isComplete && current) {
        handleCompletion();
      }
      //Update the state with the new session and time
      setSessionInfo({
        currentSession: current,
        remainingTime,
        progress,
        isComplete,
      });
    };

    // Update the session and time immediately
    updateSessionAndTime();

    // Update the session and time every second
    const interval = setInterval(updateSessionAndTime, 1000);

    return () => clearInterval(interval);
  }, [
    sessions,
    calculateTimeAndProgress,
    handleCompletion,
    sessionInfo.isComplete,
    sessionInfo.currentSession,
  ]);

  return (
    <CompletionContext.Provider
      value={{
        handleCompletion,
        ...sessionInfo, // Spread the session info
      }}
    >
      {children}
    </CompletionContext.Provider>
  );
}

export function useCompletion() {
  const context = useContext(CompletionContext);
  if (context === undefined) {
    throw new Error("useCompletion must be used within a CompletionProvider");
  }

  return context;
}
