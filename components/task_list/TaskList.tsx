"use client";

import { useTaskContext } from "@/contexts/TaskContext";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { Info } from "lucide-react";
import React, { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { Button } from "../ui/button";
import Task from "./Task";

const TaskList: React.FC = () => {
  const { tasks, addTask } = useTaskContext();
  const [newTask, setNewTask] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

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
    <div className="rounded-xl bg-background p-6 shadow-lg">
      <h3 className="mb-4 flex items-center justify-between text-lg font-semibold">
        Tasks
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Drag and drop tasks to reorder</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </h3>

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
                <Task key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </div>
    </div>
  );
};

export default TaskList;
