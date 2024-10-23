import { useTaskContext } from "@/contexts/TaskContext";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Edit2, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Draggable } from "react-beautiful-dnd";

export default function Task({
  task,
  index,
  setRenameError,
}: {
  task: Task;
  index: number;
  setRenameError: (error: string | null) => void;
}) {
  const { deleteTask, renameTask } = useTaskContext();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTaskContent, setEditedTaskContent] = useState<string>("");
  const [originalTaskContent, setOriginalTaskContent] = useState<string>(""); // New state to store original content
  const editInputRef = useRef<HTMLInputElement>(null);

  // Trigger when the user clicks the edit button
  const handleEditClick = (taskId: string, content: string) => {
    setEditingTaskId(taskId);
    setEditedTaskContent(content);
    setOriginalTaskContent(content); // Store the original content
    setRenameError(null);
  };

  // Effect to focus on edit input when entering edit mode
  useEffect(() => {
    if (editingTaskId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingTaskId]);

  // Handle edit input change
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTaskContent(e.target.value);
    setRenameError(null);
  };

  // Trigger when the user presses enter or escape in edit input
  const handleEditKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleEditSave();
    } else if (e.key === "Escape") {
      handleEditCancel();
    }
  };

  // Update the handleEditSave function
  const handleEditSave = () => {
    if (editingTaskId && editedTaskContent.trim()) {
      const error = renameTask(editingTaskId, editedTaskContent.trim());
      if (error) {
        setRenameError(error);
        // Keep focus on the input field when there's an error
        editInputRef.current?.focus();
      } else {
        setEditingTaskId(null);
        setRenameError(null);
      }
    }
  };

  // Handle edit cancel
  const handleEditCancel = () => {
    setEditingTaskId(null);
    setEditedTaskContent(originalTaskContent); // Revert to original content
    setRenameError(null);
  };

  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            snapshot.isDragging ? "z-50 bg-background" : "z-0 bg-background",
            "rounded p-3 shadow-sm transition-shadow hover:shadow-md",
            "flex items-center justify-between",
          )}
        >
          <div className="flex w-full items-center justify-between">
            {editingTaskId === task.id ? (
              <input
                ref={editInputRef}
                type="text"
                value={editedTaskContent}
                onChange={handleEditInputChange}
                onBlur={handleEditSave}
                onKeyDown={handleEditKeyPress}
                className="w-full flex-grow bg-secondary p-1 text-foreground"
                aria-label="Edit task"
              />
            ) : (
              <span className="mr-2 flex-grow truncate">{task.content}</span>
            )}
            <div className="flex flex-shrink-0 space-x-2">
              <button
                onClick={() => handleEditClick(task.id, task.content)}
                className="text-foreground opacity-50 transition-opacity hover:opacity-100"
                aria-label="Edit task"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-foreground opacity-50 transition-opacity hover:opacity-100"
                aria-label="Delete task"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </li>
      )}
    </Draggable>
  );
}
