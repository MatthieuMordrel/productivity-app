"use client";

import React, { createContext, ReactNode, useContext, useReducer } from "react";
import { Break, PomodoroState } from "../lib/types";

type PomodoroAction =
  | { type: "SET_POMODORO_DURATION"; payload: number }
  | { type: "SET_PAUSE_DURATION"; payload: number }
  | { type: "SET_START_TIME"; payload: Date }
  | { type: "SET_END_TIME"; payload: Date }
  | { type: "ADD_BREAK"; payload: Break }
  | { type: "REMOVE_BREAK"; payload: number }
  | { type: "UPDATE_BREAK"; payload: { index: number; break: Break } }
  | { type: "RESET_SETTINGS" };

const initialState: PomodoroState = {
  pomodoroDuration: 45,
  pauseDuration: 10,
  startTime: new Date(new Date().setHours(9, 0, 0, 0)),
  endTime: new Date(new Date().setHours(17, 0, 0, 0)),
  breaks: [], // Initialize with an empty array of breaks
};

const PomodoroContext = createContext<
  | {
      state: PomodoroState;
      dispatch: React.Dispatch<PomodoroAction>;
    }
  | undefined
>(undefined);

function pomodoroReducer(
  state: PomodoroState,
  action: PomodoroAction,
): PomodoroState {
  switch (action.type) {
    case "SET_POMODORO_DURATION":
      return { ...state, pomodoroDuration: action.payload };

    case "SET_PAUSE_DURATION":
      return { ...state, pauseDuration: action.payload };

    case "SET_START_TIME":
      return { ...state, startTime: action.payload };

    case "SET_END_TIME":
      return { ...state, endTime: action.payload };

    // Handle adding a new break to the state
    case "ADD_BREAK":
      // Create a new array with all existing breaks plus the new one
      return { ...state, breaks: [...state.breaks, action.payload] };

    // Handle removing a break from the state
    case "REMOVE_BREAK":
      return {
        ...state,
        // Filter out the break at the specified index
        breaks: state.breaks.filter((_, index) => index !== action.payload),
      };

    case "UPDATE_BREAK":
      return {
        ...state,
        breaks: state.breaks.map((breakItem, index) =>
          index === action.payload.index ? action.payload.break : breakItem,
        ),
      };
    case "RESET_SETTINGS":
      return initialState;
    default:
      return state;
  }
}

// Add function to load initial state from localStorage or use default
const loadInitialState = (): PomodoroState => {
  if (typeof window === "undefined") return initialState;

  const savedState = localStorage.getItem("pomodoroSettings");
  if (!savedState) return initialState;

  // Parse the saved state
  const parsedState = JSON.parse(savedState);

  // Convert string dates back to Date objects
  return {
    ...parsedState,
    startTime: new Date(parsedState.startTime),
    endTime: new Date(parsedState.endTime),
    breaks: parsedState.breaks.map((breakItem: Break) => ({
      ...breakItem,
      start: new Date(breakItem.start),
      end: new Date(breakItem.end),
    })),
  };
};

export function PomodoroProvider({ children }: { children: ReactNode }) {
  // Initialize with loaded state
  const [state, dispatch] = useReducer(pomodoroReducer, null, loadInitialState);

  // Save to localStorage whenever state changes
  React.useEffect(() => {
    localStorage.setItem("pomodoroSettings", JSON.stringify(state));
  }, [state]);

  return (
    <PomodoroContext.Provider value={{ state, dispatch }}>
      {children}
    </PomodoroContext.Provider>
  );
}

export function useSettingsContext() {
  const context = useContext(PomodoroContext);
  if (context === undefined) {
    throw new Error(
      "useSettingsContext must be used within a PomodoroProvider",
    );
  }

  return context;
}
