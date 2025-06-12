import React from 'react';

// =================================================================================
// --- FILE: /components/onboarding/StepOne.tsx ---
// This is the very first screen the user sees in the onboarding flow. Its only
// purpose is to provide a warm welcome and a clear call-to-action to begin.
// =================================================================================
export default function StepOne({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-background text-text p-6">
      {/* Wrapper to shift content up from the center for better visual balance */}
      <div className="transform -translate-y-1/4">
        <h1 className="text-6xl md:text-8xl font-bold font-display text-primary leading-tight">
          Bloom
        </h1>
        <p className="text-xl font-body max-w-md mt-4">
          Welcome to your new space. Let's begin by planting a single intention.
        </p>
        <button
          onClick={onNext}
          className="mt-10 px-10 py-4 bg-primary text-background font-bold font-display text-lg rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300"
        >
          Let's Begin
        </button>
      </div>
    </div>
  );
}
