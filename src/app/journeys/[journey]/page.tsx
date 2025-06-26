"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { getJourneyById } from "@/data/journeys";

export default function JourneyPage() {
  const { journey } = useParams();
  const journeyData = getJourneyById(journey as string);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (journey) {
      const savedProgress = localStorage.getItem(`journey-progress-${journey}`);
      if (savedProgress) {
        try {
          const parsed = JSON.parse(savedProgress);
          if (Array.isArray(parsed)) {
            setCompletedStages(parsed);
          }
        } catch (e) {
          console.error("Failed to parse journey progress", e);
        }
      }
    }
  }, [journey]);

  const handleCompleteStage = (index: number) => {
    if (!completedStages.includes(index)) {
      const updated = [...completedStages, index];
      setCompletedStages(updated);
      localStorage.setItem(`journey-progress-${journey}`, JSON.stringify(updated));
    }
  };

  if (!mounted) return null;

  if (!journeyData) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        Journey not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1c1c2c] to-[#0f0f1a] p-6 text-white">
      <h1 className="text-4xl font-semibold mb-8" style={{ color: journeyData.color }}>
        🛤️ {journeyData.title}
      </h1>

      <div className="relative space-y-12">
        {journeyData.stages.map((stage, index) => {
          const completed = completedStages.includes(index);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className={`p-6 rounded-2xl shadow-lg border border-white/10 relative backdrop-blur-md transition-all duration-300 ${
                completed ? "border-l-4 border-[#fff3] ring-2 ring-white/10" : ""
              }`}
            >
              <h2 className="text-xl font-bold mb-2">{stage.title}</h2>
              <blockquote className="italic text-sm text-white/80 mb-4">
                “{stage.quote}”
              </blockquote>
              <div className="mb-2">
                <strong>Grounding Practice:</strong> {stage.grounding}
              </div>
              <div className="mb-2">
                <strong>Reflection Prompt:</strong> {stage.reflection}
              </div>
              {stage.practice && (
                <div className="mb-4">
                  <strong>Optional Practice:</strong> {stage.practice}
                </div>
              )}
              <button
                onClick={() => handleCompleteStage(index)}
                className={`mt-2 rounded-xl px-4 py-2 text-sm transition ${
                  completed ? "bg-green-800/20 cursor-default" : "bg-white/10 hover:bg-white/20"
                }`}
                disabled={completed}
              >
                {completed ? "🌟 Stage Completed" : "🌿 Tend this stage"}
              </button>
              {completed && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full animate-pulse" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
