"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Radiate from "@/components/clearing/radiate";
import Stargazing from "@/components/clearing/stargazing";
import BreathingAnchor from "@/components/clearing/breathing-anchor";
import ThoughtCatcher from "@/components/clearing/thought-catcher";
import Typewriter from "@/components/animation/typewriter";

type Step = "quote" | "grounding" | "reflection";

const ProgressBar = ({ step }: { step: Step }) => {
  const steps: Step[] = ["quote", "grounding", "reflection"];
  const currentStepIndex = steps.indexOf(step);
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="w-full bg-white/20 rounded-full h-2.5">
      <motion.div
        className="bg-white/80 h-2.5 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progressPercentage}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  );
};

export default function FeelingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawFeeling = params?.feeling;
  const feelingParam = Array.isArray(rawFeeling) ? rawFeeling[0] : rawFeeling ?? "joy";
  const initialStep = (searchParams.get("step") as Step) ?? "quote";

  const [step, setStep] = useState<Step>(initialStep);
  const [journalEntry, setJournalEntry] = useState("");

  const goTo = (next: Step, delay = 0) => {
    const action = () => {
      setStep(next);
      router.replace(`/feeling/${feelingParam}?step=${next}`, { scroll: false });
    };
    if (delay > 0) setTimeout(action, delay * 1000);
    else action();
  };

  const handleCreateSpace = () => router.push("/onboarding/welcome");
  const handleLogin = () => router.push("/login");

  const clearingMap: Record<string, React.FC> = {
    joy: Radiate,
    sadness: Stargazing,
    fear: BreathingAnchor,
    anger: ThoughtCatcher,
  };
  const quoteMap: Record<string, string> = {
    joy: "Let this joy radiate through you. What does it feel like?",
    sadness: "It's okay to feel sad. Let's sit with this feeling for a moment.",
    fear: "Fear is a natural response. Let’s find our anchor.",
    anger: "Anger can be a powerful signal. Let's understand what it's telling you.",
  };

  const ClearingComponent = clearingMap[feelingParam] ?? Radiate;
  const quoteText = quoteMap[feelingParam] ?? "Your feeling is valid. Let’s explore it.";

  return (
    <div className="flex flex-col flex-1 h-full min-h-screen">
      <div className="w-full px-4 py-4 z-20">
        <ProgressBar step={step} />
      </div>
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {step === "quote" && (
            <motion.div
              key="quote"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center p-4"
            >
              <div className="max-w-2xl text-center text-4xl font-display text-white">
                <Typewriter text={quoteText} onComplete={() => goTo("grounding", 1)} />
              </div>
            </motion.div>
          )}

          {step === "grounding" && (
            <motion.div
              key="grounding"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <ClearingComponent />
              <div className="absolute bottom-4 right-4 z-30">
                <button
                  onClick={() => goTo("reflection")}
                  className="px-6 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition text-white"
                >
                  Next
                </button>
              </div>
            </motion.div>
          )}

          {step === "reflection" && (
            <motion.div
              key="reflection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-4 font-body"
            >
              <h1 className="text-2xl md:text-4xl lg:text-5xl text-white mb-8 text-center">What did you notice?</h1>
              <textarea
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="Write your thoughts here..."
                className="w-full max-w-2xl h-40 bg-white/10 border-none rounded-lg p-4 text-lg focus:ring-2 focus:ring-white/50 outline-none text-white/90 placeholder:text-white/60"
              />
              <p className="mt-6 mb-8 text-white/70 text-base italic text-center max-w-xl">
                To save this reflection and continue, you&apos;ll need a space to keep it.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  onClick={handleCreateSpace}
                  className="px-8 py-3 bg-blue-500/80 rounded-lg hover:bg-blue-600/90 transition text-white font-semibold"
                >
                  Create Your Space
                </motion.button>
                <motion.button
                  onClick={handleLogin}
                  className="px-8 py-3 bg-white/20 rounded-lg hover:bg-white/30 transition text-white/90"
                >
                  Login to Existing Space
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
