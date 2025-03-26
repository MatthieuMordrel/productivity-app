import { AVAILABLE_SOUNDS } from "@/lib/constants";
import { useSoundEnabled, useSoundVolume } from "@/lib/stores/soundStore";
import { SessionType } from "@/lib/types";
import { useCallback } from "react";

/**
 * Returns a function that plays a sound file from the /sounds directory
 * @returns Function that accepts folder, soundFile, and optional override parameters
 *
 * @example
 * const playSound = usePlaySound();
 * playSound("notifications", "complete.wav");
 */
export const usePlaySound = () => {
  const isSoundEnabled = useSoundEnabled();
  const volume = useSoundVolume();

  // Return a function that accepts folder, soundFile, and optional override parameters
  const play = useCallback(
    (folder: string, soundFile: string, override: boolean = false) => {
      // Play sound if sound is enabled OR if override is true
      if (!isSoundEnabled && !override) return;

      try {
        const audio = new Audio(`/sounds/${folder}/${soundFile}`);
        audio.volume = volume;
        audio.play().catch((error) => {
          console.error("Failed to play sound:", error);
        });
      } catch (error) {
        console.error("Error playing sound:", error);
      }
    },
    [isSoundEnabled, volume],
  );

  return play;
};

/**
 * A utility hook for playing sounds based on session type
 *
 * @param sessionType - The type of session to play the sound for
 * @returns A function to play the sound for the specified session
 *
 * @example
 * const playWorkSound = useSessionSound("Work");
 * playWorkSound(); // Plays the sound configured for work sessions
 */
export const useSessionSound = (sessionType: SessionType) => {
  const play = usePlaySound();

  return useCallback(() => {
    // We store session sounds in the root sounds directory
    play("", sessionType);
  }, [play, sessionType]);
};

/**
 * A utility hook for playing a specific sound file
 *
 * @param soundFile - The name of the sound file to play
 * @returns A function to play the specified sound file
 *
 * @example
 * const playCompleteSound = useSoundFile("complete.wav");
 * playCompleteSound(); // Plays the complete.wav sound
 */
export const useSoundFile = (soundFile: keyof typeof AVAILABLE_SOUNDS) => {
  const play = usePlaySound();

  return useCallback(() => {
    // Sound files are in the root sounds directory
    play("", soundFile);
  }, [play, soundFile]);
};
