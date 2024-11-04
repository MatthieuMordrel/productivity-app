"use client";

import { AVAILABLE_SOUNDS } from "@/lib/constants";
import { SessionType } from "@/lib/types";
import { createContext, ReactNode, useContext, useState } from "react";

// Simple type for mapping session types to sound files
type SessionSounds = {
  //K is a key of the SessionType union type and keyof typeof maps for each key the created types from the AVAILABLE_SOUNDS object
  //This creates a type where each session type is mapped to all sound files in the AVAILABLE_SOUNDS object
  [K in SessionType]: keyof typeof AVAILABLE_SOUNDS;
};

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

const DEFAULT_SOUNDS: SessionSounds = {
  Work: "Ta Da.wav",
  Break: "Gentle chime.wav",
  Pause: "Ta Da.wav",
};

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [sounds, setSounds] = useState<SessionSounds>(DEFAULT_SOUNDS);
  const [volume, setVolume] = useState(0.5);

  //Manage if the sound is enabled or disabled
  const toggleSound = () => {
    setIsSoundEnabled((prev) => !prev);
  };

  //Set the sound for a specific session type
  const setSessionSound = (
    sessionType: SessionType,
    soundFile: keyof typeof AVAILABLE_SOUNDS,
  ) => {
    setSounds((prev) => ({
      ...prev,
      [sessionType]: soundFile,
    }));
  };

  return (
    <SoundContext.Provider
      value={{
        isSoundEnabled,
        toggleSound,
        sounds,
        setSessionSound,
        volume,
        setVolume,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundContext() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error("useSoundContext must be used within a SoundProvider");
  }
  return context;
}
