"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGoals } from "@/contexts/GoalsContexts";
import { useRouter } from "next/navigation";

import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree, { paceOptions } from "./StepThree";
import StepFour from "./StepFour";

// =================================================================================
// --- FILE: /components/onboarding/Onboarding.tsx (Updated) ---
// The `handleComplete` function now provides the data in the new, unified format.
// =================================================================================

const variants = {
  enter: (direction: number) => ({ y: direction > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { y: "0%", opacity: 1 },
  exit: (direction: number) => ({ y: direction > 0 ? "-100%" : "100%", opacity: 0 }),
};

export default function Onboarding() {
  const router = useRouter();
  const { plants, addPlant } = useGoals(); // Updated to use `addPlant`

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  
  // State for user inputs remains the same
  const [intention, setIntention] = useState("");
  const [rhythmIndex, setRhythmIndex] = useState(2);
  
  const nextStep = () => { setDirection(1); setStep(prev => prev + 1); };
  const prevStep = () => { setDirection(-1); setStep(prev => (prev > 1 ? prev - 1 : 1)); };

  /**
   * Handles the final step of onboarding.
   * It creates a new plant with all the required data points for the unified model.
   */
  const handleComplete = () => {
    // Find the next available plot ID. A simple approach for now.
    const nextPlotId = plants.length;

    // Call the updated context function with the complete data structure
    addPlant({
      intention: intention,
      rhythm: paceOptions[rhythmIndex],
      plotId: nextPlotId,
    });
    router.push('/garden');
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ y: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
          className="absolute w-full h-full"
        >
          {step === 1 && <StepOne onNext={nextStep} />}
          {step === 2 && <StepTwo onNext={nextStep} onBack={prevStep} intention={intention} setIntention={setIntention} />}
          {step === 3 && <StepThree onNext={nextStep} onBack={prevStep} rhythmIndex={rhythmIndex} setRhythmIndex={setRhythmIndex} />}
          {step === 4 && <StepFour onBack={prevStep} onComplete={handleComplete} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
