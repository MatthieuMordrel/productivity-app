interface ButtonPauseProps {
  onToggle: (value: boolean) => void;
  isActive: boolean;
  label: string;
}

export const ButtonToggleSessionVisibility: React.FC<ButtonPauseProps> = ({
  onToggle,
  isActive,
  label,
}) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <button
        type="button"
        onClick={() => onToggle(!isActive)}
        className="rounded bg-primary px-4 py-2 text-white transition-colors hover:bg-opacity-90"
      >
        {isActive ? `Hide ${label}` : `Show ${label}`}
      </button>
    </div>
  );
};
