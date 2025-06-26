// src/lib/types.ts
export type SystemStage = "planted" | "sprouted" | "blooming" | "radiant";

export interface SystemLog {
  id: number; 
  date: string;
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
  lastTended: string;
  createdAt: Date;
  logs: SystemLog[];
}