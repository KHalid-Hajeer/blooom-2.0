import React from 'react';

// Add `as const` to infer the most specific types for the array elements.
// This makes the `secondary` properties specific string literals, not just `string`.
export const paceOptions = [
  { primary: "A Gentle Monthly Moment", secondary: "Once a month" },
  { primary: "A Weekly Touchpoint", secondary: "Once a week" },
  { primary: "A Regular Rhythm", secondary: "3 times a week" },
  { primary: "A Daily Practice", secondary: "Once a day" },
  { primary: "With Intention, Twice a Day", secondary: "Morning & Night" },
] as const;

type StepThreeProps = {
    onNext: () => void;
    onBack: () => void;
    rhythmIndex: number;
    setRhythmIndex: (value: number) => void;
};

export default function StepThree({ onNext, onBack, rhythmIndex, setRhythmIndex }: StepThreeProps) {
  const currentPace = paceOptions[rhythmIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-background text-text p-6">
      <h1 className="absolute top-6 left-6 text-2xl font-display text-primary">bloom</h1>
      <p className="text-2xl font-display mb-6">What&apos;s your ideal rhythm?</p>
      
      <input
        type="range"
        min="0"
        max={paceOptions.length - 1} 
        value={rhythmIndex}
        onChange={(e) => setRhythmIndex(Number(e.target.value))}
        className="w-full max-w-sm mb-4 accent-primary"
      />
      
      <div className="mb-6 h-12"> 
        <p className="text-lg font-body text-text">
          {currentPace.primary}
        </p>
        <p className="text-sm font-body text-text-muted">
          {currentPace.secondary}
        </p>
      </div>
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
