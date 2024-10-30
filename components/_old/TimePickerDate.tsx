import { Button } from "@/components/ui/button";
import React, { useEffect, useRef } from "react";

interface TimePickerProps {
  value: Date;
  onChange: (value: Date) => void;
  showSetNowButton?: boolean;
  minTime?: Date;
  showDateToggle?: boolean;
}

export const TimePickerDate: React.FC<TimePickerProps> = ({
  value,
  onChange,
  showSetNowButton = false,
  minTime,
  showDateToggle = true,
}) => {
  // Remove isTomorrow state and add date input handling
  const dateString = value.toISOString().split("T")[0]; // Get YYYY-MM-DD format

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(value);
    const [year, month, day] = e.target.value.split("-").map(Number);
    newDate.setFullYear(year, month - 1, day);

    if (minTime && newDate <= minTime) {
      newDate.setTime(minTime.getTime() + 30 * 60000);
    }

    onChange(newDate);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(":").map(Number);
    const newDate = new Date(value);
    newDate.setHours(hours, minutes);

    if (minTime && newDate <= minTime) {
      newDate.setTime(minTime.getTime() + 30 * 60000);
    }

    onChange(newDate);
  };

  // Convert Date to HH:mm string because input type="time" only accepts strings
  const timeString = value.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const setToNow = () => {
    const now = new Date();
    onChange(now);
  };

  const [isOpen, setIsOpen] = React.useState(false);

  // Add ref for the dropdown container
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // Add event listener when dropdown is open
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative flex items-center space-x-2">
      {/* Time picker input */}
      <input
        title="Time"
        placeholder="Time"
        type="time"
        value={timeString}
        onChange={handleTimeChange}
        className="rounded-md bg-secondary p-2"
      />

      {showDateToggle && (
        <>
          {/* Date picker input */}
          <input
            title="Date"
            placeholder="Date"
            type="date"
            value={dateString}
            onChange={handleDateChange}
            className="rounded-md bg-secondary p-2"
          />
        </>
      )}
      {showSetNowButton && (
        <Button
          onClick={setToNow}
          variant="default"
          size="sm"
          title="Set to current time"
        >
          Now
        </Button>
      )}
    </div>
  );
};
