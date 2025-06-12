"use client";

import { useState } from 'react';
import { useGoals } from '@/contexts/GoalsContexts';
import { isPlantDue } from '@/lib/growthLogic';
import AppHeader from '@/components/layout/AppHeader';
import { ArrowPathIcon, SunIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

// =================================================================================
// --- FILE: /app/today/page.tsx (Updated) ---
// This file now uses the unified `Plant` data model and the `isPlantDue` helper.
// =================================================================================

export default function TodayPage() {
  // Functions renamed in context: `goals` is now `plants`, `tendToGoal` is `tendToPlant`
  const { plants, tendToPlant } = useGoals();

  // Filter the plants to get only the ones that are due today using the new helper
  const todaysIntentions = plants.filter(isPlantDue);

  // State management for the current card remains the same
  const [currentIndex] = useState(0);

  const handleAcknowledge = () => {
    // Ensure we're acknowledging the correct plant
    const currentPlant = todaysIntentions[safeIndex];
    if (currentPlant) {
        // Call the updated context function
        tendToPlant(currentPlant.id);
    }
    // The list will re-filter on the next render, automatically advancing the card
    // or showing the empty state.
  };

  if (todaysIntentions.length === 0) {
    return (
       <div className="min-h-screen bg-background flex flex-col">
          <AppHeader />
          <main className="flex-1 flex flex-col items-center justify-center p-6 text-center text-text-muted">
            <h2 className="text-2xl font-display mb-2">It&apos;s a quiet day.</h2>
            <p>Nothing needs tending right now.</p>
        </main>
       </div>
    );
  }
  
  // Ensure we don't go out of bounds if the list changes after tending
  const safeIndex = currentIndex >= todaysIntentions.length ? todaysIntentions.length - 1 : currentIndex;
  const currentIntention = todaysIntentions[safeIndex];
  
  // Return null if for any reason the current intention is not found (e.g., last item was just tended)
  if (!currentIntention) {
    return (
       <div className="min-h-screen bg-background flex flex-col">
          <AppHeader />
          <main className="flex-1 flex flex-col items-center justify-center p-6 text-center text-text-muted">
            <h2 className="text-2xl font-display mb-2">It&apos;s a quiet day.</h2>
            <p>Nothing needs tending right now.</p>
        </main>
       </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      <AppHeader />
      <main className="flex-1 flex flex-col items-center p-6 pt-12 md:pt-20">
        <motion.div 
            // Using the plant's ID as a key ensures the component re-animates when the plant changes
            key={currentIntention.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg mx-auto"
        >
            <div className="text-center">
                <div className="inline-block p-4 bg-primary/10 rounded-full">
                    <SunIcon className="w-12 h-12 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-display text-primary mt-4">
                    Ready to tend to <br/> <span className="text-text">{currentIntention.intention}?</span>
                </h2>
                <p className="text-text-muted mt-2">{currentIntention.rhythm.primary}</p>
            </div>
            <div className="my-12">
                <label htmlFor="reflection" className="text-lg font-bold font-display text-text/80 mb-2 block text-center">
                    How did your practice feel today?
                </label>
                <textarea 
                    id="reflection"
                    placeholder="A moment for reflection..." 
                    className="w-full h-32 p-4 border-2 border-border rounded-2xl bg-white shadow-inner focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                    rows={4}
                />
            </div>
            <div className="text-center">
                <button 
                    onClick={handleAcknowledge}
                    className="group relative px-10 py-5 text-lg font-bold font-display text-background rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50 overflow-hidden"
                >
                    <span className="absolute top-0 left-0 w-full h-full bg-white/20 transform-gpu scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-in-out origin-bottom" />
                    <span className="relative z-10 flex items-center gap-2">
                        <ArrowPathIcon className="w-5 h-5" />
                        Acknowledge this moment
                    </span>
                </button>
            </div>
        </motion.div>
      </main>
    </div>
  );
}
