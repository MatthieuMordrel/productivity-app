import { AVAILABLE_SOUNDS } from "@/lib/constants";
import { SessionType } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Type for session sounds mapping
type SessionSounds = {
  [K in SessionType]: keyof typeof AVAILABLE_SOUNDS;
};

// Default sounds configuration
const DEFAULT_SOUNDS: SessionSounds = {
  Work: "Faint chime.wav",
  Break: "Faint chime.wav",
  Pause: "Faint chime.wav",
};

// State and actions interface
interface SoundStoreState {
  // State
  isSoundEnabled: boolean;
  sounds: SessionSounds;
  volume: number;

  // Actions
  actions: {
    toggleSound: () => void;
    setVolume: (volume: number) => void;
    setSessionSound: (
      sessionType: SessionType,
      soundFile: keyof typeof AVAILABLE_SOUNDS,
    ) => void;
  };
}

// Create the Zustand store with persistence
const useSoundStore = create<SoundStoreState>()(
  persist(
    (set) => ({
      // Initial state
      isSoundEnabled: true,
      sounds: DEFAULT_SOUNDS,
      volume: 0.5,

      // Actions in a separate namespace
      actions: {
        toggleSound: () =>
          set((state) => ({ isSoundEnabled: !state.isSoundEnabled })),

        setVolume: (volume: number) => set({ volume }),

        setSessionSound: (
          sessionType: SessionType,
          soundFile: keyof typeof AVAILABLE_SOUNDS,
        ) =>
          set((state) => ({
            sounds: { ...state.sounds, [sessionType]: soundFile },
          })),
      },
    }),
    {
      name: "sound-storage", // localStorage key
      partialize: (state) => ({
        // Only persist these state properties, exclude the actions
        isSoundEnabled: state.isSoundEnabled,
        sounds: state.sounds,
        volume: state.volume,
      }),
    },
  ),
);

// Atomic selector hooks for better performance
/**
 * useSoundEnabled
 *
 * Returns whether sound is currently enabled
 */
export const useSoundEnabled = () =>
  useSoundStore((state) => state.isSoundEnabled);

/**
 * useSessionSounds
 *
 * Returns the mapping of session types to sound files
 */
export const useSessionSounds = () => useSoundStore((state) => state.sounds);

/**
 * useSoundVolume
 *
 * Returns the current sound volume (0-1)
 */
export const useSoundVolume = () => useSoundStore((state) => state.volume);

/**
 * useSoundActions
 *
 * Returns all sound-related actions
 */
export const useSoundActions = () => useSoundStore((state) => state.actions);
