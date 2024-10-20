import { Session } from "@/lib/types";
import { useEventComponent } from "@hooks/useEventComponent";
import { useEffect, useRef, useState } from "react";
import { Droppable } from "react-beautiful-dnd";

export const EventComponent = ({
  event,
  onUpdateSession,
  onDeleteSession,
  isFocused,
  onBlur,
}: {
  event: Session;
  onUpdateSession: (updatedSession: Session) => void;
  onDeleteSession: (sessionId: string) => void;
  isFocused: boolean;
  onBlur: () => void;
}) => {
  const { taskTitle, handleTitleChange, handleDelete } = useEventComponent(
    event,
    onUpdateSession,
    onDeleteSession,
    isFocused,
    onBlur,
  );

  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Effect to focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEditStart = () => {
    setIsEditing(true);
  };

  const handleEditEnd = () => {
    setIsEditing(false);
    onBlur();
  };

  return (
    <Droppable droppableId={`event_${event.id}`}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="relative h-full rounded-md p-2 shadow-sm"
        >
          <button
            type="button"
            onClick={handleDelete}
            className="absolute right-2 top-2 text-foreground opacity-50 hover:opacity-100 focus:outline-none"
            aria-label="Delete session"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="red"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>

          <div className="flex h-1/4 space-x-2">
            {isEditing ? (
              <input
                ref={inputRef}
                aria-label="Task"
                type="text"
                value={taskTitle}
                onChange={handleTitleChange}
                onBlur={handleEditEnd}
                onKeyDown={(e) => e.key === "Enter" && handleEditEnd()}
                className="w-full rounded-md border border-secondary bg-inherit px-2 py-1 text-xl text-foreground focus:outline-none"
              />
            ) : (
              <div
                onClick={handleEditStart}
                className="w-full cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap rounded-md border border-primary bg-inherit px-2 py-1 text-xl text-foreground"
              >
                {taskTitle || "Click to edit"}
              </div>
            )}
          </div>

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
