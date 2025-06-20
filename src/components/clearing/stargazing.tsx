"use client";
import { motion } from "framer-motion";
export default function Stargazing() {
  return (
    <div className="relative flex items-center justify-center h-screen w-full bg-gradient-to-b from-[var(--color-fear-start)] to-[var(--color-fear-end)] overflow-hidden">
      {/* Dynamic radial gradient is now fixed at the center for the "cloudy" effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center center, rgba(255, 255, 255, 0.3), transparent 80%)`,
        }}
      />

      {/* Text content */}
      <div className="z-10 text-center font-display text-2xl text-white/90 pointer-events-none">
        Look for the stars and let them guide you.
      </div>
    </div>
  );
}

