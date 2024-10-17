import React from "react";

interface TimePickerProps {
  value: string;

  onChange: (value: string) => void;
}

export const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
  return (
    <>
      <label htmlFor="time-picker" className="sr-only">
        Select time
      </label>
      <input
        id="time-picker"
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md bg-secondary p-2 text-foreground"
        placeholder="HH:MM"
      />
    </>
  );
};
