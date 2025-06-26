"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import InteractiveGradient from "@/components/animation/interactive-gradient";
import { MemoryStore } from "@/lib/memory"; // Import the MemoryStore

export default function ReflectionRoom() {
  const [journalEntry, setJournalEntry] = useState("");
  const router = useRouter();

  const handleComplete = () => {
    if (journalEntry.trim()) {
      // Create a new reflection memory when the user completes the entry
      MemoryStore.addMemory({
        type: "reflection",
        title: "A Moment of Reflection", // A default title, can be improved later
        content: journalEntry,
        mood: "reflective", // A default mood
        intensity: Math.max(0.2, Math.min(1, journalEntry.length / 500)), // Intensity based on length
      });
    }
    // Clear last visited feeling from local storage on completing reflection
    localStorage.removeItem("lastVisitedFeeling");
    router.push("/hub"); // Redirect to the hub to see the new star
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center text-white/90 px-4 relative overflow-hidden">
      {/* Interactive Gradient Background */}
      <InteractiveGradient
        startColor="var(--color-heavy-start)"
        endColor="var(--color-heavy-end)"
      />

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-display text-2xl md:text-4xl lg:text-5xl text-white/90 mb-8 text-center z-10"
      >
        What did you notice?
      </motion.h1>
      <motion.textarea
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        value={journalEntry}
        onChange={(e) => setJournalEntry(e.target.value)}
        placeholder="Write your thoughts here..."
        className="w-full max-w-2xl h-40 bg-white/10 border-none rounded-lg p-4 text-lg focus:ring-2 focus:ring-white/50 outline-none text-white/90 placeholder:text-white/60 z-10"
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-6 mb-2 text-white/70 text-base italic text-center max-w-xl z-10"
      >
        “Your reflection will vanish when you leave. That’s okay. Not everything has to stay.”
      </motion.p>
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        onClick={handleComplete}
        className="mt-2 px-8 py-3 bg-white/20 rounded-lg hover:bg-white/30 transition text-white/90 z-10"
      >
        Complete Reflection
      </motion.button>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        onClick={() => router.push("/onboarding")}
        className="mt-4 px-8 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition text-white/80 z-10"
      >
        Want to see more of yourself?
      </motion.button>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        onClick={() => router.push("/hub")}
        className="mt-4 px-8 py-3 bg-blue-500/80 rounded-lg hover:bg-blue-600/90 transition text-white font-semibold z-10"
      >
        Login
      </motion.button>
    </div>
  );
}

