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

export interface Session {
  id: string;
  start: Date;
  end: Date;
  type: "Work" | "Pause" | "Break";
  taskTitle: string;
  index: number;
}

export interface Task {
  id: string;
  content: string;
}
