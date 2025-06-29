// src/app/onboarding/walkthrough/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { planets } from '@/lib/planets';
import SphericalCircle from '@/components/ui/SphericalCircle';
import Typewriter from '@/components/animation/typewriter';
import InteractiveGradient from '@/components/animation/interactive-gradient';

// A brief, playful description for each planet
const planetDescriptions: Record<string, string> = {
  'Garden': "First, let's create a garden. This is where you can plant systems for growth and watch them bloom.",
  'Journey': "Next, we have Journeys. These are guided paths to help you explore different aspects of yourself.",
  'Reflections': "Here are your Reflections, a space to look back on your thoughts and feelings.",
  'Companion': "This is your Companion, a safe space to chat and feel heard.",
  'Settings': "Finally, here are the Settings, where you can tune your space to feel just right."
};

export default function WalkthroughPage() {
  const router = useRouter();
  const [currentPlanetIndex, setCurrentPlanetIndex] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const currentPlanet = planets[currentPlanetIndex];

  const handleNext = () => {
    setShowButton(false);
    if (currentPlanetIndex < planets.length - 1) {
      setCurrentPlanetIndex(currentPlanetIndex + 1);
    } else {
      // Finished walkthrough, navigate to the plan selection
      router.push('/onboarding/plan');
    }
  };

  const getPlanetColor = () => {
    if (typeof window !== 'undefined') {
      return getComputedStyle(document.documentElement).getPropertyValue(currentPlanet.gradient.endVar.trim())
    }
    return '#FFFFFF';
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center text-white p-6 bg-black">
      <InteractiveGradient startColor="var(--color-heavy-start)" endColor="var(--color-heavy-end)" />

      <div className="z-10 text-center mb-12">
        <AnimatePresence mode="wait">
          <motion.h1
            key={currentPlanet.name}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.7 }}
            className="text-2xl md:text-4xl font-display mb-4"
          >
            <Typewriter 
              text={`This is your ${currentPlanet.name}.`} 
              speed={60} 
              onComplete={() => setTimeout(() => setShowButton(true), 1000)}
            />
          </motion.h1>
        </AnimatePresence>
        <motion.p 
          key={currentPlanet.name + 'desc'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-white/70 max-w-md mx-auto"
        >
          {planetDescriptions[currentPlanet.name]}
        </motion.p>
      </div>

      <div className="w-48 h-48 mb-12">
        <AnimatePresence>
          <motion.div
            key={currentPlanet.name}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 1, type: 'spring', stiffness: 80, damping: 15 }}
          >
            <SphericalCircle color={getPlanetColor()} className="w-full h-full" isRadiant={true} />
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showButton && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onClick={handleNext}
            whileTap={{ scale: 0.95 }}
            className="z-10 px-8 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
          >
            {currentPlanetIndex < planets.length - 1 ? "Next" : "Set Up Your Space"}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}