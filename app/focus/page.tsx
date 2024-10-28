"use client";

import PomodoroTimer from "@/components/Pomodoro Timer/PomodoroTimer";
import useSound from "use-sound";

/**
 * Focus Page
 *
 * A minimalist page that displays the Pomodoro Timer in a centered, prominent position
 * Perfect for distraction-free focus sessions
 */
export default function FocusPage() {
  // You can use any sound from the public folder
  const [playComplete] = useSound("/sounds/complete.wav", {
    volume: 0.1, // Adjust volume (0 to 1)
  });

  // Handler for when session completes
  const handleComplete = () => {
    playComplete(); // Play completion sound
  };

  return (
    <div className="flex items-center justify-center bg-background p-4 hScreenWithoutNavbar">
      {/* Scale up the timer by 50% */}
      <PomodoroTimer onComplete={handleComplete} />
    </div>
  );
}
