"use client";

import { useState } from "react";
import { motion} from "framer-motion";
import InteractiveGradient from "@/components/animation/interactive-gradient";

function BloomFlower({ hovered }: { hovered: boolean }) {
  // Animate scale and petals opening on hover
  return (
    <motion.div
      className="relative flex items-center justify-center w-40 h-40 md:w-56 md:h-56"
      initial={false}
      animate={hovered ? "bloom" : "rest"}
    >
      {/* Center circle */}
      <motion.div
        className="absolute w-16 h-16 md:w-24 md:h-24 bg-yellow-200 rounded-full shadow-lg z-10"
        variants={{
          rest: { scale: 1 },
          bloom: { scale: 1.1, transition: { type: "spring", stiffness: 80 } },
        }}
      />
      {/* Petals */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2"
          style={{
            transform: `rotate(${i * 45}deg) translate(-50%, -50%)`,
            zIndex: 1,
          }}
          variants={{
            rest: { y: -60, scaleY: 0.7, opacity: 0.7 },
            bloom: {
              y: -90,
              scaleY: 1.1,
              opacity: 1,
              transition: { delay: 0.05 * i, type: "spring", stiffness: 60 },
            },
          }}
        >
          <div
            className="w-10 h-20 md:w-14 md:h-28 bg-pink-300 rounded-full"
            style={{
              boxShadow: "0 2px 12px 0 rgba(255,182,193,0.18)",
            }}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function OnboardingPage() {
  const [hovered, setHovered] = useState(false);

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
        You’ve planted something.<br />Would you like a place to help it grow?
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