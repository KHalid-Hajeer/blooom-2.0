"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Terminal } from '@/components/settings/Terminal';

export default function SettingsPage() {
  useEffect(() => {
    const step = localStorage.getItem('onboardingStep');
    if (step === '4') {
      localStorage.setItem('onboardingStep', '5'); // Mark as seen
      // You can add a modal here to explain settings
      // For now, we just advance the step
    }
  }, []);

  return (
    <main className="w-full h-screen interactive-gradient-background flex flex-col items-center justify-center p-4">
       <nav className="absolute top-4 left-4 z-20">
          <Link href="/hub" className="text-white/70 hover:text-white transition">
            ← Back to Hub
          </Link>
        </nav>
      <Terminal />
    </main>
  );
}
