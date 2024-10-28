import PomodoroTimer from "@/components/Pomodoro Timer/PomodoroTimer";

/**
 * Focus Page
 *
 * A minimalist page that displays the Pomodoro Timer in a centered, prominent position
 * Perfect for distraction-free focus sessions
 */
export default function FocusPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="scale-150">
        {" "}
        {/* Scale up the timer by 50% */}
        <PomodoroTimer />
      </div>
    </main>
  );
}
