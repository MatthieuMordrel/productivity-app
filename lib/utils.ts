import { type ClassValue, clsx } from "clsx";
import moment from "moment";
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
 * Shows a system notification if permissions are granted
 * @param title - Notification title
 * @param options - Notification options
 * @returns Promise<boolean> - Whether the notification was shown
 */
export const showNotification = async (
  title: string,
  options?: NotificationOptions,
): Promise<boolean> => {
  // Check if notifications are supported and permitted
  if (!("Notification" in window)) {
    return false;
  }

  if (Notification.permission !== "granted") {
    return false;
  }

  try {
    new Notification(title, {
      icon: "/favicon.ico",
      ...options,
    });
    return true;
  } catch (error) {
    console.error("Error showing notification:", error);
    return false;
  }
};

/**
 * Formats a date object into a time string in 12-hour format with AM/PM
 * @param date - The date object to format
 * @returns A string representing the time in "h:mm A" format (e.g. "2:30 PM")
 *
 * @example
 * const date = new Date('2023-08-19T14:30:00');
 * timeFormat(date);
 * // returns "2:30 PM"
 */
export function timeFormat(date: Date) {
  return moment(date).format("h:mm A");
}
