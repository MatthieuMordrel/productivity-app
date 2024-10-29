import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges multiple class names together using the `clsx` and `tailwind-merge` libraries.
 * This function takes an arbitrary number of arguments, each representing a class name or an array of class names.
 * It first combines all the arguments using `clsx`, which handles conditional classes and ensures proper formatting.
 * Then, it passes the combined class names to `twMerge` from the `tailwind-merge` library, which merges the Tailwind CSS classes and removes any duplicates.
 *
 * @param {...ClassValue[]} inputs - An arbitrary number of arguments representing class names or arrays of class names.
 * @returns {string} The merged and deduplicated class names as a string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a given number of minutes into a string representation of hours and minutes.
 *
 * @param {number} minutes - The total number of minutes to format.
 * @returns {string} A formatted string in the format "Xh Ym" where X is hours and Y is minutes.
 *
 * @example
 * formatTime(150);
 * // returns "2h 30m"
 *
 * @example
 * formatTime(45);
 * // returns "0h 45m"
 */
export const formatMinutesToHoursAndMinutes = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
};

/**
 * Formats a given Date object into a string representation of hours and minutes in AM/PM format.
 *
 * @param {Date} date - The Date object to format.
 * @returns {string} A formatted string in the format "hh:MM AM/PM".
 *
 * @example
 * const date = new Date('2023-08-19T14:30:00');
 * formatDateToTime(date);
 * // returns "02:30 PM"
 *
 * @example
 * const date = new Date('2023-08-19T09:05:00');
 * formatDateToTime(date);
 * // returns "09:05 AM"
 */
export const formatDateToTime = (date: Date): string => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minutesStr = minutes < 10 ? "0" + minutes : minutes;
  return `${hours}:${minutesStr} ${ampm}`;
};
