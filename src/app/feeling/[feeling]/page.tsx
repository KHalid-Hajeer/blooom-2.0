'use client';
import React, { useState, useEffect, ComponentType, useRef } from 'react';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';

// --- Type Definitions for Clarity and Safety ---
interface Ray { id: number; rotation: number; length: number; }
interface ReleasedThought { id: number; text: string; }
interface Star { x: number; y: number; radius: number; alpha: number; }

// --- Mocked Hooks and Components to resolve errors ---

// Mock next/navigation hooks
const mockRouter = {
  push: (path: string) => console.log(`Navigating to: ${path}`),
  replace: (path: string, options?: any) => console.log(`Replacing path with: ${path}`, options),
};

const useParams = () => ({
  feeling: 'joy', // Default feeling for demonstration
});

const useSearchParams = () => {
  return {
    get: (param: string) => {
      if (param === 'step') return 'quote'; // Default step
      return null;
    }
  };
};

const useRouter = () => mockRouter;

// Mock UI Components with explicit prop types
const Typewriter = ({ text, speed = 50 }: { text: string; speed?: number }) => {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayedText}</span>;
};

const TypeSection = ({ text, onComplete, className }: { text: string; onComplete?: () => void; className?: string }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, text.length * 50 + 500); // Simple delay based on text length
    return () => clearTimeout(timer);
  }, [text, onComplete]);

  return (
    <div className={className}>
      <Typewriter text={text} />
    </div>
  );
};

const Button = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
  <button onClick={onClick} className="px-6 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition text-white">
    {children}
  </button>
);

const ProgressBar = ({ step }: { step: Step }) => {
  const steps = ['quote', 'grounding', 'reflection'];
  const currentStepIndex = steps.indexOf(step);
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="w-full bg-white/20 rounded-full h-2.5">
      <motion.div
        className="bg-white/80 h-2.5 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progressPercentage}%` }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      ></motion.div>
    </div>
  );
};


// --- Grounding Experience Components (from uploaded files) ---

const Radiate = () => {
  const [rays, setRays] = useState<Ray[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDrag = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { clientX, clientY } = event;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    const distance = Math.sqrt(Math.pow(clientX - centerX, 2) + Math.pow(clientY - centerY, 2));

    const newRay: Ray = { id: Date.now(), rotation: angle, length: Math.min(distance, 300) };
    setRays(prev => [...prev, newRay]);
    setTimeout(() => setRays(prev => prev.filter(r => r.id !== newRay.id)), 4000);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleDrag}
      className="font-body flex items-center justify-center h-full w-full cursor-crosshair overflow-hidden relative text-white"
    >
      <div className="relative flex items-center justify-center">
        <AnimatePresence>
          {rays.map((ray: Ray) => (
            <motion.div
              key={ray.id}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: ray.length, opacity: 1 }}
              exit={{ width: 0, opacity: 0, transition: { duration: 2 } }}
              transition={{ duration: 0.8 }}
              className="absolute h-1 bg-gradient-to-r from-white/0 to-white/80 rounded-full"
              style={{ transformOrigin: 'left center', rotate: `${ray.rotation}deg`, top: '50%', left: '50%' }}
            />
          ))}
        </AnimatePresence>
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="relative w-32 h-32 md:w-40 md:h-40 bg-white/30 rounded-full flex items-center justify-center text-center text-xl p-4"
        >
          Shine
        </motion.div>
      </div>
    </div>
  );
};

const Stargazing = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;
    const resizeCanvas = () => {
      if (!canvas.parentElement) return;
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    };
    resizeCanvas();
    const stars: Star[] = Array.from({ length: 500 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      alpha: Math.random(),
    }));
    const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach((star: Star) => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
            ctx.fill();
        });
        animationFrameId = window.requestAnimationFrame(render);
    };
    render();
    window.addEventListener('resize', resizeCanvas);
    return () => {
        window.cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  return (
    <div className="relative flex items-center justify-center h-full w-full overflow-hidden cursor-move font-body">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      <div className="z-10 text-center text-xl text-white/90 pointer-events-none p-4">
        Look for the stars and let them guide you.
      </div>
    </div>
  );
};

const BreathingAnchor = () => {
  const PHASES = [
    { label: "Breathe in", duration: 4.5 },
    { label: "Rest", duration: 2 },
    { label: "Breathe out", duration: 4.5 },
    { label: "Rest", duration: 3 },
  ];
  const [phaseIdx, setPhaseIdx] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPhaseIdx((idx) => (idx + 1) % PHASES.length);
    }, PHASES[phaseIdx].duration * 1000);
    return () => clearTimeout(timeout);
  }, [phaseIdx]);

  const getAnimation = () => {
    switch (phaseIdx) {
      case 0: return { scale: 1.2, opacity: 1 };
      case 1: return { scale: 1.2, opacity: 1 };
      case 2: return { scale: 1, opacity: 0.7 };
      case 3: return { scale: 1, opacity: 0.7 };
      default: return { scale: 1, opacity: 0.7 };
    }
  };

  return (
    <div className="relative flex items-center justify-center h-full w-full overflow-hidden font-body">
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4">
        <motion.div
          className="relative w-48 h-48 md:w-64 md:h-64 rounded-full bg-white/20 flex items-center justify-center"
          animate={getAnimation()}
          transition={{ duration: PHASES[phaseIdx].duration, ease: "easeInOut" }}
        >
          <span className="text-xl md:text-2xl text-white drop-shadow text-center select-none pointer-events-none">
            {PHASES[phaseIdx].label}
          </span>
        </motion.div>
        <div className="text-white/90 mt-12 text-lg">
          <Typewriter text="Sync your breath with the light" speed={40} />
        </div>
      </div>
    </div>
  );
};

