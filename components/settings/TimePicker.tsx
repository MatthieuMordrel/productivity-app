import React from "react";

interface TimePickerProps {
  value: Date;
  onChange: (value: Date) => void;
}

export const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
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
    // Update the state with the new Date object
    onChange(newDate);
  };

  return (
    <>
      <label htmlFor="time-picker" className="sr-only">
        Select time
      </label>
      <input
        id="time-picker"
        type="time"
        value={timeString}
        onChange={handleChange}
        className="rounded-md bg-secondary p-2 text-foreground"
        placeholder="HH:MM"
      />
    </>
  );
};
