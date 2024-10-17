// Tooltip component to display session information
export const Tooltip = ({
  content,
  position,
}: {
  content: string;
  position: { x: number; y: number };
}) => {
  return (
    <div
      className="fixed z-10 rounded border border-red-500 bg-gray-800 p-2 text-sm text-white"
      style={{ left: position.x, top: position.y }}
    >
      {content}
    </div>
  );
};
