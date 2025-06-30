"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getJourneyById } from "../../../data/journeys";
import { useAuth } from "../../AuthContext";
import { supabase } from "../../../lib/supabaseClient";

export default function JourneyPage() {
  const { user } = useAuth();
  const { journey } = useParams();
  const journeyData = getJourneyById(journey as string);

  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!user || !journey) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('journey_progress')
      .select('completed_stages')
      .eq('user_id', user.id)
      .eq('journey_id', journey)
      .single();
    
    if (data?.completed_stages) {
      setCompletedStages(data.completed_stages);
    } else if (error && error.code !== 'PGRST116') { // Ignore "No rows found" error
        console.error("Error fetching progress:", error);
    }
    setLoading(false);
  }, [user, journey]);

  useEffect(() => {
    if (user) {
      fetchProgress();
    } else {
      setLoading(false);
    }
  }, [user, fetchProgress]);

  const currentStageIndex = completedStages.length;
  const isJourneyComplete = journeyData ? currentStageIndex >= journeyData.stages.length : false;
  const currentStage = journeyData && !isJourneyComplete ? journeyData.stages[currentStageIndex] : null;

  const handleCompleteStage = async () => {
    if (!user || !journeyData || !currentStage || completedStages.includes(currentStageIndex)) return;

    const updatedStages = [...completedStages, currentStageIndex];
    
    // Upsert will create or update the record
    const { error } = await supabase.from('journey_progress').upsert({
      user_id: user.id,
      journey_id: journeyData.id,
      completed_stages: updatedStages,
    }, { onConflict: 'user_id, journey_id' });

    if (error) {
      console.error("Error saving progress:", error);
    } else {
      setCompletedStages(updatedStages);
    }
  };

  useEffect(() => {
    if (completedStages.length >= 1) {
      localStorage.setItem("onboardingStep", "3");
    }
  }, [completedStages]);

  if (loading) return <div className="flex h-screen items-center justify-center text-white bg-gradient-to-b from-[#1c1c2c] to-[#0f0f1a]">Loading your journey...</div>;
  if (!journeyData) return <div className="flex h-screen items-center justify-center text-white">Journey not found.</div>;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#1c1c2c] to-[#0f0f1a] p-6 text-white pb-32">
      <h1 className="text-4xl font-semibold mb-8 text-center" style={{ color: journeyData.color }}>
        🛤️ {journeyData.title}
      </h1>

      <div className="relative max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {currentStage && (
            <motion.div
              key={currentStageIndex}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="p-6 rounded-2xl shadow-lg border border-white/10 backdrop-blur-md"
            >
              <h2 className="text-xl font-bold mb-2">{currentStage.title}</h2>
              <blockquote className="italic text-sm text-white/80 mb-4">
                “{currentStage.quote}”
              </blockquote>
              <div className="mb-2">
                <strong>Grounding Practice:</strong> {currentStage.grounding}
              </div>
              <div className="mb-2">
                <strong>Reflection Prompt:</strong> {currentStage.reflection}
              </div>
              {currentStage.practice && (
                <div className="mb-4">
                  <strong>Optional Practice:</strong> {currentStage.practice}
                </div>
              )}
              <button
                onClick={handleCompleteStage}
                className="mt-4 rounded-xl px-4 py-2 text-sm transition bg-white/10 hover:bg-white/20"
              >
                🌿 Tend this stage
              </button>
            </motion.div>
          )}

          {isJourneyComplete && (
            <motion.div
              key="completion"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="text-center p-8 bg-black/20 rounded-xl"
            >
              <h2 className="text-2xl font-bold mb-2">🌟 Journey Complete!</h2>
              <p className="text-white/80">You&apos;ve walked the path. Take a moment to honor your progress.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating button to return to the main journeys page */}
      <Link href="/journeys" passHref>
        <motion.a
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
          className={`fixed bottom-8 right-8 z-20 px-4 py-2 rounded-lg shadow-lg text-sm font-semibold transition-colors ${
            isJourneyComplete ? "bg-green-500 hover:bg-green-600 text-white" : "bg-white/20 hover:bg-white/30 text-white"
          }`}
        >
          {isJourneyComplete ? "Return to All Journeys" : "← Back to Journeys"}
        </motion.a>
      </Link>
      {localStorage.getItem("onboardingStep") === "3" && (
        <button
          onClick={() => window.location.href = "/hub"}
          className="fixed top-4 right-4 bg-white/20 text-white px-4 py-2 rounded-lg"
        >Next</button>
      )}
    </div>
  );
}