"use client";

import { motion} from "framer-motion";
import InteractiveGradient from "@/components/animation/interactive-gradient";

export default function OnboardingPage() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Animated background */}
      <InteractiveGradient
        startColor="var(--color-heavy-start)"
        endColor="var(--color-heaby-end)"
      />

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="font-display text-2xl md:text-4xl lg:text-5xl text-white/90 mb-10 text-center z-10"
      >
        You&apos;ve planted something.<br />Would you like a place to help it grow?
      </motion.h1>

      <a
        href="onboarding/plan"
        className="z-10 px-8 py-4 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-semibold text-lg shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
      >
        live life to the fullest
      </a>
    </div>
  );
}