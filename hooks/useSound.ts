import { useSoundContext } from "@/contexts/SoundContext";

/**
 * Returns a function that plays a sound file from the /sounds directory
 * @returns Function that accepts folder, soundFile, and optional override parameters
 *
 * @example
 * const playSound = usePlaySound();
 * playSound("notifications", "complete.wav");
 */
export const usePlaySound = () => {
  const { isSoundEnabled, volume } = useSoundContext();

  // Return a function that accepts folder, soundFile, and optional override parameters
  const play = (
    folder: string,
    soundFile: string,
    override: boolean = false,
  ) => {
    // Play sound if sound is enabled OR if override is true
    if (!isSoundEnabled && !override) return;
    const audio = new Audio(`/sounds/${folder}/${soundFile}`);
    audio.volume = volume;
    audio.play();
  };

  return play;
};
