"use client";
import { motion, useMotionValue, useTransform } from "framer-motion";

export default function Stargazing() {
  // mouseX and mouseY are kept for potential future interaction with the stars themselves,
  // but the main radial gradient for the "cloudy" effect is now static.
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Still transform for individual stars if they were to follow, but not for the main background.
  const gradientX = useTransform(mouseX, (value) => `${value}px`);
  const gradientY = useTransform(mouseY, (value) => `${value}px`);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // This will still capture mouse movement if you later want stars to react
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative flex items-center justify-center h-screen w-full bg-gradient-to-b from-[var(--color-fear-start)] to-[var(--color-fear-end)] overflow-hidden"
    >
      {/* Dynamic radial gradient is now fixed at the center for the "cloudy" effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center center, rgba(255, 255, 255, 0.3), transparent 80%)`, // Fixed to center center
        }}
      />

      {/* Text content */}
      <div className="z-10 text-center font-display text-2xl text-white/90 pointer-events-none">
        Look for the stars and let them guide you.
      </div>
    </div>
  );
}

