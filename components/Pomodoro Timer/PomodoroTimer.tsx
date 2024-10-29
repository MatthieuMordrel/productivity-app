"use client";

import { useCurrentSession } from "@/hooks/useCurrentSession";
import { getTypeColors } from "@/lib/functions/sessionsUtils";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import { CompletionOverlay } from "./CompletionOverlay";
import { HoverState } from "./HoverState";
import { ProgressCircle } from "./ProgressCircle";
import { TimerDisplay } from "./TimerDisplay";

interface PomodoroTimerProps {
  className?: string;
}

/**
 * PomodoroTimer Component
 *
 * A visual timer component that displays the current Pomodoro session
 * with animated progress indication.
 *
 * @param className - Additional CSS classes
 */
export default function PomodoroTimer({ className }: PomodoroTimerProps) {
  const { currentSession } = useCurrentSession();
  const [isHovered, setIsHovered] = useState(false);

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

  return (
    <div
      className={cn("relative h-96 w-96 cursor-pointer", className)}
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
      <ProgressCircle colors={colors} />
      <TimerDisplay type={type} colors={colors} taskTitle={taskTitle} />
      {/* Hover overlay for progress percentage */}
      <HoverState isHovered={isHovered} />
      <CompletionOverlay />
    </div>
  );
}
