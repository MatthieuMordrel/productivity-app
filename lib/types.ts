export interface Session {
  start: Date;
  end: Date;
  type: "work" | "pause";
}

export interface PomodoroState {
  pomodoroDuration: number;
  pauseDuration: number;
  startTime: string;
  endTime: string;
}

export interface TimeSegment {
  start: Date;
  end: Date;
  type: "work" | "pause" | "empty";
  percentage: number;
}

export interface HourBlock {
  hour: Date;
  segments: TimeSegment[];
}

// Define the Task interface
export interface Task {
  id: string;
  content: string;
}
