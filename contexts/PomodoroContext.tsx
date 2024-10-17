"use client";

import React, { createContext, ReactNode, useContext, useReducer } from "react";
import { PomodoroState } from "../lib/types";

type PomodoroAction =
  | { type: "SET_POMODORO_DURATION"; payload: number }
  | { type: "SET_PAUSE_DURATION"; payload: number }
  | { type: "SET_START_TIME"; payload: string }
  | { type: "SET_END_TIME"; payload: string };

const initialState: PomodoroState = {
  pomodoroDuration: 25,
  pauseDuration: 5,
  startTime: "09:00",
  endTime: "17:00",
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
    default:
      return state;
  }
}

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(pomodoroReducer, initialState);

  return (
    <PomodoroContext.Provider value={{ state, dispatch }}>
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoroContext() {
  const context = useContext(PomodoroContext);

  if (context === undefined) {
    throw new Error(
      "usePomodoroContext must be used within a PomodoroProvider",
    );
  }

  return context;
}
