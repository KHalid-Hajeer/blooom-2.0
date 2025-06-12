import React from 'react';

// =================================================================================
// --- FILE: /components/onboarding/StepTwo.tsx ---
// This component now receives state and a setter function from its parent.
// This is a common pattern in React called "lifting state up" or creating a
// "controlled component."
// =================================================================================

// The props are updated to include the intention state and its setter function.
type StepTwoProps = {
  onNext: () => void;
  onBack: () => void;
  intention: string;
  setIntention: (value: string) => void;
};

export default function StepTwo({ onNext, onBack, intention, setIntention }: StepTwoProps) {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-background text-text p-6">
      <h1 className="absolute top-6 left-6 text-2xl font-display text-primary">bloom</h1>
      <p className="text-2xl font-display mb-6">What is one thing you&apos;ve always wanted to do?</p>
      
      <input
        type="text"
        value={intention}
        onChange={(e) => setIntention(e.target.value)}
        placeholder="e.g., Morning 15 minute read, run a weekly 5k, ..."
        className="border border-primary/30 p-3 rounded-lg w-full max-w-md mb-6 bg-background focus:ring-2 focus:ring-primary focus:outline-none"
      />
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="font-bold font-display text-text-muted hover:text-text transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-8 py-3 bg-primary text-background font-bold font-display text-md rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}
