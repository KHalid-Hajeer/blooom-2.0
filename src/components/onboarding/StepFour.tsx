"use client";

// Remove useRouter, as this component should not control navigation.
// Its parent component will handle navigation after the goal is saved.

type StepFourProps = {
  onBack: () => void;
  // This prop will be called when the user clicks the final button.
  onComplete: () => void;
};

export default function StepFour({ onBack, onComplete }: StepFourProps) {
  // The handleComplete function is no longer needed here.
  // The 'onComplete' function is now passed directly from the parent.

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-background text-text p-6">
      <h1 className="absolute top-6 left-6 text-2xl font-display text-primary">bloom</h1>
      <p className="text-2xl font-display mb-6">Wonderful. Let's plant your first seed.</p>
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="font-bold font-display text-text-muted hover:text-text transition-colors"
        >
          Back
        </button>
        {/*
          The onClick now calls the onComplete prop.
          This tells the parent Onboarding.tsx component to save the goal and then navigate.
        */}
        <button
          onClick={onComplete}
          className="px-10 py-4 bg-primary text-background font-bold font-display text-lg rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300"
        >
          Plant My First Seed
        </button>
      </div>
    </div>
  );
}
