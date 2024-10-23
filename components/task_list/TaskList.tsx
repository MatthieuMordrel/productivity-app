"use client";

import { useTaskContext } from "@/contexts/TaskContext";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import Task from "./Task";
import TaskTooltipInfo from "./TaskTooltipInfo";

const TaskList: React.FC = () => {
  const { tasks, addTask } = useTaskContext();
  const [newTask, setNewTask] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [renameError, setRenameError] = useState<string | null>(null);

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

  return (
    <div className="w-96 rounded-xl bg-background p-6 shadow-lg">
      <h3 className="mb-4 flex items-center justify-between text-lg font-semibold">
        Tasks
        <TaskTooltipInfo />
      </h3>

      <div className="mx-auto max-w-md bg-background p-4 text-foreground">
        {/* Add new task form */}
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="space-y-2">
            <input
              type="text"
              value={newTask}
              onChange={handleInputChange}
              placeholder="Enter a new task"
              className={cn(
                "w-full rounded border bg-secondary p-2 text-foreground",
                error ? "border-red-500" : "border-gray-200",
              )}
            />
            <div className="h-6">
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>
          <button
            type="submit"
            className="mt-2 w-full rounded bg-primary p-2 text-white transition-colors hover:bg-opacity-90"
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
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {tasks.map((task, index) => (
                <Task
                  key={task.id}
                  task={task}
                  index={index}
                  setRenameError={setRenameError}
                />
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>

        {/* Move renameError below the task list */}
        {renameError && (
          <div className="mt-4 text-sm text-red-500" role="alert">
            {renameError}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
