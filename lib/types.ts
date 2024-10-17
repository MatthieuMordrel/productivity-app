export interface Session {
  id: string;
  start: Date;
  end: Date;
  type: "Work" | "Pause";
}

export interface PomodoroState {
  pomodoroDuration: number;
  pauseDuration: number;
  startTime: Date;
  endTime: Date;
}

export interface TimeSegment {
  start: Date;
  end: Date;
  type: "Work" | "Pause" | "Empty";
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
