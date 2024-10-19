import React from "react";

interface TimePickerProps {
  value: Date;
  onChange: (value: Date) => void;
  showSetNowButton?: boolean; // New prop to control the visibility of the "Set to Now" button
  minTime?: Date; // New prop for minimum allowed time
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  showSetNowButton = false,
  minTime,
}) => {
  // Convert Date to HH:mm string because input type="time" only accepts strings
  const timeString = value.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Convert HH:mm string back to Date so that we can update our state via the onChange function
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Split the input value into hours and minutes, then convert them to numbers
    const [hours, minutes] = e.target.value.split(":").map(Number);
    // Create a new Date object with the current date and the new hours and minutes
    const newDate = new Date(value);
    newDate.setHours(hours, minutes);

    // Check if the new time is after minTime (if provided)
    if (minTime && newDate <= minTime) {
      // If not, set to 30 minutes after minTime
      newDate.setTime(minTime.getTime() + 30 * 60000);
    }

    // Update the state with the new Date object
    onChange(newDate);
    console.log("New date:", newDate);
  };

  // New function to set the time to now
  const setToNow = () => {
    console.log("Setting to now");
    const now = new Date();
    // Ensure 'now' is not before minTime
    if (minTime && now <= minTime) {
      now.setTime(minTime.getTime() + 30 * 60000);
    }
    onChange(now);
  };

  // Calculate min attribute for input
  const minTimeString = minTime
    ? minTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : undefined;

  return (
    <div className="flex items-center space-x-2">
      <input
        id="time-picker"
        type="time"
        value={timeString}
        onChange={handleChange}
        min={minTimeString}
        className="rounded-md bg-secondary p-2 text-foreground"
        placeholder="HH:MM"
      />
      {showSetNowButton && (
        <button
          onClick={setToNow}
          className="rounded-md bg-primary px-3 py-2 text-sm text-background transition-colors hover:bg-opacity-90"
          title="Set to current time"
        >
          Now
        </button>
      )}
    </div>
  );
};
