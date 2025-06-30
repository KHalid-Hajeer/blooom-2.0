"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";

export default function ThoughtCatcher() {
  const [inputValue, setInputValue] = useState("");
  const [releasedThoughts, setReleasedThoughts] = useState<{ id: number; text: string }[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const thoughtId = useRef(0);

  const popSoundDataUri = "data:audio/wav;base64,UklGRl9vT1NSRXgAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YVgAAAAAAAAAAAAAALpA4rMAAECQAgwAoA==";

  const handleRelease = () => {
    if (!inputValue.trim()) return;
    setReleasedThoughts((prev) => [...prev, { id: thoughtId.current++, text: inputValue }]);
    setInputValue("");
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  };

  const smokeContainerVariants = {
    initial: { opacity: 1, x: "-50%", y: "-50%", top: "50%", left: "50%" },
    animate: { opacity: 0, y: "-150%", transition: { duration: 4, ease: "easeOut" } },
  };

  const particleVariants = {
    initial: { opacity: 1, x: 0, y: 0, scale: 1 },
    animate: () => ({
      opacity: [1, 0.8, 0],
      x: (Math.random() - 0.5) * 350,
      y: (Math.random() - 0.5) * 250,
      scale: [1, 1.5, 0.5],
      rotate: (Math.random() - 0.5) * 270,
      transition: { duration: 2 + Math.random() * 2.5, ease: "easeOut", times: [0, 0.6, 1] },
    }),
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full text-white p-4 overflow-hidden font-body">
      <audio ref={audioRef} src={popSoundDataUri} preload="auto" />

      <AnimatePresence>
        {releasedThoughts.map((thought) => (
          <motion.div
            key={thought.id}
            variants={smokeContainerVariants}
            initial="initial"
            animate="animate"
            exit={{ opacity: 0 }}
            className="absolute text-2xl pointer-events-none flex flex-wrap justify-center"
          >
            {thought.text.split("").map((char, index) => (
              <motion.span
                key={index}
                variants={particleVariants}
                className="inline-block text-orange-300"
                style={{ textShadow: '0 0 8px rgba(255, 165, 0, 0.8)' }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="z-10 text-center relative max-w-md w-full flex flex-col items-center">
        <div className="w-full">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleRelease()}
            className="w-full bg-white/10 border-none rounded-lg p-4 text-center text-lg focus:ring-2 focus:ring-white/50 outline-none text-white/90 placeholder:text-white/60"
            placeholder="A passing thought..."
          />
        </div>
        
        <button
          onClick={handleRelease}
          className="mt-6 px-8 py-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors text-white"
        >
          Release
        </button>
      </div>
    </div>
  );
}