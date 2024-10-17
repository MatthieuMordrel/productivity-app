interface SettingsProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}

export const NumberSetting: React.FC<SettingsProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
}) => (
  <div className="mb-4 flex items-center justify-between">
    <label className="text-lg font-medium">{label}</label>

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
        className="w-16 rounded-l-md bg-secondary p-2 text-right text-foreground"
      />

      <span className="rounded-r-md bg-primary p-2 text-background">min</span>
    </div>
  </div>
);
