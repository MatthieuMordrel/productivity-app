"use client";

import { createContext, ReactNode, useCallback, useContext } from "react";
import { toast } from "sonner";

interface CompletionContextType {
  // Function to play completion sound and handle notifications
  handleCompletion: () => void;
  // Optional: Add more completion-related functionality here
}

const CompletionContext = createContext<CompletionContextType | undefined>(
  undefined,
);
export function CompletionProvider({ children }: { children: ReactNode }) {
  // Function to play the completion sound at lower volume
  const playCompletionSound = useCallback(() => {
    const audio = new Audio("/sounds/complete.wav");
    audio.volume = 0.3; // Set volume to 30%
    audio.play().catch((error) => {
      console.error("Error playing completion sound:", error);
    });
  }, []);

  // Main completion handler
  const handleCompletion = useCallback(() => {
    playCompletionSound();
    toast("hi");
    // Add any other completion behaviors here (notifications, etc.)
  }, [playCompletionSound]);

  return (
    <CompletionContext.Provider
      value={{
        handleCompletion,
      }}
    >
      {children}
    </CompletionContext.Provider>
  );
}

// Custom hook to use the completion context
export function useCompletion() {
  const context = useContext(CompletionContext);
  if (context === undefined) {
    throw new Error("useCompletion must be used within a CompletionProvider");
  }
  return context;
}
