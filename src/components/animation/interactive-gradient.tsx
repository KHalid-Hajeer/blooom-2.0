"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function InteractiveGradient({ startColor, endColor }: { startColor: string; endColor: string }) {
  const [angle, setAngle] = useState(135);

  useEffect(() => {
    let frame: number;
    const animateAngle = () => {
      setAngle((prev) => (prev + 0.2) % 360); // Adjust speed here
      frame = requestAnimationFrame(animateAngle);
    };
    frame = requestAnimationFrame(animateAngle);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 z-0 transition-colors duration-1000"
      style={{
        background: `linear-gradient(${angle}deg, ${startColor}, ${endColor})`,
      }}
    />
  );
}

