import { sessionIcons } from "@/lib/logos";
import { AnimatePresence, motion } from "framer-motion";

interface TimerDisplayProps {
  type: string;
  colors: {
    sessionTextColor: string;
  };
  minutes: number;
  seconds: number;
  taskTitle: string;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  type,
  colors,
  minutes,
  seconds,
  taskTitle,
}) => {
  // Use type assertion to ensure type is a valid key of sessionIcons
  const IconComponent = sessionIcons[type as keyof typeof sessionIcons];

  return (
    <div className="absolute inset-4 flex flex-col items-center justify-center rounded-full text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={type}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center"
        >
          <IconComponent
            className={`mb-2 h-6 w-6 ${colors.sessionTextColor}`}
          />
          <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            {type} Session
          </h2>
        </motion.div>
      </AnimatePresence>
      <p className="mt-2 text-3xl font-bold text-gray-800 dark:text-gray-100">
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </p>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {taskTitle}
      </p>
    </div>
  );
};
