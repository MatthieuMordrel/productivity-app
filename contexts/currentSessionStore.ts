import { Session } from "@/lib/types";
import { create } from "zustand";

// Define the store's state and actions
interface CurrentSessionState {
  // State
  currentSession: Session | null;

  // Actions
  setCurrentSession: (session: Session | null) => void;
}

// Create the Zustand store (pure store, no React hooks inside)
export const useCurrentSessionStore = create<CurrentSessionState>((set) => ({
  currentSession: null,
  setCurrentSession: (session) => set({ currentSession: session }),
}));

// Selector hooks for better performance
/**
 * useCurrentSession
 *
 * A hook that returns the current session from the currentSessionStore.
 */
export const useCurrentSession = () =>
  useCurrentSessionStore((state) => state.currentSession);

/**
 * useSetCurrentSession
 *
 * A hook that returns the setCurrentSession function from the currentSessionStore.
 */
export const useSetCurrentSession = () =>
  useCurrentSessionStore((state) => state.setCurrentSession);
