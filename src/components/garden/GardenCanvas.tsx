// src/components/garden/GardenCanvas.tsx
"use client";
import React, { useState, useEffect } from "react";
import SystemShape from "./SystemShape";
import Particle from "./Particle";
import { System } from "@/lib/growthtypes";
import { PanInfo, AnimatePresence } from "framer-motion"; // Import AnimatePresence

// Layout calculation logic
const calculatePositions = (systems: System[], mode: string, dimensions: { width: number, height: number }) => {
    if (mode === 'freeform') {
        // In freeform, we use the x/y from the system's state
        return systems.map(sys => ({ ...sys, x: sys.x, y: sys.y }));
    }

    if (mode === 'chronological') {
        const sortedSystems = [...systems].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        return sortedSystems.map((sys, index) => {
            const x = (dimensions.width * 0.15) + (index * (dimensions.width * 0.7) / (systems.length - 1 || 1));
            const y = (dimensions.height * 0.5) + (dimensions.height * (index % 2 === 0 ? -0.1 : 0.1));
            return { ...sys, x, y };
        });
    }
  
    if (mode === 'theme') {
        const themes: { [color: string]: System[] } = {};
        systems.forEach(sys => {
            if (!themes[sys.color]) themes[sys.color] = [];
            themes[sys.color].push(sys);
        });

        const positionedSystems: System[] = [];
        let currentY = dimensions.height * 0.20;
        Object.values(themes).forEach(group => {
            group.forEach((sys, index) => {
                const x = (dimensions.width * 0.15) + (index * (dimensions.width * 0.7) / (group.length || 1));
                const y = currentY;
                positionedSystems.push({ ...sys, x, y });
            });
            currentY += dimensions.height * 0.25;
        });
        return positionedSystems;
    }
    
    return systems;
};


export default function GardenCanvas({ 
  systems, 
  viewMode,
  onSystemClick,
  onViewSystemLogs,
  onDragEnd,
}: { 
  systems: System[];
  viewMode: string;
  onSystemClick: (system: System) => void;
  onViewSystemLogs: (system: System) => void;
  onDragEnd: (id: number, info: PanInfo) => void;
}) {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        // Set initial dimensions and add resize listener
        const updateDimensions = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    if (dimensions.width === 0) {
        return null; // Don't render until we have dimensions
    }
  
    const positionedSystems = calculatePositions(systems, viewMode, dimensions);

    return (
        <div className="absolute inset-0 z-0 w-full h-full">
            <div className="absolute inset-0 rounded-full pointer-events-none opacity-30 bg-white/20 mix-blend-soft-light blur-3xl" />
            {Array.from({ length: 8 }).map((_, i) => (
                <Particle key={i} />
            ))}
            {/* Wrap the mapping with AnimatePresence to handle enter/exit animations */}
            <AnimatePresence>
                {positionedSystems.map((sys) => (
                    <SystemShape 
                        key={sys.id} 
                        {...sys} 
                        isDraggable={viewMode === 'freeform'}
                        onDragEnd={onDragEnd}
                        onClick={() => onSystemClick(sys)}
                        onViewLogsClick={(e) => {
                            e.stopPropagation();
                            onViewSystemLogs(sys);
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
