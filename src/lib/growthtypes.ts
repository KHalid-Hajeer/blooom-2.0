// src/lib/types.ts

export type SystemStage = "seed" | "planted" | "sprouted" | "blooming" | "radiant";

export interface SystemLog {
  id: number;
  date: string;     // ISO timestamp of when the log was created
  note: string;
  mood: string;
}

export interface System {
  id: number;
  name: string;
  description: string;
  stage: SystemStage;
  x: number;
  y: number;
  color: string;
  lastTended?: string;   // ISO timestamp of last tending action
  createdAt: Date;
  logs: SystemLog[];
}
