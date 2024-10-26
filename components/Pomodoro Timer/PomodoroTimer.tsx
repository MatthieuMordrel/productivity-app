"use client";

import { useCurrentSession } from "@/hooks/useCurrentSession";
import { TypeIcon } from "@/lib/logos";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { CheckCircle } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface PomodoroTimerProps {
  onComplete?: () => void;
  className?: string;
}

/**
 * PomodoroTimer Component
 *
 * A visual timer component that displays the current Pomodoro session
 * with animated progress indication and particle effects.
 *
 * @param onComplete - Callback fired when the timer completes
 */
export default function PomodoroTimer({
  onComplete,
  className,
}: PomodoroTimerProps) {
  const { currentSession, remainingTime, progress } = useCurrentSession();
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle system initialization and management
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        let animationFrameId: number;

        const particles: Particle[] = [];
        for (let i = 0; i < 50; i++) {
          particles.push(new Particle(canvas));
        }

        const animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          particles.forEach((particle) => particle.update(ctx));
          animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
          cancelAnimationFrame(animationFrameId);
        };
      }
    }
  }, []);

  // Animation control and state management
  useEffect(() => {
    if (currentSession) {
      controls.start({ pathLength: progress });

      if (progress === 1) {
        onComplete?.();
      }
    }
  }, [currentSession, progress, controls, onComplete]);

  // Type-based styling
  const getTypeColors = useCallback((type: "Work" | "Pause" | "Break") => {
    switch (type) {
      case "Work":
        return {
          stroke: "var(--work)",
          icon: "text-blue-500 dark:text-blue-400",
        };
      case "Pause":
        return {
          stroke: "var(--pause)",
          icon: "text-yellow-500 dark:text-yellow-400",
        };
      case "Break":
        return {
          stroke: "var(--break)",
          icon: "text-green-500 dark:text-green-400",
        };
    }
  }, []);

  // Render a placeholder if there's no active session
  if (!currentSession) {
    return (
      <div className="flex h-64 w-64 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400 shadow-lg backdrop-blur-sm dark:from-gray-800 dark:to-gray-900 dark:text-gray-500">
        <p className="text-lg font-semibold">No active session</p>
      </div>
    );
  }

  const { type, taskTitle } = currentSession;
  // Get the right color based on the session type
  const colors = getTypeColors(type);
  // Split the remaining time into minutes and seconds
  const [minutes, seconds] = remainingTime.split(":").map(Number);

  return (
    <div
      className={cn("relative h-64 w-64 cursor-pointer", className)}
      // Handle hover
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Canvas for particle animation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 rounded-full"
        width={256}
        height={256}
      />
      {/* Gradient background */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/30 to-purple-500/30 shadow-lg backdrop-blur-sm dark:from-blue-600/30 dark:to-purple-700/30" />
      {/* Inner circle */}
      <motion.div
        className="absolute inset-1 rounded-full bg-white/90 dark:bg-gray-800/90"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      {/* SVG for progress circle */}
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
      <div className="absolute inset-4 flex flex-col items-center justify-center rounded-full text-center">
        {/* Session type icon */}
        <AnimatePresence mode="wait">
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            {React.createElement(TypeIcon[type], {
              className: `mb-2 h-6 w-6 ${colors.icon}`,
            })}
            {/* Session type */}
            <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300">
              {type} Session
            </h2>
          </motion.div>
        </AnimatePresence>
        {/* Remaining time */}
        <p className="mt-2 text-3xl font-bold text-gray-800 dark:text-gray-100">
          {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </p>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {taskTitle}
        </p>
      </div>
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
      {/* Completion overlay */}
      {progress === 1 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center rounded-full bg-green-500/90"
        >
          <CheckCircle className="h-16 w-16 text-white" />
        </motion.div>
      )}
    </div>
  );
}

/**
 * Particle class for creating and managing individual particles
 * in the background animation.
 */
class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;

  constructor(canvas: HTMLCanvasElement) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
  }

  update(ctx: CanvasRenderingContext2D) {
    this.x += this.speedX;
    this.y += this.speedY;

    // Add boundary checking
    if (this.x < 0 || this.x > ctx.canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > ctx.canvas.height) this.speedY *= -1;

    this.draw(ctx);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}
