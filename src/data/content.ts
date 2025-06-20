// src/data/content.ts
import React from "react"; // Import React for JSX types
import ThoughtCatcher from "@/components/clearing/thought-catcher";
import BreathingAnchor from "@/components/clearing/breathing-anchor";
import Radiate from "@/components/clearing/radiate";
import Stargazing from "@/components/clearing/stargazing";

interface WispData {
  color: string; // CSS linear-gradient string
  word: string;
  path: string; // URL path segment
  startColor: string; // CSS variable name
  endColor: string; // CSS variable name
  component: React.ReactNode; // JSX element for the grounding experience
  reflection: string;
  quote: string;
  groundingInstruction: string; // New: Instruction for the grounding experience
  callToAction: string; // New: Call to action for interaction
}

export const wisps: WispData[] = [
  {
    color: "linear-gradient(135deg, var(--color-joy-start), var(--color-joy-end))",
    word: "Joy",
    path: "joy",
    startColor: "var(--color-joy-start)",
    endColor: "var(--color-joy-end)",
    component: React.createElement(Radiate),
    reflection: "Joy is not in things; it is in us. What light did you share today?",
    quote: "Happiness is not something ready-made. It comes from your own actions.",
    groundingInstruction: "Click around the center to radiate light and expand your joy.",
    callToAction: "Click here!",
  },
  {
    color: "linear-gradient(135deg, var(--color-sadness-start), var(--color-sadness-end))",
    word: "Sadness",
    path: "sadness",
    startColor: "var(--color-sadness-start)",
    endColor: "var(--color-sadness-end)",
    component: React.createElement(BreathingAnchor),
    reflection: "Tears are words the heart can't express. What did your heart whisper?",
    quote: "Even the darkest night will end, and the sun will rise.",
    groundingInstruction: "Sync your breath with the expanding and contracting light.",
    callToAction: "Breathe with the circle.",
  },
  {
    color: "linear-gradient(135deg, var(--color-fear-start), var(--color-fear-end))",
    word: "Fear",
    path: "fear",
    startColor: "var(--color-fear-start)",
    endColor: "var(--color-fear-end)",
    component: React.createElement(Stargazing),
    reflection: "Courage is not the absence of fear, but the triumph over it. What new perspectives did you find?",
    quote: "Feel the fear and do it anyway.",
    groundingInstruction: "Look for the stars and let them guide you. Move your mouse to explore the night sky.",
    callToAction: "Explore the night sky.",
  },
  {
    color: "linear-gradient(135deg, var(--color-anger-start), var(--color-anger-end))",
    word: "Anger",
    path: "anger",
    startColor: "var(--color-anger-start)",
    endColor: "var(--color-anger-end)",
    component: React.createElement(ThoughtCatcher),
    reflection: "Anger is a wind that blows out the lamp of the mind. What thoughts did you release?",
    quote: "Speak when you are angry, and you will make the best speech you will ever regret.",
    groundingInstruction: "Type your thoughts and press Enter or click 'Release' to let them go.",
    callToAction: "Type and release your thoughts.",
  },
];