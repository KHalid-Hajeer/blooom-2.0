// src/components/garden/SystemShape.tsx
"use client";
import React from "react";
import { SystemStage } from "@/lib/growthtypes";
import SphericalCircle from "../ui/SphericalCircle";
import { motion, PanInfo } from "framer-motion";

const stageStyles = {
  planted: "w-8 h-8 opacity-50",
  sprouted: "w-12 h-12 opacity-70",
  blooming: "w-16 h-16 opacity-90",
  radiant: "w-20 h-20 opacity-100",
};

export default function SystemShape({
  id,
  name,
  description,
  stage,
  x,
  y,
  color,
  lastTended,
  isDraggable,
  onDragEnd,
  onClick,
  onViewLogsClick,
}: {
  id: number;
  name: string;
  description: string;
  stage: SystemStage;
  x: number;
  y: number;
  color: string;
  lastTended: string;
  isDraggable: boolean;
  onDragEnd: (id: number, info: PanInfo) => void;
  onClick: () => void;
  onViewLogsClick: (e: React.MouseEvent) => void;
}) {
  return (
    <motion.div
      layout
      drag={isDraggable}
      onDragEnd={(_event, info) => onDragEnd(id, info)}
      dragMomentum={false}
      initial={{ x, y, scale: 0 }}
      animate={{ x, y, scale: 1, translateY: [0, -8, 0] }}
      exit={{ scale: 0 }}
      transition={{
        x: { type: "spring", stiffness: 100, damping: 20 },
        y: { type: "spring", stiffness: 100, damping: 20 },
        scale: { type: "spring", stiffness: 100, damping: 20 },
        translateY: { duration: 10, repeat: Infinity, ease: "easeInOut" },
      }}
      whileHover={{ scale: 1.1, zIndex: 10, translateY: 0 }}
      className={`absolute group cursor-pointer ${stageStyles[stage]}`}
      // 1. By making the main container the click target, we avoid issues.
      onClick={onClick}
    >
      <SphericalCircle
        color={color}
        className="w-full h-full"
        isRadiant={stage === 'radiant'}
      />
      
      {stage === 'radiant' && (
          <div className="absolute inset-0 rounded-full transition-opacity duration-500 opacity-0 group-hover:opacity-100" style={{
              background: `radial-gradient(circle, transparent 40%, ${color} 120%)`,
              transform: 'scale(1.5)',
          }}/>
      )}
      
      {/* 3. The card is now positioned slightly overlapping the top of the circle to create a "bridge" for the mouse. */}
      <div 
        className="absolute left-1/2 bottom-full mb-1 -translate-x-1/2 w-64 text-xs text-white bg-black/40 px-4 py-3 rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto z-20"
        // Stop clicks on the card from propagating to the circle's main onClick
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-bold text-base">{name} — <span className="capitalize">{stage}</span></div>
        <p className="text-white/80 my-1">{description || "No description."}</p>
        <div className="text-xs opacity-70">Last tended: {lastTended}</div>
        <div className="pt-2 mt-2 border-t border-white/20 flex justify-between items-center">
          <button 
            onClick={onViewLogsClick}
            className="text-xs font-semibold text-white/80 hover:text-white hover:underline"
          >
            View Logs
          </button>
          <div className="text-xs font-semibold text-white/80">Click to Tend</div>
        </div>
      </div>
    </motion.div>
  );
}
