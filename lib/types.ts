export interface PomodoroState {
  pomodoroDuration: number;
  pauseDuration: number;
  startTime: Date;
  endTime: Date;
  breaks: Break[];
}

export interface Break {
  start: Date;
  end: Date;
}

export type SessionType = "Work" | "Pause" | "Break";
export interface Session {
  id: string;
  start: Date;
  end: Date;
  type: SessionType;
  taskTitle: string;
  taskId: string;
  index: number;
}

export interface Task {
  id: string;
  content: string;
}
