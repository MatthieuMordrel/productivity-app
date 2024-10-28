import moment from "moment";

/**
 * Calculates the appropriate time range to display in the calendar for a given date.
 * Handles both single-day and multi-day schedules.
 *
 * @param date - The date for which to calculate the time range
 * @param startTime - The overall schedule start time
 * @param endTime - The overall schedule end time
 * @returns An object containing the calculated start and end times for the calendar
 *          - calendarStartTime: The time to start displaying events from
 *          - calendarEndTime: The time to stop displaying events at
 */
export const getTimeRangeForDate = (
  date: Date,
  startTime: Date,
  endTime: Date,
): { calendarStartTime: Date; calendarEndTime: Date } => {
  const selectedDate = moment(date).startOf("day");
  const startDate = moment(startTime).startOf("day");
  const endDate = moment(endTime).startOf("day");

  // If start and end are on the same day, use exact times
  if (startDate.isSame(endDate, "day")) {
    return {
      calendarStartTime: startTime,
      calendarEndTime: endTime,
    };
  }

  // Multi-day handling
  if (selectedDate.isSame(startDate, "day")) {
    // If it's the first day, use the actual start time and end at 23:59
    return {
      calendarStartTime: startTime,
      calendarEndTime: moment(date).endOf("day").toDate(),
    };
  } else if (selectedDate.isSame(endDate, "day")) {
    // If it's the last day, start at 00:00 and use the actual end time
    return {
      calendarStartTime: moment(date).startOf("day").toDate(),
      calendarEndTime: endTime,
    };
  } else {
    // For any day in between, show full day
    return {
      calendarStartTime: moment(date).startOf("day").toDate(),
      calendarEndTime: moment(date).endOf("day").toDate(),
    };
  }
};
