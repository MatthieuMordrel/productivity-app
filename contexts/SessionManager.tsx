"use client";
import { useSessionManager } from "@/lib/hooks/useSessionManager";

/**
 * SessionManager Component
 *
 * This component is used to manage the current session.
 */
export default function SessionManager() {
  useSessionManager();
  return null;
}
