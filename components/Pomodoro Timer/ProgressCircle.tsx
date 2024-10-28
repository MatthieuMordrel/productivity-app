import { useCurrentSession } from "@/hooks/useCurrentSession";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

interface ProgressCircleProps {
  colors: {
    stroke: string;
  };
}

export const ProgressCircle: React.FC<ProgressCircleProps> = ({ colors }) => {
  const { progress } = useCurrentSession();
  const controls = useAnimation();

  useEffect(() => {
    controls.start({ pathLength: progress });
  }, [progress, controls]);

  return (
    <svg
      className="absolute inset-0"
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
    >
      <motion.circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke={colors.stroke}
        strokeWidth="5"
        strokeDasharray="0 1"
        animate={controls}
      />
    </svg>
  );
};
