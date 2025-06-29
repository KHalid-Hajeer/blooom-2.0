// src/app/onboarding/create-account/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import InteractiveGradient from "@/components/animation/interactive-gradient";
import Typewriter from "@/components/animation/typewriter";
import Link from "next/link";
import { User } from "@supabase/supabase-js";

const PENDING_SYSTEM_KEY = 'bloom_pending_system';

const savePendingSystem = async (user: User) => {
    const pendingSystemJSON = localStorage.getItem(PENDING_SYSTEM_KEY);
    if (pendingSystemJSON) {
        try {
            const systemData = JSON.parse(pendingSystemJSON);
            const { error } = await supabase.from('systems').insert({
                name: systemData.name,
                description: systemData.description,
                color: systemData.color,
                stage: systemData.stage,
                x_pos: systemData.x,
                y_pos: systemData.y,
                user_id: user.id,
            });
            if (error) throw error;
            localStorage.removeItem(PENDING_SYSTEM_KEY);
        } catch (error) {
            console.error("Failed to save pending system:", error);
        }
    }
};

export default function CreateAccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    
    if (data.user?.identities?.length === 0) {
      setError("This user already exists. Please try logging in.");
      return;
    }

    setMessage("Success! Please check your email to confirm your account.");
    
    // Auto-login the user after sign-up
    const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    
    if (signInError) {
      setError(signInError.message);
    } else if (user) { // FIX: Ensure user object exists before proceeding
      await savePendingSystem(user);
      
      localStorage.setItem('onboardingCompleted', 'true');
      localStorage.removeItem('onboardingStep');
      router.push("/hub");
    } else {
      setError("Login failed after sign up. Please try logging in manually.");
    }
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
        
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        {message && <p className="text-green-400 text-sm text-center">{message}</p>}

        <motion.button
          type="submit"
          whileTap={{ scale: 0.98 }}
          className="mt-8 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition"
        >
          Begin My Journey
        </motion.button>
        <p className="text-center text-sm mt-4">
          Already have a space?{' '}
          <Link href="/login" className="underline hover:text-white">
            Enter here
          </Link>
        </p>
      </form>
    </div>
  );
}