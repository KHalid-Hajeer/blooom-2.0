"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PlanetData, planets as planetDataList } from '@/lib/planets';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import InteractiveGradient from '../animation/interactive-gradient';
import Typewriter from '../animation/typewriter';

const colorCache = new Map<string, string>();
const getColor = (varName: string, fallback = '#ffffff') => {
  if (colorCache.has(varName)) return colorCache.get(varName)!;
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  const isValid = /^#?([a-fA-F0-9]{3,6})$/.test(value) || value.startsWith('rgb');
  const color = isValid ? value : fallback;
  colorCache.set(varName, color);
  return color;
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
    if (this.ripple) {
      this.ripple.alpha *= 0.92;
      this.ripple.scale += 0.05;
      if (this.ripple.alpha < 0.05) this.ripple = null;
    }
  }

  triggerRipple() {
    this.ripple = { alpha: 1, scale: 1 };
  }
}

const SUN_RADIUS = 80;

export default function MemorySpace() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const planetsRef = useRef<PlanetParticle[]>([]);
  const panRef = useRef({ x: 0, y: 0 });
  const scaleRef = useRef(1);
  const hoveredItemRef = useRef<HoveredItem | null>(null);
  const lastVisitedPlanetNameRef = useRef<string | null>(null);

  const [hoveredItem, setHoveredItem] = useState<HoveredItem | null>(null);
  const [zoomedPlanet, setZoomedPlanet] = useState<PlanetParticle | null>(null);
  const [showSunQuote, setShowSunQuote] = useState(false);

  useEffect(() => {
    planetsRef.current = planetDataList.map(p => new PlanetParticle(p));
    panRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    lastVisitedPlanetNameRef.current = localStorage.getItem('lastVisitedPlanet');
  }, []);

  const handleCanvasClick = useCallback((e: MouseEvent) => {
    if (zoomedPlanet) return;

    const hovered = hoveredItemRef.current;
    if (hovered?.type === 'planet') {
      const planetParticle = planetsRef.current.find(p => p.data.name === (hovered.item as PlanetData).name);
      if (planetParticle) {
        localStorage.setItem('lastVisitedPlanet', planetParticle.data.name);
        setZoomedPlanet(planetParticle);
        setTimeout(() => {
          const { startVar, endVar } = planetParticle.data.gradient;
          const start = getColor(startVar).replace('#', '');
          const end = getColor(endVar).replace('#', '');
          router.push(`${planetParticle.data.route}?bg_start=${start}&bg_end=${end}`);
        }, 600);
      }
    }

    if (hovered?.type === 'sun') setShowSunQuote(true);
  }, [zoomedPlanet, router]);

  useEffect(() => {
    if (!showSunQuote) return;
    const timeout = setTimeout(() => setShowSunQuote(false), 5000);
    return () => clearTimeout(timeout);
  }, [showSunQuote]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      panRef.current = { x: width / 2, y: height / 2 };
    };

    resizeCanvas();

    const mouse = { x: 0, y: 0 };
    let animationFrameId: number;

    const drawSun = (radius: number, isHovered: boolean, pulse: number) => {
      const grad = ctx.createRadialGradient(0, 0, radius * 0.5, 0, 0, radius);
      grad.addColorStop(0, getColor('--sun-start', '#fff7b2'));
      grad.addColorStop(1, getColor('--sun-end', '#ffd97d'));
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, radius + pulse * 8, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.shadowColor = getColor('--sun-glow', '#ffe066');
      ctx.shadowBlur = isHovered ? 50 : 30;
      ctx.fill();
      ctx.restore();
    };

    const drawOrbit = (planet: PlanetParticle, scale: number) => {
      ctx.beginPath();
      ctx.arc(0, 0, planet.data.orbitRadius * scale, 0, Math.PI * 2);
      const isLastVisited = planet.data.name === lastVisitedPlanetNameRef.current;
      ctx.strokeStyle = isLastVisited ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)';
      ctx.lineWidth = isLastVisited ? 2 : 1;
      ctx.shadowColor = isLastVisited ? '#ffffff' : 'transparent';
      ctx.shadowBlur = isLastVisited ? 10 : 0;
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const drawPlanet = (p: PlanetParticle, isHovered: boolean, scale: number) => {
      const { size, gradient, glowColorVar } = p.data;
      const radius = size * scale + (isHovered ? 5 * scale : 0);

      if (p.ripple) {
        ctx.save();
        ctx.strokeStyle = getColor(gradient.startVar);
        ctx.globalAlpha = p.ripple.alpha;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * p.ripple.scale, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.restore();
      }

      const grad = ctx.createRadialGradient(p.x - radius * 0.3, p.y - radius * 0.3, radius * 0.1, p.x, p.y, radius);
      grad.addColorStop(0, getColor(gradient.startVar));
      grad.addColorStop(1, getColor(gradient.endVar));

      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      if (isHovered) {
        ctx.shadowColor = getColor(glowColorVar);
        ctx.shadowBlur = 30;
      }
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.shadowBlur = 0;

      // --- Draw Moon if this is Companion ---
      if (p.data.name === 'Companion') {
        const moonAngle = performance.now() * 0.0015;
        const moonOrbit = 28 * scale;
        const mx = p.x + Math.cos(moonAngle) * moonOrbit;
        const my = p.y + Math.sin(moonAngle) * moonOrbit;

        ctx.beginPath();
        ctx.arc(mx, my, 6 * scale, 0, Math.PI * 2);
        ctx.fillStyle = getColor('--planet-companion-blue');
        ctx.shadowColor = getColor('--planet-companion-blue');
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Optional orbit path
        ctx.beginPath();
        ctx.arc(p.x, p.y, moonOrbit, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,255,255,0.04)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    const render = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const scale = Math.min(width, height) / 900;
      const sunRadius = SUN_RADIUS * scale;
      const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 800);

      ctx.clearRect(0, 0, width, height);
      ctx.save();

      if (zoomedPlanet) {
        const targetScale = Math.min(width / (zoomedPlanet.data.size * 2), height / (zoomedPlanet.data.size * 2), 5);
        const tx = width / 2 - zoomedPlanet.x * targetScale;
        const ty = height / 2 - zoomedPlanet.y * targetScale;

        panRef.current.x += (tx - panRef.current.x) * 0.12;
        panRef.current.y += (ty - panRef.current.y) * 0.12;
        scaleRef.current += (targetScale - scaleRef.current) * 0.12;
      }

      ctx.translate(panRef.current.x, panRef.current.y);
      ctx.scale(scaleRef.current, scaleRef.current);

      planetsRef.current.forEach(p => p.update(scale));

      const worldMouseX = (mouse.x - panRef.current.x) / scaleRef.current;
      const worldMouseY = (mouse.y - panRef.current.y) / scaleRef.current;

      let currentHovered: HoveredItem | null = null;

      if (!zoomedPlanet && Math.hypot(worldMouseX, worldMouseY) < sunRadius) {
        currentHovered = { type: 'sun', item: { name: 'The Core' }, x: panRef.current.x, y: panRef.current.y };
      }

      if (!currentHovered && !zoomedPlanet) {
        for (const p of planetsRef.current) {
          if (Math.hypot(worldMouseX - p.x, worldMouseY - p.y) < p.data.size * scale + 10) {
            currentHovered = {
              type: 'planet',
              item: p.data,
              x: p.x * scaleRef.current + panRef.current.x,
              y: p.y * scaleRef.current + panRef.current.y,
            };
            break;
          }
        }
      }

      const prev = hoveredItemRef.current;
      const isSame = prev?.type === currentHovered?.type && prev?.item === currentHovered?.item;
      if (!isSame) {
        hoveredItemRef.current = currentHovered;
        setHoveredItem(currentHovered);
        if (currentHovered?.type === 'planet') {
          planetsRef.current.find(p => p.data === currentHovered.item)?.triggerRipple();
        }
      }

      canvas.style.cursor = currentHovered ? 'pointer' : 'default';

      drawSun(sunRadius, hoveredItemRef.current?.type === 'sun', pulse);
      planetsRef.current.forEach(p => drawOrbit(p, scale));
      planetsRef.current.forEach(p => {
        const isHovered = hoveredItemRef.current?.type === 'planet' && hoveredItemRef.current.item === p.data;
        drawPlanet(p, isHovered, scale);
      });

      ctx.restore();
      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    const handleResize = () => resizeCanvas();
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [router, zoomedPlanet, handleCanvasClick]);

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
      <InteractiveGradient startColor="var(--color-heavy-start)" endColor="var(--color-heavy-end)" />
      <canvas ref={canvasRef} className="absolute top-0 left-0" />
      <AnimatePresence>
        {hoveredItem?.type === 'planet' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute p-3 bg-gray-900/80 backdrop-blur-sm text-white rounded-lg pointer-events-none shadow-lg"
            style={{
              left: hoveredItem.x,
              top: hoveredItem.y,
              transform: 'translate(-50%, -150%)'
            }}
          >
            <h3 className="font-bold font-display text-lg">{(hoveredItem.item as PlanetData).name}</h3>
          </motion.div>
        )}
      </AnimatePresence>
      {showSunQuote && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'var(--color-text)',
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(0.75rem, 2vw, 1.1rem)',
            fontWeight: 600,
            textAlign: 'center',
            width: `${SUN_RADIUS * 1.6}px`,
            maxWidth: '80vw',
            pointerEvents: 'none',
            zIndex: 20,
            lineHeight: 1.3,
            textShadow: '0 1px 12px rgba(0,0,0,0.2)'
          }}
        >
          <Typewriter text="Your presence is your power." speed={35} />
        </div>
      )}
    </div>
  );
}
