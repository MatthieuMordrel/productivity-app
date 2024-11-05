import { Break } from "@/lib/types";

interface GenerateBreaksParams {
  startTime: Date;
  endTime: Date;
  workDuration: number; // in minutes
  breakDuration: number; // in minutes
  sessionsBeforeBreak: number; // number of work sessions before a long break
  pauseDuration: number; // in minutes
}

/**
 * Generates only long break patterns based on work sessions intervals
 * Regular pauses are handled by the session creation logic
 * @param params Configuration for break pattern generation
 * @returns Array of Break objects for long breaks only
 */
export function generateBreakPattern({
  startTime,
  endTime,
  workDuration,
  breakDuration,
  pauseDuration,
  sessionsBeforeBreak,
}: GenerateBreaksParams): Break[] {
  const breaks: Break[] = [];
  let currentTime = new Date(startTime);

  // Calculate total duration of one cycle (work sessions until break)
  const cycleDuration =
    workDuration * sessionsBeforeBreak +
    pauseDuration * (sessionsBeforeBreak - 1);

  while (currentTime < endTime) {
    // Add duration for all work sessions in the cycle
    currentTime = new Date(currentTime.getTime() + cycleDuration * 60000);

    // Check if we've reached the end time
    if (currentTime >= endTime) break;

    // Create break
    const breakStart = new Date(currentTime);
    const breakEnd = new Date(currentTime.getTime() + breakDuration * 60000);

    // Only add break if it doesn't exceed end time
    if (breakEnd <= endTime) {
      breaks.push({
        start: breakStart,
        end: breakEnd,
      });
    }

    // Move current time to after the break
    currentTime = new Date(breakEnd);
  }

  return breaks;
}
