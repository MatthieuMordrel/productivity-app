"use client";

import PomodoroTimer from "@/components/Pomodoro Timer/PomodoroTimer";

/**
 * Focus Page
 *
 * A minimalist page that displays the Pomodoro Timer in a centered, prominent position
 * Perfect for distraction-free focus sessions
 */
export default function FocusPage() {
  return (
    <div className="flex items-center justify-center bg-background p-4 hScreenWithoutNavbar">
      {/* Scale up the timer by 50% */}
      <PomodoroTimer />
      {/* <SonnerEndSession currentSession={currentSession} /> */}
    </div>
  );
}
