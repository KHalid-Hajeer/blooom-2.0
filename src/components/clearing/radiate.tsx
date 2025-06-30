"use client";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useState, useRef, useEffect } from "react";

// Interfaces for our dynamic elements
interface Ray {
  id: number;
  rotation: number;
  length: number;
}

interface FloatingWord {
  id: number;
  word: string;
  x: number;
  y: number;
}

interface QuoteWord {
  id: number;
  text: string;
  x: number; // Initial X position
  y: number; // Initial Y position
  order: number;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  duration: number;
  size: number;
}

// Word lists
const joyfulWords = ["love", "joy", "peace", "hope", "kindness", "smile"];
const PREMADE_QUOTE = "Magic happens when you choose to shine".split(" ");

// Helper to create sparkles
const createSparkle = (): Sparkle => ({
  id: Date.now() + Math.random(),
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: Math.random() * 3 + 4,
  size: Math.random() * 2 + 1,
});

export default function Radiate() {
  const [rays, setRays] = useState<Ray[]>([]);
  const [words, setWords] = useState<FloatingWord[]>([]);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  // State for the new quote animation
  const [uncollectedQuoteWords, setUncollectedQuoteWords] = useState<QuoteWord[]>([]);
  const [collectedQuoteWords, setCollectedQuoteWords] = useState<QuoteWord[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Refs for quote easter egg logic
  const nextQuoteWordIndex = useRef(0);
  const rayCountSinceLastQuoteWord = useRef(0);
  const nextTriggerCount = useRef(Math.floor(Math.random() * 3) + 3);

  // Effect for background intensity
  useEffect(() => {
    const intensity = Math.min(rays.length / 50, 0.1);
    document.documentElement.style.setProperty('--bg-intensity', intensity.toString());
  }, [rays]);

  // Effect for background sparkles
  useEffect(() => {
    const initialSparkles = Array.from({ length: 30 }, createSparkle);
    setSparkles(initialSparkles);
    const interval = setInterval(() => {
      setSparkles(prev => [...prev.slice(1), createSparkle()]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { clientX, clientY } = event;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();

    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    const distance = Math.sqrt(Math.pow(clientX - centerX, 2) + Math.pow(clientY - centerY, 2));

    const newRay: Ray = { id: Date.now(), rotation: angle, length: Math.min(distance, 300) };
    setRays(prev => [...prev, newRay]);

    setTimeout(() => {
      setRays(prev => prev.filter(r => r.id !== newRay.id));
    }, 4000);

    // Standard floating word
    const randomWord = joyfulWords[Math.floor(Math.random() * joyfulWords.length)];
    const newWord: FloatingWord = { id: Date.now(), word: randomWord, x: clientX, y: clientY };
    setWords(prev => [...prev, newWord]);
    setTimeout(() => {
      setWords(prev => prev.filter(w => w.id !== newWord.id));
    }, 1500);

    // Quote Easter Egg Logic
    rayCountSinceLastQuoteWord.current++;
    if (
      rayCountSinceLastQuoteWord.current >= nextTriggerCount.current &&
      nextQuoteWordIndex.current < PREMADE_QUOTE.length
    ) {
      const wordText = PREMADE_QUOTE[nextQuoteWordIndex.current];
      const newQuoteWord: QuoteWord = {
        id: Date.now(),
        text: wordText,
        x: clientX,
        y: clientY,
        order: nextQuoteWordIndex.current,
      };

      setUncollectedQuoteWords(prev => [...prev, newQuoteWord]);

      setTimeout(() => {
        setUncollectedQuoteWords(prev => prev.filter(qw => qw.id !== newQuoteWord.id));
        setCollectedQuoteWords(prev => [...prev, newQuoteWord].sort((a, b) => a.order - b.order));
      }, 1200);

      rayCountSinceLastQuoteWord.current = 0;
      nextTriggerCount.current = Math.floor(Math.random() * 3) + 3;
      nextQuoteWordIndex.current++;
    }
  };

  return (
    <LayoutGroup>
      <div
        ref={containerRef}
        onClick={handleClick}
        className="flex items-center justify-center h-screen w-full cursor-crosshair overflow-hidden relative text-[var(--color-joy-text)]"
      >
        {/* Container for the assembled quote at the top */}
        <div className="absolute top-10 w-full flex justify-center items-center gap-2 md:gap-3 px-4 h-10">
          {collectedQuoteWords.map(word => (
            <motion.span
              layoutId={word.id.toString()}
              key={word.id}
              className="text-xl md:text-2xl font-display text-white"
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            >
              {word.text}
            </motion.span>
          ))}
        </div>

        <AnimatePresence>
          {sparkles.map(s => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: `${s.x}vw`, y: `${s.y}vh` }}
              animate={{ opacity: [0, 1, 0], y: `${s.y - 10}vh` }}
              transition={{ duration: s.duration, ease: 'linear' }}
              style={{ position: 'absolute', width: `${s.size}px`, height: `${s.size}px`, backgroundColor: 'white', borderRadius: '50%', boxShadow: '0 0 8px 2px rgba(255, 255, 255, 0.7)' }}
            />
          ))}
        </AnimatePresence>

        <div className="relative flex items-center justify-center">
          <AnimatePresence>
            {rays.map(ray => (
              <motion.div
                key={ray.id}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: ray.length, opacity: 1, boxShadow: ['0 0 2px rgba(255,255,255,0.1)', '0 0 15px rgba(255,255,255,0.7)', '0 0 2px rgba(255,255,255,0.1)'] }}
                exit={{ width: 0, opacity: 0, transition: { duration: 2, ease: 'easeOut' } }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="absolute h-1 bg-gradient-to-r from-white/0 to-white/80 rounded-full"
                style={{ transformOrigin: 'left center', rotate: `${ray.rotation}deg`, top: '50%', left: '50%' }}
              />
            ))}
          </AnimatePresence>

          <motion.div
            whileTap={{ scale: 0.95 }}
            animate={{ scale: [1, 1.03, 1], boxShadow: ['0 0 15px 3px rgba(255,255,255,0.4)', '0 0 25px 8px rgba(255,255,255,0.2)', '0 0 15px 3px rgba(255,255,255,0.4)'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-32 h-32 md:w-40 md:h-40 bg-white/30 rounded-full flex items-center justify-center text-center font-display text-xl p-4"
          />
        </div>

        <AnimatePresence>
          {words.map(word => (
            <motion.div
              key={word.id}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: -50 }}
              exit={{ opacity: 0, y: -80 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="absolute text-lg font-display"
              style={{ left: word.x, top: word.y, pointerEvents: 'none', color: 'rgba(255, 255, 255, 0.9)' }}
            >
              {word.word}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Render uncollected quote words at their initial position */}
        {uncollectedQuoteWords.map(word => (
          <motion.span
            layoutId={word.id.toString()}
            key={word.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute text-xl md:text-2xl font-display text-white"
            style={{ left: word.x, top: word.y, pointerEvents: 'none' }}
          >
            {word.text}
          </motion.span>
        ))}
      </div>
    </LayoutGroup>
  );
}