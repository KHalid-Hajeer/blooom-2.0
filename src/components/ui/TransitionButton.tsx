'use client';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface TransitionButtonProps {
  children: ReactNode;
  onClick: () => void;
}

export default function TransitionButton({ children, onClick }: TransitionButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className="px-6 py-3 rounded-2xl shadow-lg font-semibold focus:outline-none"
    >
      {children}
    </motion.button>
  );
}
