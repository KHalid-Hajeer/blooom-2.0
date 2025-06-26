'use client';
import { ReactNode } from "react";
import { useParams } from "next/navigation";
import InteractiveGradient from "../../../components/animation/interactive-gradient";

export default function FeelingLayout({ children }: { children: ReactNode }) {
  const params = useParams();
  const rawFeeling = params.feeling;
  const feelingParam = Array.isArray(rawFeeling) ? rawFeeling[0] : rawFeeling ?? "joy";

  const gradientVarMap: Record<string, { startVar: string; endVar: string }> = {
    joy:     { startVar: "--color-joy-start",    endVar: "--color-joy-end"    },
    sadness: { startVar: "--color-sadness-start", endVar: "--color-sadness-end" },
    fear:    { startVar: "--color-fear-start",    endVar: "--color-fear-end"    },
    anger:   { startVar: "--color-anger-start",   endVar: "--color-anger-end"   },
  };
  const emotion = gradientVarMap[feelingParam] ? feelingParam : "joy";
  const { startVar, endVar } = gradientVarMap[emotion];

  return (
    <div className="relative min-h-screen flex flex-col">
      <InteractiveGradient
        startColor={`var(${startVar})`}
        endColor={`var(${endVar})`}
      />
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}