"use client";

import { useTaskContext } from "@/contexts/TaskContext";
import { Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react"; // Import the trash icon
import React, { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";

const TaskList: React.FC = () => {
  const { tasks, setTasks } = useTaskContext();
  const [newTask, setNewTask] = useState<string>("");

  // Handle adding a new task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim() !== "") {
      const task: Task = {
        id: Date.now().toString(),
        content: newTask.trim(),
      };
      setTasks((prevTasks) => [...prevTasks, task]);
      setNewTask("");
    }
  };

  // Handle deleting a task
  const handleDeleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  return (
    <div className="mx-auto max-w-md bg-background p-4 text-foreground">
      <h2 className="mb-4 text-2xl font-bold">Task List</h2>

      {/* Add new task form */}
      <form onSubmit={handleAddTask} className="mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task"
          className="mb-2 w-full rounded border bg-secondary p-2 text-foreground"
        />
        <button
          type="submit"
          className="w-full rounded bg-primary p-2 text-white transition-colors hover:bg-opacity-90"
        >
          Add Task
        </button>
      </form>

      <Droppable droppableId="taskList" isDropDisabled={true}>
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
                      <span>{task.content}</span>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-foreground opacity-50 transition-opacity hover:opacity-100"
                        aria-label="Delete task"
                      >
                        <Trash2 size={18} />
                      </button>
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
