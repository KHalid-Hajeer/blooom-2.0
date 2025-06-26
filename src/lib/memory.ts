import { v4 as uuidv4 } from 'uuid';

export type MemoryType = "reflection" | "mood" | "chat" | "journey" | "goal" | "anchor";

export interface Memory {
  id: string;
  type: MemoryType;
  title?: string;
  content: string;
  tags?: string[];
  mood?: string;
  timestamp: string;
  intensity?: number; // 0-1
  coordinates: { x: number; y: number }; // World coordinates
}

// --- Mock Data ---
const initialMemories: Memory[] = [
    {
        id: uuidv4(),
        type: 'reflection',
        title: 'First Light',
        content: 'Realized that not every thought needs to be held onto. Some can just pass by, like clouds. It felt freeing.',
        mood: 'peaceful',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        intensity: 0.8,
        coordinates: { x: 250, y: -150 }
    },
    {
        id: uuidv4(),
        type: 'journey',
        title: 'Anger Release',
        content: 'Completed the grounding exercise for anger. It was difficult at first, but letting go of the words felt like releasing a weight.',
        mood: 'relieved',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        intensity: 0.9,
        coordinates: { x: -200, y: 200 }
    },
     {
        id: uuidv4(),
        type: 'mood',
        title: 'A moment of calm',
        content: 'Felt a wave of calm wash over me this afternoon.',
        mood: 'calm',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
        intensity: 0.6,
        coordinates: { x: 100, y: 300 }
    }
];


// --- Memory Store ---
// A singleton class to manage memories, simulating a database with localStorage.
class MemoryStoreSingleton {
  private memories: Memory[] = [];
  private readonly STORAGE_KEY = 'bloom_memories';

  constructor() {
    this.loadMemories();
  }

  private loadMemories() {
    try {
      const storedMemories = localStorage.getItem(this.STORAGE_KEY);
      if (storedMemories) {
        this.memories = JSON.parse(storedMemories);
      } else {
        // If no stored memories, initialize with mock data
        this.memories = initialMemories;
        this.saveMemories();
      }
    } catch (error) {
      console.error("Could not load memories from localStorage", error);
      this.memories = initialMemories;
    }
  }

  private saveMemories() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.memories));
    } catch (error) {
      console.error("Could not save memories to localStorage", error);
    }
  }

  public getMemories(): Memory[] {
    return this.memories;
  }

  public addMemory(memoryData: Omit<Memory, 'id' | 'timestamp' | 'coordinates'>): Memory {
    const newMemory: Memory = {
      ...memoryData,
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      // New memories appear near the center
      coordinates: {
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 100
      }
    };
    this.memories.push(newMemory);
    this.saveMemories();
    return newMemory;
  }

  public getMemory(id: string): Memory | undefined {
    return this.memories.find(m => m.id === id);
  }
}

// Export a single instance of the store
export const MemoryStore = new MemoryStoreSingleton();