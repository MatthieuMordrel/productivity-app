import { useSoundEnabled, useSoundVolume } from "@/lib/stores/soundStore";
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
  const playSound = useCallback(
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

  return playSound;
};
