import React from "react";

interface SettingsProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  presetValues?: number[]; // New prop for preset values
}

export const NumberSetting: React.FC<SettingsProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  presetValues,
}) => (
  <div className="mb-4">
    <label className="mb-2 block text-lg font-medium">{label}</label>
    <div className="flex flex-col">
      <div className="flex items-center">
        <input
          type="number"
          value={value}
          title={`Enter ${label}`}
          placeholder={`Enter ${label}`}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="w-16 rounded-l-md p-2 text-right"
        />
        <span className="rounded-r-md bg-foreground p-2 text-background">
          min
        </span>
      </div>

      {presetValues && (
        <div className="mt-1 flex space-x-1">
          {presetValues.map((preset) => (
            <button
              key={preset}
              onClick={() => onChange(preset)}
              className={`rounded px-1.5 py-0.5 text-xs transition-colors ${
                value === preset
                  ? "bg-foreground text-background"
                  : "hover:bg-opacity-80"
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
);
