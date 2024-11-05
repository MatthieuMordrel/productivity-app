import { useTaskContext } from "@/contexts/TaskContext";
import { useTaskActions } from "@/hooks/useTaskActions";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Edit2, Trash2 } from "lucide-react";
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
  const {
    editingTaskId,
    editedTaskContent,
    editInputRef,
    handleEditClick,
    handleEditInputChange,
    handleEditKeyPress,
    handleEditSave,
  } = useTaskActions(task.id, task.content, setRenameError);

  const { deleteTask } = useTaskContext();

  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            snapshot.isDragging ? "z-50 bg-background" : "z-0 bg-card",
            "min-h-14 rounded-md p-3 shadow-sm transition-shadow hover:shadow-md",
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
                className="w-full flex-grow bg-card p-1"
                aria-label="Edit task"
              />
            ) : (
              <span className="mr-2 flex-grow truncate">{task.content}</span>
            )}
            <div className="flex flex-shrink-0 space-x-3">
              <button
                onClick={() => handleEditClick()}
                className="opacity-50 transition-opacity hover:opacity-100"
                aria-label="Edit task"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="opacity-50 transition-opacity hover:opacity-100"
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
