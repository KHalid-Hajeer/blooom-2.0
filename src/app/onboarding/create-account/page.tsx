"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import InteractiveGradient from "@/components/animation/interactive-gradient";
import Typewriter from "@/components/animation/typewriter";

export default function CreateAccountPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [plan, setPlan] = useState<"monthly" | "yearly">("monthly");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would handle user creation here.
    // For now, we'll simulate success.
    
    // Mark onboarding as complete and remove the step tracker
    localStorage.setItem('onboardingCompleted', 'true');
    localStorage.removeItem('onboardingStep');
    
    // Redirect to the now fully unlocked hub
    router.push("/hub");
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-8 overflow-hidden">
      <InteractiveGradient startColor={'#4a4a88'} endColor={'#8a55c7'} />

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.4 } }}
        className="font-display text-3xl md:text-5xl text-white/90 mb-8 max-w-2xl text-center z-10"
      >
        <Typewriter text="Let’s set the foundation for your space." speed={60} />
      </motion.h1>

      <form
        onSubmit={handleSubmit}
        className="z-10 flex flex-col gap-6 w-full max-w-md text-white/90"
      >
        <div className="flex flex-col">
          <label className="mb-1 text-sm">What should we call you?</label>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-transparent border-b border-white/40 focus:border-white py-2 px-1 outline-none transition-all"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-transparent border-b border-white/40 focus:border-white py-2 px-1 outline-none transition-all"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-transparent border-b border-white/40 focus:border-white py-2 px-1 outline-none transition-all"
            required
          />
        </div>
        
        <motion.button
          type="submit"
          whileTap={{ scale: 0.98 }}
          className="mt-8 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition"
        >
          Begin My Journey
        </motion.button>
      </form>
    </div>
  );
}