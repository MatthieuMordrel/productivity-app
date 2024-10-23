import { useTaskContext } from "@/contexts/TaskContext";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Edit2, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Draggable } from "react-beautiful-dnd";

export default function Task({ task, index }: { task: Task; index: number }) {
  const { deleteTask, renameTask } = useTaskContext();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTaskContent, setEditedTaskContent] = useState<string>("");
  const editInputRef = useRef<HTMLInputElement>(null);

  // Effect to focus on edit input when entering edit mode
  useEffect(() => {
    if (editingTaskId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingTaskId]);

  // Handle edit save
  const handleEditSave = () => {
    if (editingTaskId && editedTaskContent.trim()) {
      renameTask(editingTaskId, editedTaskContent.trim());
      setEditingTaskId(null);
    }
  };

  // Handle edit cancel
  const handleEditCancel = () => {
    setEditingTaskId(null);
  };

  // Handle edit mode activation
  const handleEditClick = (taskId: string, content: string) => {
    setEditingTaskId(taskId);
    setEditedTaskContent(content);
  };

  // Handle edit input change
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTaskContent(e.target.value);
  };

  // Handle key press in edit input
  const handleEditKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleEditSave();
    } else if (e.key === "Escape") {
      handleEditCancel();
    }
  };

  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            snapshot.isDragging ? "bg-primary" : "bg-secondary",
            "rounded p-3 shadow-sm transition-shadow hover:shadow-md",
          )}
        >
          <div className="flex items-center justify-between">
            {editingTaskId === task.id ? (
              <input
                ref={editInputRef}
                type="text"
                value={editedTaskContent}
                onChange={handleEditInputChange}
                onBlur={handleEditSave}
                onKeyDown={handleEditKeyPress}
                className="flex-grow bg-secondary p-1 text-foreground"
                aria-label="Edit task"
              />
            ) : (
              <span>{task.content}</span>
            )}
            <div className="flex space-x-2">
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
