'use client';

type Step = "quote" | "grounding" | "reflection";
const steps: Step[] = ["quote", "grounding", "reflection"];

interface ProgressBarProps {
  step: Step;
}

export default function ProgressBar({ step }: ProgressBarProps) {
  return (
    <div className="flex justify-center space-x-2">
      {steps.map(s => (
        <span
          key={s}
          className={`w-3 h-3 rounded-full transition-opacity duration-300 ${
            s === step ? 'opacity-100' : 'opacity-50'
          }`}
        />
      ))}
    </div>
  );
}