import { useCurrentSession } from "@/hooks/useCurrentSession";
import { AnimatePresence, motion } from "framer-motion";

interface HoverStateProps {
  isHovered: boolean;
}

export const HoverState: React.FC<HoverStateProps> = ({ isHovered }) => {
  const { progress } = useCurrentSession();
  return (
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
            <p className="text-3xl font-bold">{Math.round(progress * 100)}%</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
