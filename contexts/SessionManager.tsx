"use client";
import { useSessionManager } from "@/hooks/useSessionManager";

export default function SessionManager() {
  useSessionManager();
  return <div>SessionManager</div>;
}
