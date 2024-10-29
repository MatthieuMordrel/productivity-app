"use client";

import { useSessionsContext } from "@/contexts/SessionsContext";
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
import { toast } from "sonner";

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
  //Get sessions from context
  const { sessions } = useSessionsContext();
  //Create state to hold session info
  const [sessionInfo, setSessionInfo] = useState({
    currentSession: null as Session | null,
    remainingTime: "",
    progress: 0,
    isComplete: false,
  });

  // Function to play the completion sound at lower volume
  const playCompletionSound = useCallback(() => {
    const audio = new Audio("/sounds/complete.wav");
    audio.volume = 0.3;
    audio.play().catch((error) => {
      console.error("Error playing completion sound:", error);
    });
  }, []);

  // Main completion handler
  const handleCompletion = useCallback(() => {
    playCompletionSound();
    toast("Session finished", {
      description:
        sessionInfo.currentSession?.type === "Pause"
          ? "Break completed! Back to work!"
          : `${sessionInfo.currentSession?.taskTitle} completed! Good Job!`,
    });

    // TODO: Add other completion logic here
  }, [playCompletionSound, sessionInfo.currentSession]);

  // Calculate time and progress
  const calculateTimeAndProgress = useCallback(
    (current: Session | null, now: Date) => {
      if (!current)
        return { remainingTime: "", progress: 0, isComplete: false };

      return calculateSessionProgress(current, now);
    },
    [],
  );

  // Update session and time
  useEffect(() => {
    const updateSessionAndTime = () => {
      const now = new Date();
      const current = findCurrentSession(sessions);
      const { remainingTime, progress, isComplete } = calculateTimeAndProgress(
        current,
        now,
      );

      // Check if the session is newly completed
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