const ThoughtCatcher = () => {
    const [inputValue, setInputValue] = useState("");
    const [releasedThoughts, setReleasedThoughts] = useState<ReleasedThought[]>([]);
    
    const handleRelease = () => {
        if (!inputValue.trim()) return;
        setReleasedThoughts(prev => [...prev, { id: Date.now(), text: inputValue }]);
        setInputValue("");
    };

    const particleVariants = {
        initial: { opacity: 1, y: 0, scale: 1 },
        animate: { opacity: 0, y: -100, scale: 0.5, transition: { duration: 3, ease: 'easeOut' } },
    };

    return (
        <div className="relative flex flex-col items-center justify-center h-full w-full text-white p-4 overflow-hidden font-body">
            <AnimatePresence>
                {releasedThoughts.map((thought: ReleasedThought) => (
                    <motion.div
                        key={thought.id}
                        initial="initial"
                        animate="animate"
                        exit={{ opacity: 0 }}
                        variants={particleVariants}
                        className="absolute text-xl pointer-events-none text-white/80"
                    >
                        {thought.text}
                    </motion.div>
                ))}
            </AnimatePresence>
            <div className="z-10 text-center relative max-w-md w-full flex flex-col items-center">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                    onKeyPress={(e: React.KeyboardEvent) => e.key === "Enter" && handleRelease()}
                    className="w-full bg-white/10 border-none rounded-lg p-4 text-center text-lg focus:ring-2 focus:ring-white/50 outline-none text-white/90 placeholder:text-white/60"
                    placeholder="A passing thought..."
                />
                <button
                    onClick={handleRelease}
                    className="mt-6 px-8 py-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors text-white"
                >
                    Release
                </button>
            </div>
        </div>
    );
};

// --- Main Feeling Page Component ---

type Step = 'quote' | 'grounding' | 'reflection';

const clearingMap: Record<string, ComponentType<any>> = {
  joy: Radiate,
  sadness: Stargazing,
  fear: BreathingAnchor,
  anger: ThoughtCatcher,
};

const quoteMap: Record<string, string> = {
  joy: "“Let this joy radiate through you. What does it feel like?”",
  sadness: "“It's okay to feel sad. Let's sit with this feeling for a moment.”",
  fear: "“Fear is a natural response. Let's find our anchor.”",
  anger: "“Anger can be a powerful signal. Let's understand what it's telling you.”",
};

export default function FeelingPage() {
  const params = useParams();
  const rawFeeling = params.feeling;
  const feelingParam = Array.isArray(rawFeeling) ? rawFeeling[0] : rawFeeling ?? 'joy';

  const searchParams = useSearchParams();
  const router = useRouter();
  const initialStep = (searchParams.get('step') as Step) ?? 'quote';
  const [step, setStep] = useState<Step>(initialStep);
  const [journalEntry, setJournalEntry] = useState("");

  useEffect(() => {
    // Mocking localStorage interaction
    console.log(`Setting last feeling to: ${feelingParam}`);
  }, [feelingParam]);

  const goTo = (next: Step, delay = 0) => {
    const action = () => {
      setStep(next);
      router.replace(`/feeling/${feelingParam}?step=${next}`, { scroll: false });
    };

    if (delay) {
      setTimeout(action, delay);
    } else {
      action();
    }
  };
  
  const handleReflectionComplete = () => {
    console.log("Reflection Entry:", journalEntry);
    router.push('/hub');
  };

  const ClearingComponent = clearingMap[feelingParam] || Radiate;
  const quoteText = quoteMap[feelingParam] || "“Your feeling is valid. Let’s explore it.”";

  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="w-full px-4 py-4 z-20">
        <ProgressBar step={step} />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center min-h-0">
        <AnimatePresence mode="wait">
          {step === 'quote' && (
            <motion.div
              key="quote"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex w-full items-center justify-center p-4"
            >
              <TypeSection
                text={quoteText}
                onComplete={() => goTo('grounding', 1000)}
                className="max-w-2xl text-center text-4xl font-display text-white"
              />
            </motion.div>
          )}
          {step === 'grounding' && (
            <motion.div
              key="grounding"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex w-full items-center justify-center relative"
            >
              <ClearingComponent />
              <div className="absolute bottom-4 right-4 z-20">
                <Button onClick={() => goTo('reflection')}>
                  Next
                </Button>
              </div>
            </motion.div>
          )}
          {step === 'reflection' && (
             <motion.div
              key="reflection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full flex flex-col items-center justify-center p-4 font-body"
            >
              <h1 className="text-2xl md:text-4xl lg:text-5xl text-white mb-8 text-center">
                What did you notice?
              </h1>
              <textarea
                value={journalEntry}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJournalEntry(e.target.value)}
                placeholder="Write your thoughts here..."
                className="w-full max-w-2xl h-40 bg-white/10 border-none rounded-lg p-4 text-lg focus:ring-2 focus:ring-white/50 outline-none text-white/90 placeholder:text-white/60"
              />
              <p className="mt-6 mb-2 text-white/90 text-base italic text-center max-w-xl">
                “Your reflection will vanish when you leave. That’s okay. Not everything has to stay.”
              </p>
              <motion.button
                onClick={handleReflectionComplete}
                className="mt-2 px-8 py-3 bg-white/20 rounded-lg hover:bg-white/30 transition text-white"
              >
                Complete Reflection
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
