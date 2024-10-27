import { Button } from "@/components/ui/button";
import React, { useEffect, useRef } from "react";

interface TimePickerProps {
  value: Date;
  onChange: (value: Date) => void;
  showSetNowButton?: boolean;
  showDateToggle?: boolean; // New prop to control date toggle visibility
  minTime?: Date;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  showSetNowButton = false,
  showDateToggle = true, // Default to true to maintain backward compatibility
  minTime,
}) => {
  // Add state to track if tomorrow is selected
  const [isTomorrow, setIsTomorrow] = React.useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return value.getDate() === tomorrow.getDate();
  });

  // Convert Date to HH:mm string because input type="time" only accepts strings
  const timeString = value.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(":").map(Number);
    const newDate = new Date(value);

    // Set the date to today or tomorrow based on toggle
    const today = new Date();
    newDate.setDate(today.getDate() + (isTomorrow ? 1 : 0));
    newDate.setHours(hours, minutes);

    if (minTime && newDate <= minTime) {
      newDate.setTime(minTime.getTime() + 30 * 60000);
    }

    onChange(newDate);
  };

  const setToNow = () => {
    const now = new Date();
    setIsTomorrow(false); // Reset to today when setting to now

    if (minTime && now <= minTime) {
      now.setTime(minTime.getTime() + 30 * 60000);
    }
    onChange(now);
  };

  // Handle toggle between today and tomorrow
  const handleToggleDay = (isTomorrow: boolean) => {
    const newDate = new Date(value);
    const today = new Date();

    // Toggle the date and update state
    const newIsTomorrow = isTomorrow;
    setIsTomorrow(newIsTomorrow);

    // Adjust the date while keeping the same time
    newDate.setDate(today.getDate() + (newIsTomorrow ? 1 : 0));
    onChange(newDate);
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
    <div className="relative flex items-center space-x-1">
      <input
        id="time-picker"
        type="time"
        value={timeString}
        onChange={handleChange}
        className="rounded-md bg-secondary p-2 text-foreground"
        placeholder="HH:MM"
      />

      {showDateToggle && (
        <div className="relative" ref={dropdownRef}>
          <Button
            onClick={() => setIsOpen(!isOpen)}
            variant="default"
            size="sm"
            className="w-[36px] text-[10px]"
            title={isTomorrow ? "Tomorrow" : "Today"}
          >
            {isTomorrow ? "T+1" : "T"}
          </Button>

          {/* Dropdown menu */}
          {isOpen && (
            <div className="absolute right-0 top-full z-50 mt-1 w-24 rounded-md bg-secondary py-1 shadow-lg">
              <Button
                onClick={() => {
                  handleToggleDay(false);
                  setIsOpen(false);
                }}
                variant="ghost"
                className={`h-auto w-full justify-start px-3 py-1.5 text-xs ${
                  !isTomorrow ? "text-primary" : "text-foreground"
                }`}
              >
                Today
              </Button>
              <Button
                onClick={() => {
                  handleToggleDay(true);
                  setIsOpen(false);
                }}
                variant="ghost"
                className={`h-auto w-full justify-start px-3 py-1.5 text-xs ${
                  isTomorrow ? "text-primary" : "text-foreground"
                }`}
              >
                Tomorrow
              </Button>
            </div>
          )}
        </div>
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
