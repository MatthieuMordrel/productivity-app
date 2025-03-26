"use client";

import { useSessionsContext } from "@/contexts/SessionsContext";
import { usePlaySound } from "@/hooks/useSound";
import {
  showSystemNotificationOnCompletion,
  showToastOnCompletion,
} from "@/lib/functions/completion";
import { calculateSessionProgress } from "@/lib/functions/sessionsUtils";
import { Session } from "@/lib/types";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useSoundContext } from "./SoundContext";
import { useCurrentSession } from "./currentSessionStore";

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
  const playSound = usePlaySound();
  const currentSession = useCurrentSession();
  const { sessions } = useSessionsContext();
  const { sounds } = useSoundContext();
  const [sessionInfo, setSessionInfo] = useState({
    currentSession: null as Session | null,
    remainingTime: "",
    progress: 0,
    isComplete: false,
  });
  // Trigger when a session is completed
  const handleCompletion = useCallback(() => {
    playSound(
      "session sounds",
      sounds[sessionInfo.currentSession?.type ?? "Work"],
    );
    showToastOnCompletion(sessionInfo.currentSession ?? null);
    showSystemNotificationOnCompletion(sessionInfo.currentSession ?? null);
  }, [sessionInfo.currentSession, sounds, playSound]);
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
      const { remainingTime, progress, isComplete } = calculateTimeAndProgress(
        currentSession,
        now,
      );

      // Only trigger handleCompletion if we have a current session and it's newly completed
      if (isComplete && !sessionInfo.isComplete && currentSession) {
        handleCompletion();
      }

      // Update the state with the new session and time
      setSessionInfo((prevState) => {
        // Only update if there are actual changes
        if (
          prevState.currentSession?.id !== currentSession?.id ||
          prevState.remainingTime !== remainingTime ||
          prevState.progress !== progress ||
          prevState.isComplete !== isComplete
        ) {
          return {
            currentSession: currentSession,
            remainingTime,
            progress,
            isComplete,
          };
        }
        return prevState;
      });
    };

    updateSessionAndTime();
    const interval = setInterval(updateSessionAndTime, 1000);
    return () => clearInterval(interval);
  }, [currentSession, calculateTimeAndProgress, handleCompletion]); // Remove sessionInfo dependencies

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
