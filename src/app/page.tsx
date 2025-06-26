"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import Typewriter from "@/components/animation/typewriter";
import InteractiveGradient from "@/components/animation/interactive-gradient";
import { wisps, type WispData } from "@/data/content";

interface WispProps {
  word: string;
  onHover: (start: string, end: string) => void;
  onLeave: () => void;
  onClick: (path: string) => void;
  isActive: boolean;
}

const wispContainerVariants: Variants = {
  static: (custom: boolean) => ({
    scale: custom ? 1.1 : 1,
  }),
  pulse: {
    scale: [1, 1.03, 1],
    transition: {
      repeat: Infinity,
      repeatType: "loop",
      duration: 2,
      ease: "easeInOut",
    },
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

const DEFAULT_START_COLOR = "var(--color-heavy-start)";
const DEFAULT_END_COLOR = "var(--color-heavy-end)";

const Wisp: React.FC<WispProps> = React.memo(({ word, onHover, onLeave, onClick, isActive }) => {
  const wispData = useMemo(() => wisps.find((w): w is WispData => w.word === word), [word]);
  const startColor = wispData?.startColor ?? DEFAULT_START_COLOR;
  const endColor = wispData?.endColor ?? DEFAULT_END_COLOR;
  const path = wispData?.path ?? "";

  const hoverStart = useCallback(() => onHover(startColor, endColor), [onHover, startColor, endColor]);
  const handleClick = useCallback(() => {
    if (path) onClick(path);
  }, [onClick, path]);

  return (
    <motion.div
      role="button"
      aria-label={`Select feeling ${word}`}
      tabIndex={0}
      className="relative w-24 h-24 rounded-full cursor-pointer flex items-center justify-center overflow-hidden focus:outline-none focus:ring-2 focus:ring-[var(--color-text)]"
      style={{
        boxShadow: "0 0 15px rgba(255, 255, 255, 0.2), 0 0 25px rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(3px)",
      }}
      variants={wispContainerVariants}
      initial="static"
      animate="pulse"
      whileHover="hover"
      custom={isActive}
      onHoverStart={hoverStart}
      onHoverEnd={onLeave}
      onClick={handleClick}
      onKeyPress={(e) => e.key === "Enter" && handleClick()}
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <InteractiveGradient startColor={startColor} endColor={endColor} />
      </div>
      <motion.span
        variants={wispTextVariants}
        initial="initial"
        animate="initial"
        whileHover="hover"
        className="absolute z-10 text-[var(--color-text)] font-display text-lg select-none"
      >
        {word}
      </motion.span>
    </motion.div>
  );
});

export default function HomePage() {
  const router = useRouter();
  const [quoteTyped, setQuoteTyped] = useState(false);
  const [questionTyped, setQuestionTyped] = useState(false);
  const [gradientColors, setGradientColors] = useState({ start: DEFAULT_START_COLOR, end: DEFAULT_END_COLOR });
  const [lastVisited, setLastVisited] = useState<string | null>(null);

  const quote = "Bloom is a digital sanctuary for self-growth and reflection.";
  const question = "How are you feeling today?";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const last = localStorage.getItem("lastVisitedFeeling");
      if (last) setLastVisited(last);
    }
  }, []);

  const handleHover = useCallback((start: string, end: string) => {
    setGradientColors({ start, end });
  }, []);

  const handleLeave = useCallback(() => {
    setGradientColors({ start: DEFAULT_START_COLOR, end: DEFAULT_END_COLOR });
  }, []);

  const handleWispClick = useCallback(
    (path: string) => {
      if (typeof window !== "undefined") localStorage.setItem("lastVisitedFeeling", path);
      router.push(`/feeling/${path}`);
    },
    [router]
  );

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 overflow-hidden">
      <InteractiveGradient startColor={gradientColors.start} endColor={gradientColors.end} />

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.5 } }}
        className="font-display text-2xl md:text-4xl lg:text-5xl text-[var(--color-text)] mb-12 max-w-4xl text-center z-10"
      >
        <Typewriter text={quote} speed={60} delay={1} onComplete={() => setQuoteTyped(true)} />
      </motion.h1>

      {quoteTyped && (
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.8, delay: 0.2 } }}
          className="text-lg text-[var(--color-light-text)] mb-8 font-body text-center z-10"
        >
          <Typewriter text={question} speed={60} delay={0} onComplete={() => setQuestionTyped(true)} />
        </motion.h2>
      )}

      {questionTyped && (
        <>
          <div className="z-20 flex flex-wrap justify-center gap-6 mt-4">
            {wisps.map(({ word }, index) => (
              <motion.div
                key={word}
                initial={{ opacity: 0, y: 50 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.5 + index * 0.2, type: "spring", stiffness: 100 },
                }}
              >
                <Wisp
                  word={word}
                  onHover={handleHover}
                  onLeave={handleLeave}
                  onClick={handleWispClick}
                  isActive={word === lastVisited}
                />
              </motion.div>
            ))}
          </div>
          <p className="text-sm text-[var(--color-light-text)] mt-4 z-10 text-center">
            Choose a feeling to begin a gentle exercise
          </p>
        </>
      )}
    </div>
  );
}
