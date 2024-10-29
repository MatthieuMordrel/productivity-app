"use client";

import { useCompletion } from "@/contexts/CompletionContext";
import { getTypeColors } from "@/lib/functions/sessionsUtils";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { TimerDisplay } from "../Pomodoro Timer/TimerDisplay";

interface SessionTrackerProps {
  className?: string;
}

/**
 * SessionTracker Component
 *
 * A compact, square version of the timer that sits in the sidebar
 * to provide constant visibility of the current session.
 */
const SessionTracker = ({ className }: SessionTrackerProps) => {
  const { currentSession } = useCompletion();

  // Render a placeholder if there's no active session
  if (!currentSession) {
    return (
      <div className="mx-4 flex items-center justify-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400 shadow-md dark:from-gray-800 dark:to-gray-900 dark:text-gray-500">
        <p className="text-sm font-semibold">No active session</p>
      </div>
    );
  }

  const { type, taskTitle } = currentSession;
  const colors = getTypeColors(type);

  return (
    <div className={cn("relative mx-4 h-28", className)}>
      {/* Gradient background */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-400/30 to-purple-500/30 shadow-md backdrop-blur-sm dark:from-blue-600/30 dark:to-purple-700/30" />

      {/* Inner square */}
      <motion.div
        className="absolute inset-0.5 rounded-lg bg-white/90 dark:bg-gray-800/90"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />

      {/* Reuse TimerDisplay with adjusted styling */}
      <div className="absolute inset-0 scale-75">
        <TimerDisplay type={type} colors={colors} taskTitle={taskTitle} />
      </div>
    </div>
  );
};

export { SessionTracker };
