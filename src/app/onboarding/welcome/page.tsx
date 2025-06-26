"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Star = {
  id: number;
  top: string;
  left: string;
  size: string;
  animationDelay: string;
};

export default function WelcomePage() {
  const router = useRouter();
  const [stars, setStars] = useState<Star[]>([]);

  // Generate simple animated particles/stars
  useEffect(() => {
    const count = 40;
    const starArray = Array.from({ length: count }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      animationDelay: `${Math.random() * 5}s`,
    }));
    setStars(starArray);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col justify-center items-center overflow-hidden px-6">
      {/* Star particles */}
      {stars.map(star => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full opacity-70"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animation: `twinkle 4s infinite`,
            animationDelay: star.animationDelay,
          }}
        />
      ))}

      {/* Centered content */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-3xl md:text-5xl font-display text-center mb-4 z-10"
      >
        This space is now yours.
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="text-lg text-white/70 text-center mb-10 z-10"
      >
        Return whenever you're ready.
      </motion.p>

      <motion.button
        onClick={() => router.push("/onboarding/walkthrough")}
        whileTap={{ scale: 0.96 }}
        className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition z-10"
      >
        Enter Your Space
      </motion.button>

      {/* Optional: subtle gradient behind */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
