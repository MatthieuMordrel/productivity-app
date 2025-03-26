"use client";

import { useCurrentSession } from "@/contexts/currentSessionStore";
import { usePlaySound } from "@/hooks/useSound";
import { useSessionTracker } from "@/lib/hooks/useSessionTracker";
import {
  useCompletionActions,
  useSessionProgress,
} from "@/lib/stores/sessionCompletionStore";
import { ReactNode, useEffect } from "react";
import { useSoundContext } from "./SoundContext";

// This provider now just initializes the sound logic and session tracker
export function CompletionProvider({ children }: { children: ReactNode }) {
  // Initialize the session tracker
  useSessionTracker();

  // Set up sound playing on completion
  const playSound = usePlaySound();
  const { sounds } = useSoundContext();
  const currentSession = useCurrentSession();
  const { isComplete } = useSessionProgress();

  // Handle sound playback when a session completes
  // This effect only runs when isComplete changes to true
  useEffect(() => {
    if (isComplete && currentSession) {
      playSound("session sounds", sounds[currentSession.type]);
    }
  }, [isComplete, currentSession, sounds, playSound]);

  return <>{children}</>;
}

// Export a hook for components to consume completion data
export function useCompletion() {
  const currentSession = useCurrentSession();
  const { remainingTime, progress, isComplete } = useSessionProgress();
  const { handleCompletion } = useCompletionActions();

  return {
    currentSession,
    remainingTime,
    progress,
    isComplete,
    handleCompletion,
  };
}
