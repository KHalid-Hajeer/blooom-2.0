"use client";

import React, { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import {
    type Plant,
    calculateNewGrowthScore
} from '@/lib/growthLogic';

interface GoalsContextType {
  plants: Plant[];
  isLoading: boolean;
  addPlant: (newPlantData: Omit<Plant, 'id' | 'growthScore' | 'creationDate' | 'lastTendedDate' | 'tendingHistory'>) => void;
  tendToPlant: (plantId: string) => void;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

const STORAGE_KEY = 'bloom-garden-data';

export function GoalsProvider({ children }: { children: ReactNode }) {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Effect to load data from local storage on client-side only.
  useEffect(() => {
    try {
      const savedData = window.localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        setPlants(JSON.parse(savedData));
      }
    } catch (error) {
      console.error("Error reading from local storage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect to save data back to local storage whenever plants array changes.
  useEffect(() => {
    if (!isLoading) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plants));
      } catch (error) {
        console.error("Error writing to local storage", error);
      }
    }
  }, [plants, isLoading]);


  const addPlant = (newPlantData: Omit<Plant, 'id' | 'growthScore' | 'creationDate' | 'lastTendedDate' | 'tendingHistory'>) => {
    const now = new Date();
    const pastDate = new Date(now.getTime() - (25 * 60 * 60 * 1000));

    // New ID Generation: Find the highest existing ID and add 1.
    const newId = plants.length > 0
      ? Math.max(...plants.map(p => parseInt(p.id, 10))) + 1
      : 1;

    const plantToAdd: Plant = {
      ...newPlantData,
      id: newId.toString(),
      growthScore: 0,
      creationDate: now.toISOString(),
      lastTendedDate: pastDate.toISOString(),
      tendingHistory: [], // <-- Ensure this is initialized!
    };

    setPlants(prevPlants => [...prevPlants, plantToAdd]);
  };

  const tendToPlant = (plantId: string) => {
    setPlants(prevPlants =>
      prevPlants.map(plant => {
        if (plant.id === plantId) {
          const newGrowthScore = calculateNewGrowthScore(plant);
          const todayISO = new Date().toISOString();
          return {
            ...plant,
            growthScore: newGrowthScore,
            lastTendedDate: todayISO,
            tendingHistory: [...(plant.tendingHistory || []), todayISO],
          };
        }
        return plant;
      })
    );
  };

  return (
    <GoalsContext.Provider value={{ plants, isLoading, addPlant, tendToPlant }}>
      {children}
    </GoalsContext.Provider>
  );
}

export function useGoals() {
  const context = useContext(GoalsContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalsProvider');
  }
  return context;
}