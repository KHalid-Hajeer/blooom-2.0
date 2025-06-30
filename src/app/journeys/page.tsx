"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { journeys } from "../../data/journeys";
import { motion } from "framer-motion";
import { useAuth } from "../AuthContext";
import { supabase } from "../../lib/supabaseClient";
import OnboardingNextButton from "../../components/ui/OnboardingNextButton";

interface ProgressMap {
  [id: string]: number;
}

export default function ChooseJourneyPage() {
  const { user } = useAuth();
  const [progressMap, setProgressMap] = useState<ProgressMap>({});
  const [loading, setLoading] = useState(true);
  const [isOnboarding, setIsOnboarding] = useState(false);

  const calculateProgress = useCallback((journeyId: string, completedStages: number[] | null) => {
    const journey = journeys.find(j => j.id === journeyId);
    if (!journey || !completedStages || completedStages.length === 0) return 0;
    return (completedStages.length / journey.stages.length) * 100;
  }, []);
  
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      const { data, error } = await supabase
        .from('journey_progress')
        .select('journey_id, completed_stages')
        .eq('user_id', user.id);
        
      if (error) {
        console.error("Error fetching journey progress:", error);
        setLoading(false);
        return;
      }
      
      const newProgressMap: ProgressMap = {};
      journeys.forEach(j => {
        const progress = data.find(p => p.journey_id === j.id);
        newProgressMap[j.id] = calculateProgress(j.id, progress?.completed_stages || []);
      });
      setProgressMap(newProgressMap);
      setLoading(false);
    };

    fetchProgress();

    // Check if the user is in the "Journey" onboarding step.
    const step = localStorage.getItem('onboardingStep');
    if (step === '1') {
      setIsOnboarding(true);
    }
  }, [user, calculateProgress]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101019] to-[#1c1c2c] p-6 text-white flex flex-col">
      {/* If in onboarding, show the Next button to advance to step 2. */}
      {isOnboarding && <OnboardingNextButton nextStep={2} nextPath="/hub" />}

      {!isOnboarding && (
        <nav className="absolute top-4 left-4 z-10">
            <Link href="/hub" className="text-white/70 hover:text-white transition">
              ← Back to Hub
            </Link>
        </nav>
      )}

      <div className="flex-grow flex flex-col items-center justify-center pt-16">
        <h1 className="text-white text-4xl mb-12 font-semibold text-center">
            🌌 Choose Your Journey
        </h1>

        {/* If in onboarding, display a specific prompt. */}
        {isOnboarding && (
            <p className="text-center text-lg text-yellow-300 mb-8 animate-pulse">
                Explore a journey, then click Next when you&apos;re ready.
            </p>
        )}

        {loading ? (
          <p>Loading journeys...</p>
        ) : (
          <div className="flex flex-wrap gap-8 items-center justify-center">
              {journeys.map((journey) => (
              <motion.div
                  key={journey.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative inline-block w-full max-w-xs p-6 bg-white/5 rounded-2xl shadow-md border border-white/10 text-white hover:shadow-lg transition-all"
              >
                  <Link href={`/journeys/${journey.id}`} className="block w-full h-full">
                    <div className="flex flex-col h-full justify-between">
                      <h2
                        className="text-xl font-bold mb-2"
                        style={{ color: journey.color }}
                      >
                        🛤️ {journey.title}
                      </h2>
                      <div className="mt-4 text-white/70 text-sm">
                        {journey.stages.length} stages of gentle transformation
                      </div>
                      <div className="mt-6 h-2 w-full bg-white/10 rounded-full">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${progressMap[journey.id] || 0}%`, backgroundColor: journey.color }}
                        />
                      </div>
                    </div>
                  </Link>
              </motion.div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}