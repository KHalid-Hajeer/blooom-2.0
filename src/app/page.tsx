"use client";

import { useState, useEffect, useRef } from "react";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import Typewriter from "@/components/animation/typewriter";
import InteractiveGradient from "@/components/animation/interactive-gradient";
import { wisps } from "@/data/content"; // Import wisps from centralized data

// --- Wisp Component ---
interface WispProps {
  word: string;
  onHover: (start: string, end: string) => void; // Updated to pass colors
  onLeave: () => void;
  onClick: () => void;
  color: string; // Added color prop
}

const wispParentVariants: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.2,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

const wispTextVariants: Variants = {
  initial: { opacity: 0 },
  hover: { opacity: 1, transition: { delay: 0.1 } },
};

function Wisp({ word, onHover, onLeave, onClick, color }: WispProps) {
  const wispData = wisps.find(w => w.word === word);
  return (
    <motion.div
      className="relative w-24 h-24 rounded-full cursor-pointer flex items-center justify-center overflow-hidden"
      style={{
        boxShadow: "0 0 15px rgba(255, 255, 255, 0.2), 0 0 25px rgba(255, 255, 255, 0.15)",
        backdropFilter: 'blur(3px)',
      }}
      variants={wispParentVariants}
      initial="initial"
      whileHover="hover"
      onHoverStart={() => onHover(
        wispData?.startColor || "var(--color-heavy-start)",
        wispData?.endColor || "var(--color-heavy-end)"
      )}
      onHoverEnd={onLeave}
      onClick={onClick}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <InteractiveGradient
          startColor={wispData?.startColor || "var(--color-heavy-start)"}
          endColor={wispData?.endColor || "var(--color-heavy-end)"}
        />
      </div>
      {/* Wisp text */}
      <motion.span variants={wispTextVariants} className="absolute z-10 text-white/90 font-display text-lg">
        {word}
      </motion.span>
    </motion.div>
  );
}

// --- Main Page Component ---
export default function HomePage() {
  const router = useRouter();
  const [isQuoteComplete, setIsQuoteComplete] = useState(false);
  const [isQuestionComplete, setIsQuestionComplete] = useState(false);
  const [startColor, setStartColor] = useState("var(--color-heavy-start)");
  const [endColor, setEndColor] = useState("var(--color-heavy-end)");
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [lastVisitedFeeling, setLastVisitedFeeling] = useState<string | null>(null);

  // Quote and question texts
  const quote = useRef("Bloom is a digital sanctuary for self-growth and reflection.");
  const question = useRef("How are you feeling today?");

  // Check local storage for last visited feeling on mount
  useEffect(() => {
    const storedFeeling = localStorage.getItem("lastVisitedFeeling");
    if (storedFeeling) {
      setLastVisitedFeeling(storedFeeling);
      setShowContinueButton(true);
    }
  }, []);

  const handleWispHover = (start: string, end: string) => {
    setStartColor(start);
    setEndColor(end);
  };

  const handleWispLeave = () => {
    setStartColor("var(--color-heavy-start)");
    setEndColor("var(--color-heavy-end)");
  };

  const handleWispClick = (path: string) => {
    router.push(`/begin/${path}`);
  };

  const handleContinueJourney = () => {
    if (lastVisitedFeeling) {
      router.push(`/begin/${lastVisitedFeeling}`);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 overflow-hidden">
      {/* Interactive Gradient Background */}
      <InteractiveGradient startColor={startColor} endColor={endColor} />

      {/* Quote */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.5 } }}
        className="font-display text-2xl md:text-4xl lg:text-5xl text-white/90 mb-12 max-w-4xl text-center z-10"
      >
        <Typewriter text={quote.current} speed={60} delay={1} onComplete={() => setIsQuoteComplete(true)} />
      </motion.h1>

      {/* Central Question */}
      {isQuoteComplete && (
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.8, delay: 0.2 } }}
          className="text-lg text-white/80 mb-8 font-body text-center z-10"
        >
          <Typewriter text={question.current} speed={60} delay={0} onComplete={() => setIsQuestionComplete(true)} />
        </motion.h2>
      )}

      {/* Wisps */}
      {isQuestionComplete && (
        <div className="z-20 flex flex-wrap justify-center gap-6 mt-4">
          {wisps.map((wisp, index) => (
            <motion.div
              key={wisp.word}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.5 + index * 0.2, type: "spring", stiffness: 100 } }}
            >
              <Wisp
                word={wisp.word}
                onHover={handleWispHover}
                onLeave={handleWispLeave}
                onClick={() => handleWispClick(wisp.path)}
                color={wisp.color}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Continue Journey Button */}
      {isQuestionComplete && showContinueButton && lastVisitedFeeling && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 1.5, type: "spring", stiffness: 100 } }}
          onClick={handleContinueJourney}
          className="mt-12 px-8 py-4 bg-white/20 text-white rounded-lg hover:bg-white/30 transition z-20"
        >
          Continue Your Journey ({lastVisitedFeeling})
        </motion.button>
      )}
    </div>
  );
}

