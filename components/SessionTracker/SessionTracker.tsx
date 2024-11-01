"use client";

import { useCurrentSession } from "@/contexts/CurrentSessionContext";
import { getTypeColors } from "@/lib/functions/sessionsUtils";
import { sessionIcons } from "@/lib/logos";
import { cn, timeFormat } from "@/lib/utils";
import { motion } from "framer-motion";
import TimeSession from "./TimeSession";

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
  const { currentSession } = useCurrentSession();

  if (!currentSession) {
    return (
      <div className="mx-2 flex min-h-[5rem] items-center justify-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 p-2 text-center text-gray-400 shadow-md dark:from-gray-800 dark:to-gray-900 dark:text-gray-500">
        <p className="text-xs font-semibold">No active session</p>
      </div>
    );
  }

  const { type, taskTitle } = currentSession;
  const colors = getTypeColors(type);
  const IconComponent = sessionIcons[type as keyof typeof sessionIcons];

  return (
    <div className={cn("relative mx-2 h-[6rem]", className)}>
      {/* Dynamic gradient background based on session type */}
      <div
        className={cn(
          "absolute inset-0 rounded-lg bg-gradient-to-br shadow-md backdrop-blur-sm",
          `from-[${colors.stroke}] to-[${colors.stroke}] `,
        )}
      />
      <motion.div
        className="absolute inset-0.5 rounded-lg bg-white/90 dark:bg-gray-800/90"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />

      {/* Content layout optimized for narrow widths */}
      <div className="relative z-10 flex h-full flex-col items-center justify-between px-2">
        <IconComponent
          className={`absolute left-2 top-2 h-5 w-5 ${colors.textColor}`}
        />
        <div className="flex w-full items-center justify-center pt-2 text-xs">
          <TimeSession />
        </div>
        <div className="max-w-full truncate text-center text-xs">
          {taskTitle}
        </div>
        <div className="self-end pb-1 text-center text-[0.65rem] text-gray-500 dark:text-gray-400">
          {timeFormat(currentSession.start)} - {timeFormat(currentSession.end)}
        </div>
      </div>
    </div>
  );
};

export { SessionTracker };
