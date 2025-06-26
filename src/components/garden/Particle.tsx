// src/components/garden/Particle.tsx
import React from "react";

export default function Particle() {
  const left = `${Math.random() * 100}%`;
  const top = `${Math.random() * 100}%`;
  const delay = `${Math.random() * 5}s`;
  const size = `${Math.random() * 6 + 4}px`;

  return (
    <div
      className="absolute rounded-full bg-white/10 animate-float opacity-20"
      style={{
        left,
        top,
        width: size,
        height: size,
        animationDelay: delay,
        animationDuration: "10s",
      }}
    />
  );
}
