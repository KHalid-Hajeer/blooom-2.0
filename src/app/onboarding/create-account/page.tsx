// src/app/onboarding/create-account/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import InteractiveGradient from "@/components/animation/interactive-gradient";
import Typewriter from "@/components/animation/typewriter";
import Link from "next/link";

export default function CreateAccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    
    if (data.user?.identities?.length === 0) {
      setError("This user already exists. Please try logging in.");
      return;
    }

    setMessage("Success! Please check your email to confirm your account.");
    
    // --- ADDED: Redirect to /hub after sign-up is initiated ---
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
          <label className="mb-1 text-sm">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-transparent border-b border-white/40 focus:border-white py-2 px-1 outline-none transition-all"
            required
            disabled={loading}
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
            disabled={loading}
          />
        </div>
        
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        {message && <p className="text-green-400 text-sm text-center">{message}</p>}

        <motion.button
          type="submit"
          whileTap={{ scale: 0.98 }}
          className="mt-8 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Creating..." : "Begin My Journey"}
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