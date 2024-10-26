import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface CompletionOverlayProps {
  isComplete: boolean;
}

export const CompletionOverlay: React.FC<CompletionOverlayProps> = ({
  isComplete,
}) => {
  if (!isComplete) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="absolute inset-0 flex items-center justify-center rounded-full bg-green-500/90"
    >
      <CheckCircle className="h-16 w-16 text-white" />
    </motion.div>
  );
};
