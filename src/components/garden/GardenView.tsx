import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plant, getPlantVisual } from "@/lib/growthLogic";
import { PlotPosition } from "@/lib/gardenLayout";

interface GardenViewProps {
  plants: Plant[];
  plotPositions: PlotPosition[];
  onPlantClick: (plantId: string, e: React.MouseEvent) => void;
}

export default function GardenView({ plants, plotPositions, onPlantClick }: GardenViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const plotSize = 32;

  useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const { width: containerWidth, height: containerHeight } = dimensions;

  return (
    <div
      ref={containerRef}
      className="relative flex-grow flex items-center justify-center overflow-hidden"
      style={{
        width: "100vw",
        height: "100%",
        background: "#e6f4d7",
      }}
    >
      {/* --- SVG Isometric Rings Background --- */}
      <svg
        width={containerWidth}
        height={containerHeight}
        className="absolute left-0 top-0 z-0 pointer-events-none"
        style={{ filter: "blur(0.5px)" }}
      >
        {/* Center plot */}
        <ellipse
          cx={containerWidth / 2}
          cy={containerHeight / 2}
          rx={containerWidth * 0.03}
          ry={containerWidth * 0.03 * 0.6}
          fill="#A3B18A"
          fillOpacity={0.15}
        />
        {/* Main ring */}
        <ellipse
          cx={containerWidth / 2}
          cy={containerHeight / 2}
          rx={containerWidth * 0.18}
          ry={containerWidth * 0.18 * 0.6}
          stroke="#A3B18A"
          strokeWidth={2}
          fill="none"
          opacity={0.3}
        />
        {/* Outer ring (for spokes) */}
        <ellipse
          cx={containerWidth / 2}
          cy={containerHeight / 2}
          rx={containerWidth * 0.29}
          ry={containerWidth * 0.29 * 0.6}
          stroke="#A3B18A"
          strokeWidth={1}
          fill="none"
          opacity={0.15}
        />
      </svg>

      {/* --- Plot Position Dots (Soil Patches) --- */}
      {plotPositions.map((plot) => (
        <div
          key={plot.id}
          style={{
            position: "absolute",
            left: `${containerWidth / 2 + plot.x}px`,
            top: `${containerHeight / 2 + plot.y}px`,
            width: plotSize * 1.5,
            height: plotSize * 0.6,
            background: "radial-gradient(circle at 60% 40%, #a67c52 60%, #6b4f27 100%)",
            border: "1.5px solid #8d6742",
            borderRadius: "50% / 40%",
            boxShadow: "0 2px 8px #6b4f2740",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
            opacity: 0.7,
          }}
        />
      ))}

      {/* --- Plants --- */}
      {plants.map((plant) => {
        const plot = plotPositions.find((p) => p.id === Number(plant.plotId));
        if (!plot) return null;
        const visual = getPlantVisual(plant.growthScore);

        const left = containerWidth / 2 + plot.x;
        const top = containerHeight / 2 + plot.y;

        return (
          <motion.div
            key={plant.id}
            className="absolute flex justify-center items-end cursor-pointer z-10"
            style={{
              left: `${left}px`,
              top: `${top}px`,
              width: plotSize,
              height: plotSize,
              transform: "translate(-50%, -50%)",
              transformOrigin: "center center",
              pointerEvents: "auto",
            }}
            onClick={(e) => onPlantClick(plant.id, e)}
            whileHover={{ scale: 1.15, z: 10 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: plant.plotId * 0.05 }}
          >
            <div
              className="text-3xl"
              style={{
                textShadow: "0 4px 12px rgba(0,0,0,0.15)",
                position: "absolute",
                left: "50%",
                bottom: 0,
                transform: "translateX(-105%) translateY(-40%)", // 25% pushes the emoji slightly below the circle center for a natural "rooted" look
              }}
            >
              {visual.emoji}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}