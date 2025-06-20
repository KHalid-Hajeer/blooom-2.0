"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef} from "react";

// The main component, now with enhanced animations
export default function ThoughtCatcher() {
  const [inputValue, setInputValue] = useState("");
  // State now holds objects with an ID and the text content for stable keying
  const [releasedThoughts, setReleasedThoughts] = useState<{ id: number; text: string }[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const thoughtId = useRef(0); // Use a ref to ensure unique IDs across renders

  const popSoundDataUri = "data:audio/wav;base64,UklGRl9vT1NSRXgAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YVgAAAAAAAAAAAAAALpA4rMAAECQAgwAoA==";

  const handleRelease = () => {
    if (!inputValue.trim()) return;
    // Add the new thought with a unique ID
    setReleasedThoughts((prev) => [...prev, { id: thoughtId.current++, text: inputValue }]);
    setInputValue("");
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  };
  
  // Variants for the main background pulse effect
  const backgroundVariants = {
    pulse: {
      scale: [1, 1.03, 1],
      transition: {
        duration: 8,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  };

  // Variants for the jittering input field
  const jitterVariants = {
    jitter: {
      x: [0, -1, 1, -1, 1, 0],
      transition: { duration: 0.2, repeat: Infinity, repeatType: "loop" as const }
    },
    stop: {
      x: 0,
    }
  };

  // Parent container for the rising "smoke" effect
  const smokeContainerVariants = {
    initial: { opacity: 1, x: "-50%", y: "-50%", top: "50%", left: "50%" },
    animate: {
      opacity: 0,
      y: "-150%", // Drifts upwards more significantly
      transition: {
        duration: 4,
        ease: "easeOut",
      },
    },
  };
  
  // Individual character particle animation
  const particleVariants = {
    initial: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 },
    animate: () => ({
      opacity: 0,
      x: (Math.random() - 0.5) * 300, // Scatter horizontally
      y: (Math.random() - 0.5) * 200, // Scatter vertically
      scale: Math.random() * 0.5,
      rotate: (Math.random() - 0.5) * 360, // Add rotation
      transition: {
        duration: 2 + Math.random() * 2, // Each particle has a random duration
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen w-full bg-gradient-to-br from-[var(--color-anger-start)] to-[var(--color-anger-end)] text-white/90 p-4 overflow-hidden">
      {/* Pulsing background element */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[var(--color-anger-start)] to-[var(--color-anger-end)]"
        variants={backgroundVariants}
        animate="pulse"
      />
      
      <audio ref={audioRef} src={popSoundDataUri} preload="auto" />

      <AnimatePresence>
        {releasedThoughts.map((thought) => (
          <motion.div
            key={thought.id}
            variants={smokeContainerVariants}
            initial="initial"
            animate="animate"
            exit={{ opacity: 0 }}
            className="absolute text-2xl font-display pointer-events-none flex flex-wrap justify-center"
          >
            {thought.text.split("").map((char, index) => (
              <motion.span
                key={index}
                variants={particleVariants}
                className="inline-block"
              >
                {char === " " ? "\u00A0" : char} {/* Render spaces as non-breaking */}
              </motion.span>
            ))}
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="z-10 text-center relative max-w-md w-full flex flex-col items-center">
        <motion.div 
          className="w-full"
          animate={inputValue ? "jitter" : "stop"}
          variants={jitterVariants}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleRelease()}
            className="w-full bg-white/10 border-none rounded-lg p-4 text-center text-lg focus:ring-2 focus:ring-white/50 outline-none text-white/90 placeholder:text-white/60"
            placeholder="A passing thought..."
          />
        </motion.div>
        
        <button
          onClick={handleRelease}
          className="mt-6 px-8 py-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors text-white/90"
        >
          Release
        </button>
      </div>
    </div>
  );
}