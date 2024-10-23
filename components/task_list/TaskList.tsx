"use client";

import { useTaskContext } from "@/contexts/TaskContext";
import { cn } from "@/lib/utils";
import { Edit2, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";

const TaskList: React.FC = () => {
  const { tasks, addTask, deleteTask, renameTask } = useTaskContext();
  const [newTask, setNewTask] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTaskContent, setEditedTaskContent] = useState<string>("");
  const editInputRef = useRef<HTMLInputElement>(null);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errorMessage = addTask(newTask);
    console.log("errorMessage", errorMessage);
    if (errorMessage) {
      setError(errorMessage);
    } else {
      setNewTask("");
      setError(null);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask(e.target.value);
    setError(null); // Clear error when user starts typing
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

  // Handle key press in edit input
  const handleEditKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleEditSave();
    } else if (e.key === "Escape") {
      handleEditCancel();
    }
  };

  // Effect to focus on edit input when entering edit mode
  useEffect(() => {
    if (editingTaskId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingTaskId]);

  return (
    <div className="mx-auto max-w-md bg-background p-4 text-foreground">
      {/* Add new task form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={newTask}
          onChange={handleInputChange}
          placeholder="Enter a new task"
          className={cn(
            "mb-2 w-full rounded border bg-secondary p-2 text-foreground",
            error && "border-red-500",
          )}
        />
        {error && <p className="mb-2 text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full rounded bg-primary p-2 text-white transition-colors hover:bg-opacity-90"
        >
          Add Task
        </button>
      </form>

      <Droppable
        droppableId="taskList"
        isDropDisabled={true}
        isCombineEnabled={false}
        ignoreContainerClipping={false}
      >
        {(provided, snapshot) => (
          <ul
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={cn(
              "space-y-2",
              snapshot.isUsingPlaceholder ? "bg-blue-500" : "bg-primary",
            )}
          >
            {tasks.map((task, index) => (
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
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </div>
  );
};

export default TaskList;
