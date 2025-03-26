"use client";

import { AVAILABLE_SOUNDS } from "@/lib/constants";
import { SessionType } from "@/lib/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type SessionSounds = {
  //K is a key of the SessionType union type and keyof typeof maps for each key the created types from the AVAILABLE_SOUNDS object
  //This creates a type where each session type is mapped to all sound files in the AVAILABLE_SOUNDS object
  [K in SessionType]: keyof typeof AVAILABLE_SOUNDS;
};

// Storage keys for localStorage
const STORAGE_KEYS = {
  SOUND_ENABLED: "sound-enabled",
  SOUND_VOLUME: "sound-volume",
  SOUND_PREFERENCES: "sound-preferences",
} as const;

// Interface for the SoundContext
interface SoundContextType {
  isSoundEnabled: boolean;
  toggleSound: () => void;
  sounds: SessionSounds;
  volume: number;
  setVolume: (volume: number) => void;
  setSessionSound: (
    sessionType: SessionType,
    //keyof gets all the keys of the AVAILABLE_SOUNDS object as a union type
    //typeof is used to convert the object into a type, without it the type of soundFile would be string
    soundFile: keyof typeof AVAILABLE_SOUNDS,
  ) => void;
}

// Default sounds for each session type
const DEFAULT_SOUNDS: SessionSounds = {
  Work: "Faint chime.wav",
  Break: "Faint chime.wav",
  Pause: "Faint chime.wav",
};

// Create the context
const SoundContext = createContext<SoundContextType | undefined>(undefined);

// Provider component for the SoundContext
export function SoundProvider({ children }: { children: ReactNode }) {
  // Initialize state with null to handle hydration properly
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean | null>(null);
  const [sounds, setSounds] = useState<SessionSounds>(DEFAULT_SOUNDS);
  const [volume, setVolume] = useState<number | null>(null);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const storedSoundEnabled = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
    const storedVolume = localStorage.getItem(STORAGE_KEYS.SOUND_VOLUME);
    const storedSounds = localStorage.getItem(STORAGE_KEYS.SOUND_PREFERENCES);

    // Set the state with the stored values if they exist or the default values
    setIsSoundEnabled(
      storedSoundEnabled ? JSON.parse(storedSoundEnabled) : true,
    );
    setVolume(storedVolume ? JSON.parse(storedVolume) : 0.5);
    setSounds(storedSounds ? JSON.parse(storedSounds) : DEFAULT_SOUNDS);
  }, []);

  // When the user clicks on the sound toggle button, we update the state and the localStorage
  const toggleSound = () => {
    setIsSoundEnabled((prev) => {
      const newValue = !prev;
      localStorage.setItem(
        STORAGE_KEYS.SOUND_ENABLED,
        JSON.stringify(newValue),
      );
      return newValue;
    });
  };

  // When the user changes the volume, we update the state and the localStorage
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    localStorage.setItem(STORAGE_KEYS.SOUND_VOLUME, JSON.stringify(newVolume));
  };

  // When the user changes the sound for a specific session type, we update the state and the localStorage
  const handleSetSessionSound = (
    sessionType: SessionType,
    soundFile: keyof typeof AVAILABLE_SOUNDS,
  ) => {
    setSounds((prev) => {
      const newSounds = { ...prev, [sessionType]: soundFile };
      localStorage.setItem(
        STORAGE_KEYS.SOUND_PREFERENCES,
        JSON.stringify(newSounds),
      );
      return newSounds;
    });
  };

  // Don't render until initial values are loaded to prevent hydration mismatch
  if (isSoundEnabled === null || volume === null) {
    return null;
  }

  return (
    <SoundContext.Provider
      value={{
        isSoundEnabled,
        toggleSound,
        sounds,
        setSessionSound: handleSetSessionSound,
        volume,
        setVolume: handleVolumeChange,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

/**
 * useSoundContext
 *
 * A hook that returns the sound context.
 */
export function useSoundContext() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error("useSoundContext must be used within a SoundProvider");
  }
  return context;
}
