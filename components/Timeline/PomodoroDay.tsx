"use client";

import { usePomodoroContext } from "@/contexts/PomodoroContext";
import {
  useHourBlocks,
  useHoursToDisplay,
  usePomodoroDaySessions,
} from "@/lib/hooks";
import { HourBlock, Session, TimeSegment } from "@/lib/types";
import { motion } from "framer-motion";
import { useState } from "react";
import Legend from "./Legend";
import { Tooltip } from "./Tooltip";

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const getSegmentColor = (type: TimeSegment["type"]): string => {
  switch (type) {
    case "work":
      return "bg-primary";
    case "pause":
      return "bg-secondary";
    default:
      return "bg-blue-500";
  }
};

export default function VerticalPomodoroCalendar() {
  const { state } = usePomodoroContext();
  const sessions: Session[] = usePomodoroDaySessions(state);
  const hoursToDisplay: Date[] = useHoursToDisplay(
    state.startTime,
    state.endTime,
  );
  const hourBlocks: HourBlock[] = useHourBlocks(hoursToDisplay, sessions);

  const [tooltip, setTooltip] = useState<{
    content: string;
    position: { x: number; y: number };
  } | null>(null);

  return (
    <div className="relative mx-auto w-full max-w-4xl rounded-xl bg-background p-6 text-foreground shadow-lg">
      <h2 className="mb-6 text-2xl font-semibold">Pomodoro Day Timeline</h2>
      <div className="flex">
        <div className="mr-4 flex flex-col">
          {hourBlocks.map((block, index) => (
            <motion.div
              key={block.hour.toISOString()}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="items-top flex h-24"
            >
              <div className="w-12 text-sm font-medium">
                {block.hour.getHours().toString().padStart(2, "0")}:00
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex-grow">
          {hourBlocks.map((block, index) => (
            <motion.div
              key={block.hour.toISOString()}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative h-24"
            >
              <div className="absolute inset-0 flex flex-col">
                {block.segments.map((segment, segmentIndex) => (
                  <div
                    key={segmentIndex}
                    className={`${getSegmentColor(segment.type)}`}
                    style={{ height: `${segment.percentage}%` }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltip({
                        content: `${segment.type}: ${formatTime(segment.start)} - ${formatTime(segment.end)}`,
                        position: {
                          x: rect.left,
                          y: rect.top,
                        },
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      {tooltip && (
        <Tooltip content={tooltip.content} position={tooltip.position} />
      )}
      <Legend />
    </div>
  );
}
