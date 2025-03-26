import {
  useSessionSounds,
  useSoundActions,
  useSoundEnabled,
  useSoundVolume,
} from "@/lib/stores/soundStore";
import { SessionType } from "@/lib/types";

/**
 * useSoundContext
 *
 * A hook that provides the same interface as the original SoundContext
 * for backward compatibility during migration to Zustand.
 * Components using the old context can use this hook without changes.
 */
export function useSoundContext() {
  // Get state from Zustand store using atomic selectors
  const isSoundEnabled = useSoundEnabled();
  const volume = useSoundVolume();
  const sounds = useSessionSounds();
  const { toggleSound, setVolume, setSessionSound } = useSoundActions();

  // Return the same interface as the original context
  return {
    isSoundEnabled,
    toggleSound,
    sounds,
    volume,
    setVolume,
    setSessionSound,
  };
}

// Export the types from the original context for compatibility
export type { SessionType };
