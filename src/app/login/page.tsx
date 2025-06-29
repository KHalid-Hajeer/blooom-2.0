// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import InteractiveGradient from "@/components/animation/interactive-gradient";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/hub");
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-8 overflow-hidden">
      <InteractiveGradient startColor={'#1e293b'} endColor={'#4a4a88'} />

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-display text-3xl md:text-5xl text-white/90 mb-8 max-w-2xl text-center z-10"
      >
        Welcome Back
      </motion.h1>

      <form
        onSubmit={handleLogin}
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

        <motion.button
          type="submit"
          whileTap={{ scale: 0.98 }}
          className="mt-8 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition"
        >
          Enter Your Space
        </motion.button>

        <p className="text-center text-sm mt-4">
          Don't have a space yet?{' '}
          <Link href="/onboarding/create-account" className="underline hover:text-white">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
