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
  const [startColor, setStartColor] = useState("#4a4a88");
  const [endColor, setEndColor] = useState("#8a55c7");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Temporarily skipping Stripe
    router.push("/onboarding/welcome");
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-8 overflow-hidden">
      <InteractiveGradient startColor={startColor} endColor={endColor} />

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
          />
        </div>

        <div className="mt-4">
          <p className="mb-2 text-sm">How would you like to support your space?</p>
          <div className="flex gap-4">
            <button
              type="button"
              className={`flex-1 px-4 py-3 rounded-lg border transition-all ${
                plan === "monthly"
                  ? "bg-white/10 border-white"
                  : "bg-white/5 border-white/30 hover:border-white/50"
              }`}
              onClick={() => setPlan("monthly")}
            >
              ✨ Monthly Flow <br /> <span className="text-sm">$5/month</span>
            </button>
            <button
              type="button"
              className={`flex-1 px-4 py-3 rounded-lg border transition-all ${
                plan === "yearly"
                  ? "bg-white/10 border-white"
                  : "bg-white/5 border-white/30 hover:border-white/50"
              }`}
              onClick={() => setPlan("yearly")}
            >
              🌙 Deep Commitment <br /> <span className="text-sm">$50/year</span>
            </button>
          </div>
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
