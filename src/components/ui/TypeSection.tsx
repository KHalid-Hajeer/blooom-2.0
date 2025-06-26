'use client';
import { motion } from "framer-motion";
import Typewriter from "../animation/typewriter";

interface TypeSectionProps {
  text: string;
  onComplete?: () => void;
  className?: string;
}

export default function TypeSection({ text, onComplete, className = "" }: TypeSectionProps) {
  return (
    <motion.div
      key={text}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={className}
    >
      <Typewriter text={text} onComplete={onComplete} />
    </motion.div>
  );
}