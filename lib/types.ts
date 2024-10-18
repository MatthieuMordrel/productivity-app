export interface PomodoroState {
  pomodoroDuration: number;
  pauseDuration: number;
  startTime: Date;
  endTime: Date;
}

export interface Session {
  id: string;
  start: Date;
  end: Date;
  type: "Work" | "Pause";
  taskTitle: string;
  index: number;
}

export interface Task {
  id: string;
  content: string;
}
