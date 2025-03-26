import { sessionIcons } from "@/lib/logos";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import TimeSession from "../SessionTracker/TimeSession";

interface TimerDisplayProps {
  type: string;
  colors: {
    stroke: string;
    textColor: string;
    backgroundColor: string;
  };
  taskTitle: string;
  remainingTime: string;
  displaytitle?: boolean;
  className?: string;
}

export function TimerDisplay({
  type,
  colors,
  taskTitle,
  displaytitle = true,
  className,
}: TimerDisplayProps) {
  const IconComponent = sessionIcons[type as keyof typeof sessionIcons];
  return (
    <div
      className={cn(
        "absolute inset-4 flex flex-col items-center justify-center rounded-full text-center",
        className,
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={type}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center"
        >
          <IconComponent className={`mb-2 h-6 w-6 ${colors.textColor}`} />
          <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            {type} Session
          </h2>
        </motion.div>
      </AnimatePresence>
      <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-gray-100">
        <TimeSession />
      </p>
      {displaytitle && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {taskTitle}
        </p>
      )}
    </div>
  );
}
