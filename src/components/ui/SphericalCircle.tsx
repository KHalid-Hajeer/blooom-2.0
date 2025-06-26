// src/components/ui/SphericalCircle.tsx
"use client";
import React, { useState, useEffect } from "react";

interface SphericalCircleProps {
  color: string;
  className?: string;
  isRadiant?: boolean; // New prop to control the radiant glow
  children?: React.ReactNode;
}

const lightenColor = (hex: string, percent: number): string => {
    hex = hex.replace(/^#/, '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const newR = Math.min(255, Math.floor(r * (1 + percent / 100)));
    const newG = Math.min(255, Math.floor(g * (1 + percent / 100)));
    const newB = Math.min(255, Math.floor(b * (1 + percent / 100)));
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
};

export default function SphericalCircle({
  color,
  className = '',
  isRadiant = false,
  children,
}: SphericalCircleProps) {
  const [angle, setAngle] = useState(45);

  useEffect(() => {
    let frameId: number;
    const animateSheen = () => {
      setAngle((prev) => (prev + 0.15) % 360);
      frameId = requestAnimationFrame(animateSheen);
    };
    frameId = requestAnimationFrame(animateSheen);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const highlightColor = lightenColor(color, 40);

  const sphericalStyle = {
    background: `radial-gradient(circle at 35% 35%, ${highlightColor}, ${color})`,
  };

  const interactiveGradientStyle = {
    background: `linear-gradient(${angle}deg, transparent 40%, rgba(255, 255, 255, 0.15) 60%, transparent 80%)`,
  };

  // 1. Shadow is now stronger (shadow-xl)
  // 4. Added a conditional glowing ring for radiant systems
  return (
    <div
      className={`rounded-full shadow-xl relative ${className}`}
      style={sphericalStyle}
    >
      <div className="absolute inset-0 rounded-full" style={interactiveGradientStyle} />
      <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)]" />
      {isRadiant && (
        <div 
          className="absolute -inset-1 rounded-full animate-pulse"
          style={{ boxShadow: `0 0 20px 5px ${color}`}} 
        />
      )}
      {children}
    </div>
  );
}
