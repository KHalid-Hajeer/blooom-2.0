"use client";
import { useEffect, useRef } from "react";

const AFFIRMING_WORDS = ["steady", "breathe", "present", "calm", "safe"];

export default function Stargazing() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Store refs in variables to ensure stable values
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = container.clientHeight);

    const STAR_COUNT = 500;
    // FIX: Use 'const' for arrays/objects that are mutated but not reassigned.
    const stars: { x: number; y: number; radius: number; alpha: number; isConstellation?: boolean }[] = [];
    const constellations: { points: { x: number; y: number; radius: number; alpha: number; isConstellation: boolean }[]; word: string }[] = [];

    // FIX: Use 'const' for objects whose properties are changed.
    const mouse = { x: 0, y: 0 };
    const pan = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let isDragging = false;
    let hoveredConstellation: number | null = null;

    const createStar = (initial = false) => {
      let x = 0, y = 0;
      if (initial) {
          x = Math.random() * width;
          y = Math.random() * height;
      } else {
          const edge = Math.floor(Math.random() * 4);
          const buffer = 50;
          switch(edge) {
              case 0: x = Math.random() * width; y = -buffer; break;
              case 1: x = width + buffer; y = Math.random() * height; break;
              case 2: x = Math.random() * width; y = height + buffer; break;
              case 3: x = -buffer; y = Math.random() * height; break;
              default: x = Math.random() * width; y = Math.random() * height;
          }
      }
      return { x: x - pan.x, y: y - pan.y, radius: Math.random() * 1 + 0.5, alpha: Math.random() * 0.5 + 0.3, isConstellation: false };
    };

    const populateUniverse = () => {
      for(let i=0; i< STAR_COUNT; i++) stars.push(createStar(true));
      for (let i = 0; i < 5; i++) {
        const constellationPoints: { x: number; y: number; radius: number; alpha: number; isConstellation: boolean }[] = [];
        const startX = Math.random() * width * 4 - width * 2;
        const startY = Math.random() * height * 4 - height * 2;
        const firstPoint = { x: startX, y: startY, radius: 2, alpha: 0.9, isConstellation: true };
        constellationPoints.push(firstPoint);
        stars.push(firstPoint);
        for (let j = 0; j < Math.floor(Math.random() * 4) + 2; j++) {
            const nextPoint = { x: constellationPoints[j].x + (Math.random() - 0.5) * 150, y: constellationPoints[j].y + (Math.random() - 0.5) * 150, radius: Math.random() * 1 + 1.5, alpha: Math.random() * 0.2 + 0.7, isConstellation: true };
            constellationPoints.push(nextPoint);
            stars.push(nextPoint);
        }
        constellations.push({ points: constellationPoints, word: AFFIRMING_WORDS[i % AFFIRMING_WORDS.length] });
      }
    };

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      pan.x += (pan.targetX - pan.x) * 0.05;
      pan.y += (pan.targetY - pan.y) * 0.05;
      const nebulaGradient = ctx.createRadialGradient(width / 2 + pan.x * 0.2, height / 2 + pan.y * 0.2, 0, width / 2 + pan.x * 0.2, height / 2 + pan.y * 0.2, Math.max(width, height));
      nebulaGradient.addColorStop(0, 'rgba(179, 168, 217, 0.1)');
      nebulaGradient.addColorStop(1, 'rgba(92, 84, 112, 0)');
      ctx.fillStyle = nebulaGradient;
      ctx.fillRect(0, 0, width, height);
      
      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        const screenX = s.x + pan.x;
        const screenY = s.y + pan.y;
        ctx.beginPath();
        ctx.arc(screenX, screenY, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = s.isConstellation ? `rgba(200, 230, 255, ${s.alpha})` : `rgba(255, 255, 255, ${s.alpha})`;
        ctx.fill();
        const buffer = 100;
        if (!s.isConstellation && (screenX < -buffer || screenX > width + buffer || screenY < -buffer || screenY > height + buffer)) stars.splice(i, 1);
      }
      while (stars.filter(s => !s.isConstellation).length < STAR_COUNT) stars.push(createStar(false));
      hoveredConstellation = null;
      constellations.forEach((constellation, index) => {
        const firstPoint = constellation.points[0]; const lastPoint = constellation.points[constellation.points.length - 1]; const centerX = (firstPoint.x + lastPoint.x) / 2; const centerY = (firstPoint.y + lastPoint.y) / 2; const dist = Math.hypot(mouse.x - (centerX + pan.x), mouse.y - (centerY + pan.y)); if (dist < 100) hoveredConstellation = index;
      });
      if(hoveredConstellation !== null) {
          const c = constellations[hoveredConstellation]; ctx.beginPath(); ctx.moveTo(c.points[0].x + pan.x, c.points[0].y + pan.y); for(let i=1; i < c.points.length; i++) ctx.lineTo(c.points[i].x + pan.x, c.points[i].y + pan.y); ctx.strokeStyle = "rgba(200, 230, 255, 0.4)"; ctx.stroke(); c.points.forEach(p => { ctx.beginPath(); ctx.arc(p.x + pan.x, p.y + pan.y, p.isConstellation ? p.radius + 1 : 5, 0, Math.PI * 2); ctx.fillStyle = "rgba(200, 230, 255, 0.9)"; ctx.shadowBlur = 15; ctx.shadowColor = "lightblue"; ctx.fill(); ctx.shadowBlur = 0; }); ctx.fillStyle = "rgba(255, 255, 255, 1)"; ctx.font = "20px var(--font-body)"; ctx.textAlign = "center"; ctx.fillText(c.word, mouse.x, mouse.y - 30);
      }
    };
    let animationFrameId: number;
    const animate = () => { draw(); animationFrameId = requestAnimationFrame(animate); };
    const handleMouseMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; if (isDragging) { pan.targetX += e.movementX; pan.targetY += e.movementY; } };
    const handleMouseDown = (e: MouseEvent) => { if(e.button === 0) isDragging = true; };
    const handleMouseUp = () => isDragging = false;
    const handleMouseLeave = () => isDragging = false;
    const resizeObserver = new ResizeObserver(() => { width = canvas.width = container.clientWidth; height = canvas.height = container.clientHeight; });
    
    // FIX: Use the stable 'container' variable to add listeners and observe.
    resizeObserver.observe(container);
    container.addEventListener("mousemove", handleMouseMove); 
    container.addEventListener("mousedown", handleMouseDown); 
    container.addEventListener("mouseup", handleMouseUp); 
    container.addEventListener("mouseleave",handleMouseLeave);
    
    populateUniverse(); 
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      // FIX: Use the stable 'container' variable in the cleanup function.
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mousedown", handleMouseDown);
        container.removeEventListener("mouseup", handleMouseUp);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="relative flex items-center justify-center h-full w-full overflow-hidden cursor-move font-body">
      <canvas ref={canvasRef} className="absolute top-0 left-0" />
      <div className="z-10 text-center text-xl text-white/90 pointer-events-none p-4">
        Look for the stars and let them guide you.
      </div>
    </div>
  );
}