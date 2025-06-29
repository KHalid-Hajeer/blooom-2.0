// src/components/space/MemorySpace.tsx

"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PlanetData, planets as planetDataList } from '@/lib/planets';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import InteractiveGradient from '../animation/interactive-gradient';
import Typewriter from '../animation/typewriter';

interface MemorySpaceProps {
  onboardingStep: number | null;
}

const onboardingMessages: { [key: number]: string } = {
  0: "Welcome to your space. This is the Garden, where your intentions grow. Click it to begin.",
  1: "Beautiful. A new planet has appeared. This is Journeys, where you can follow guided paths. Let's go.",
  2: "This is your Chronicle. A place for your reflections. Let's add your first entry.",
  3: "You're never alone. This is your Companion, a safe space to feel heard.",
  4: "And here are your Settings. The control room for your inner world.",
  5: "Your space is now complete. You can now explore freely."
};

const getColor = (varName: string, fallback = '#ffffff') => {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return value || fallback;
};

type HoveredItem = {
  type: 'planet' | 'sun';
  item: PlanetData | { name: string };
  x: number;
  y: number;
};

class PlanetParticle {
  x = 0; y = 0; angle: number; data: PlanetData;
  ripple: { alpha: number; scale: number } | null = null;

  constructor(data: PlanetData) {
    this.data = data;
    this.angle = Math.random() * Math.PI * 2;
  }

  update(scale: number) {
    this.angle += this.data.orbitSpeed;
    this.x = Math.cos(this.angle) * this.data.orbitRadius * scale;
    this.y = Math.sin(this.angle) * this.data.orbitRadius * scale;
  }
}

const SUN_RADIUS = 80;

export default function MemorySpace({ onboardingStep }: MemorySpaceProps) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const planetsRef = useRef<PlanetParticle[]>([]);
  const panRef = useRef({ x: 0, y: 0 });
  const [hoveredItem, setHoveredItem] = useState<HoveredItem | null>(null);
  // FIX: Removed unused 'zoomedPlanet' state.
  // const [zoomedPlanet, setZoomedPlanet] = useState<PlanetParticle | null>(null);
  
  const isOnboarding = onboardingStep !== null && onboardingStep < 999;
  
  const visiblePlanets = isOnboarding
    ? planetDataList.slice(0, onboardingStep !== null ? onboardingStep + 1 : 0)
    : planetDataList;

  useEffect(() => {
    planetsRef.current = planetDataList.map(p => new PlanetParticle(p));
  }, []);

  const handlePlanetClick = useCallback((planet: PlanetParticle) => {
    if (isOnboarding && onboardingStep !== null && planet.data.name !== planetDataList[onboardingStep].name) {
      return; // Block clicks on non-active onboarding planets
    }
    // FIX: Removed unused state update. The timeout handles the navigation delay.
    // setZoomedPlanet(planet); 
    setTimeout(() => {
      router.push(planet.data.route);
    }, 600);
  }, [isOnboarding, onboardingStep, router]);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const dpr = window.devicePixelRatio || 1;

    const resizeCanvas = () => {
      const { innerWidth: width, innerHeight: height } = window;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      panRef.current = { x: width / 2, y: height / 2 };
    };

    resizeCanvas();

    const drawPlanet = (p: PlanetParticle, isHovered: boolean, isGlowing: boolean) => {
      const scale = Math.min(window.innerWidth, window.innerHeight) / 900;
      const { size, gradient, glowColorVar } = p.data;
      const radius = size * scale + (isHovered ? 5 : 0);

      const grad = ctx.createRadialGradient(p.x - radius * 0.3, p.y - radius * 0.3, radius * 0.1, p.x, p.y, radius);
      grad.addColorStop(0, getColor(gradient.startVar));
      grad.addColorStop(1, getColor(gradient.endVar));
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      
      ctx.shadowColor = getColor(glowColorVar);
      ctx.shadowBlur = isHovered || isGlowing ? 30 : 0;
      
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const render = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      ctx.save();
      ctx.translate(panRef.current.x, panRef.current.y);

      planetsRef.current.forEach(p => p.update(Math.min(canvas.width, canvas.height) / (900 * dpr)));

      visiblePlanets.forEach(planetData => {
        const p = planetsRef.current.find(cp => cp.data.name === planetData.name);
        if (p) {
          ctx.beginPath();
          ctx.arc(0, 0, p.data.orbitRadius * (Math.min(canvas.width, canvas.height) / (900*dpr)), 0, Math.PI*2);
          ctx.strokeStyle = 'rgba(255,255,255,0.05)';
          ctx.stroke();

          const isHovered = hoveredItem?.item.name === p.data.name;
          const isGlowing = isOnboarding && onboardingStep !== null && p.data.name === planetDataList[onboardingStep].name;
          drawPlanet(p, isHovered, isGlowing);
        }
      });
      
      const sunRadius = SUN_RADIUS * (Math.min(canvas.width, canvas.height) / (900*dpr));
      const sunGrad = ctx.createRadialGradient(0, 0, sunRadius * 0.5, 0, 0, sunRadius);
      sunGrad.addColorStop(0, getColor('--sun-start'));
      sunGrad.addColorStop(1, getColor('--sun-end'));
      ctx.beginPath();
      ctx.arc(0, 0, sunRadius, 0, Math.PI * 2);
      ctx.fillStyle = sunGrad;
      ctx.fill();
      
      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) - panRef.current.x;
        const mouseY = (e.clientY - rect.top) - panRef.current.y;
        
        let currentlyHovered: HoveredItem | null = null;
        for (const planetData of visiblePlanets) {
            const p = planetsRef.current.find(cp => cp.data.name === planetData.name);
            if(p) {
                const dist = Math.hypot(mouseX - p.x, mouseY - p.y);
                if (dist < p.data.size * (Math.min(canvas.width, canvas.height) / (900 * dpr))) {
                    currentlyHovered = { type: 'planet', item: p.data, x: e.clientX, y: e.clientY };
                    break;
                }
            }
        }
        setHoveredItem(currentlyHovered);
        if (canvas.style) {
          canvas.style.cursor = currentlyHovered ? 'pointer' : 'default';
        }
    };

    const handleClick = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) - panRef.current.x;
        const mouseY = (e.clientY - rect.top) - panRef.current.y;
        
        for (const planetData of visiblePlanets) {
            const p = planetsRef.current.find(cp => cp.data.name === planetData.name);
            if (p) {
                 const dist = Math.hypot(mouseX - p.x, mouseY - p.y);
                 if (dist < p.data.size * (Math.min(canvas.width, canvas.height) / (900*dpr))) {
                    handlePlanetClick(p);
                    return;
                }
            }
        }
    };

    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', resizeCanvas);
        if (canvas) {
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('click', handleClick);
        }
    };
  }, [visiblePlanets, router, handlePlanetClick, hoveredItem, isOnboarding, onboardingStep]);

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
      <InteractiveGradient startColor="var(--color-heavy-start)" endColor="var(--color-heavy-end)" />
      <canvas ref={canvasRef} className="absolute top-0 left-0" />
      <AnimatePresence>
        {isOnboarding && onboardingStep !== null && onboardingMessages[onboardingStep] &&
          <motion.div
            key={onboardingStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl text-center text-white/90 text-lg p-4 z-20 font-display bg-black/30 backdrop-blur-sm rounded-xl"
          >
            <Typewriter text={onboardingMessages[onboardingStep]} speed={60} delay={0.5} />
          </motion.div>
        }
      </AnimatePresence>
    </div>
  );
}