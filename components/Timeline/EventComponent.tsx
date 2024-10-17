import { Session } from "@/lib/types";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

// Define the UpdatedTitle type
// type UpdatedTitle = {
//   taskTitle: string;
//   index: number;
// };

export const EventComponent = ({
  event,
  onUpdate,
}: {
  event: Session;
  onUpdate: React.Dispatch<React.SetStateAction<Session[]>>;
}) => {
  console.log("EventComponent rerendered");
  // State to manage the editable task title
  const [taskTitle, setTaskTitle] = useState(event.taskTitle);

  // State to manage updatedTitles

  // Create a debounced version of the update function using useDebouncedCallback
  const debouncedUpdate = useDebouncedCallback(
    (newTitle: string) => {
      onUpdate((prevSessions) => {
        return prevSessions.map((session) =>
          session.id === event.id
            ? { ...session, taskTitle: newTitle }
            : session,
        );
      });
    },
    // Delay in ms
    300,
    // Options object
    { maxWait: 2000 },
  );

  // Update the local state and the parent state
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleTitleChange called");
    const newTitle = e.target.value;
    setTaskTitle(newTitle);
    debouncedUpdate(newTitle);
  };

  return (
    <div className="rounded-md bg-secondary p-2 text-xs shadow-sm">
      <div className="flex items-center space-x-2">
        <span className="text-foreground">Task:</span>
        <input
          aria-label="Task"
          type="text"
          value={taskTitle}
          onChange={handleTitleChange}
          className="rounded border border-primary bg-background px-1 py-0.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      {/* Add more event details here if needed */}
    </div>
  );
};
