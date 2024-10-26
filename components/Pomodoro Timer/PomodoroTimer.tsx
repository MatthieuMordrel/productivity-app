"use client";

import { useCurrentSession } from "@/hooks/useCurrentSession";
import { getTypeColors } from "@/lib/functions/sessions";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CompletionOverlay } from "./CompletionOverlay";
import { ProgressCircle } from "./ProgressCircle";
import { TimerDisplay } from "./TimerDisplay";

interface PomodoroTimerProps {
  onComplete?: () => void;
  className?: string;
}

/**
 * PomodoroTimer Component
 *
 * A visual timer component that displays the current Pomodoro session
 * with animated progress indication.
 *
 * @param onComplete - Callback fired when the timer completes
 * @param className - Additional CSS classes
 */
export default function PomodoroTimer({
  onComplete,
  className,
}: PomodoroTimerProps) {
  const { currentSession, remainingTime, progress } = useCurrentSession();
  const [isHovered, setIsHovered] = useState(false);

  // Fire the callback when the timer completes
  useEffect(() => {
    if (currentSession && progress === 1) {
      onComplete?.();
    }
  }, [currentSession, progress, onComplete]);

  // Render a placeholder if there's no active session
  if (!currentSession) {
    return (
      <div className="flex h-64 w-64 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400 shadow-lg backdrop-blur-sm dark:from-gray-800 dark:to-gray-900 dark:text-gray-500">
        <p className="text-lg font-semibold">No active session</p>
      </div>
    );
  }

  const { type, taskTitle } = currentSession;
  const colors = getTypeColors(type);
  const [minutes, seconds] = remainingTime.split(":").map(Number);

  return (
    <div
      className={cn("relative h-64 w-64 cursor-pointer", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/30 to-purple-500/30 shadow-lg backdrop-blur-sm dark:from-blue-600/30 dark:to-purple-700/30" />
      {/* Inner circle */}
      <motion.div
        className="absolute inset-1 rounded-full bg-white/90 dark:bg-gray-800/90"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      <ProgressCircle progress={progress} colors={colors} />
      <TimerDisplay
        type={type}
        colors={colors}
        minutes={minutes}
        seconds={seconds}
        taskTitle={taskTitle}
      />
      {/* Hover overlay for progress percentage */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 flex items-center justify-center rounded-full bg-black/70 text-white"
          >
            <div className="text-center">
              <p className="text-lg font-semibold">Progress</p>
              <p className="text-3xl font-bold">
                {Math.round(progress * 100)}%
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <CompletionOverlay isComplete={progress === 1} />
    </div>
  );
}
