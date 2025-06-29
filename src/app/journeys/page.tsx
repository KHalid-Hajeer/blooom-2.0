"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { journeys } from "@/data/journeys";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import OnboardingNextButton from "@/components/ui/OnboardingNextButton";

export default function ChooseJourneyPage() {
  const [progressMap, setProgressMap] = useState<{ [id: string]: number }>({});
  const [isOnboarding, setIsOnboarding] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    const map: { [id: string]: number } = {};
    journeys.forEach((j) => {
      const raw = localStorage.getItem(`journey-progress-${j.id}`);
      try {
        const parsed = raw ? JSON.parse(raw) : [];
        map[j.id] = Array.isArray(parsed)
          ? (parsed.length / j.stages.length) * 100
          : 0;
      } catch {
        map[j.id] = 0;
      }
    });
    setProgressMap(map);

    const step = localStorage.getItem('onboardingStep');
    if (step === '1') {
      setIsOnboarding(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101019] to-[#1c1c2c] p-6 text-white flex flex-col">
      <nav className="absolute top-4 left-4 z-10">
          <Link href="/hub" className="text-white/70 hover:text-white transition">
            ← Back to Hub
          </Link>
      </nav>

      {isOnboarding && <OnboardingNextButton nextStep={2} nextPath="/hub" />}

      <div className="flex-grow flex flex-col items-center justify-center pt-16">
        <h1 className="text-white text-4xl mb-12 font-semibold text-center">
            🌌 Choose Your Journey
        </h1>

        {isOnboarding && (
            <p className="text-center text-lg text-yellow-300 mb-8 animate-pulse">
                Explore a journey, then click Next when you're ready.
            </p>
        )}

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
                        className="h-full rounded-full bg-white/50 transition-all duration-500"
                        style={{ width: `${progressMap[journey.id] || 0}%` }}
                      />
                    </div>
                  </div>
                </Link>
            </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
}
