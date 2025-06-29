// src/components/ui/OnboardingNextButton.tsx
"use client";

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface OnboardingNextButtonProps {
  nextStep: number;
  nextPath: string;
  text?: string;
}

/**
 * A reusable button for navigating to the next step in the onboarding process.
 * It's positioned at the top right, pulses to attract attention, and handles
 * updating the onboarding step in localStorage and routing.
 */
export default function OnboardingNextButton({ nextStep, nextPath, text = "Next →" }: OnboardingNextButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    localStorage.setItem('onboardingStep', nextStep.toString());
    if (nextPath === '/hub') {
        // A slight delay gives the user feedback that the hub is loading
        setTimeout(() => router.push(nextPath), 200);
    } else {
        router.push(nextPath);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0, transition: { delay: 0.5, ease: "easeOut" } }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed top-5 right-5 z-50 px-5 py-2.5 bg-white text-black font-semibold rounded-lg shadow-lg"
    >
      <motion.div
        animate={{
          scale: [1, 1.03, 1],
          boxShadow: ['0 0 0 0px rgba(0, 0, 0, 0.2)', '0 0 0 10px rgba(0, 0, 0, 0)', '0 0 0 0px rgba(0, 0, 0, 0)'],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 rounded-lg"
      />
      <span className="relative">{text}</span>
    </motion.button>
  );
}
