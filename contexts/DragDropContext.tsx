"use client";
import { useSessionsContext } from "@/contexts/SessionsContext";
import { DragDropContext } from "react-beautiful-dnd";

export function DragDropContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { handleDragEnd } = useSessionsContext();

  return (
    <DragDropContext onDragEnd={handleDragEnd}>{children}</DragDropContext>
  );
}
