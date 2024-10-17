interface ButtonPauseProps {
  onToggle: (value: boolean) => void;
  isActive: boolean;
}

export const ButtonPause: React.FC<ButtonPauseProps> = ({
  onToggle,
  isActive,
}) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-2xl font-semibold">Pomodoro Day Timeline</h2>
      <button
        type="button"
        onClick={() => onToggle(!isActive)}
        className="rounded bg-primary px-4 py-2 text-white transition-colors hover:bg-opacity-90"
      >
        {isActive ? "Hide Pauses" : "Show Pauses"}
      </button>
    </div>
  );
};
