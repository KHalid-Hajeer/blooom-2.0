// src/app/garden/page.tsx
"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import Link from "next/link";
import GardenCanvas from "@/components/garden/GardenCanvas";
import PlantSystemModal from "@/components/garden/PlantSystemModal";
import TendSystemModal from "@/components/garden/TendSystemModal";
import SystemDetailModal from "@/components/garden/SystemDetailModal";
import FloatingButton from "@/components/ui/FloatingButton";
import ViewModeToggle from "@/components/garden/ViewModeToggle";
import InteractiveGradient from "@/components/animation/interactive-gradient";
import { System, SystemStage } from "@/lib/growthtypes";

// --- DUMMY DATA ---
const initialSystems: System[] = [
  {
    id: 1, name: "Health Ritual", description: "Daily practices for body and mind.", stage: "blooming",
    x: 300, y: 250, color: "#98D7A5", lastTended: "", createdAt: new Date("2025-06-21T10:00:00Z"),
    logs: [{ id: 101, date: "2025-06-22", note: "Completed a 30-minute yoga session.", mood: "#D3E4CD" }],
  },
  {
    id: 2, name: "Morning Stillness", description: "Finding peace before the day begins.", stage: "radiant",
    x: 800, y: 450, color: "#D7BDE2", lastTended: "", createdAt: new Date("2025-06-19T09:00:00Z"),
    logs: [{ id: 102, date: "2025-06-23", note: "Meditated and journaled for 15 minutes.", mood: "#B3A8D9" }],
  },
];

const growthStages: SystemStage[] = ["planted", "sprouted", "blooming", "radiant"];

const formatDistanceToNow = (date: Date): string => {
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const targetDate = new Date(date); targetDate.setHours(0, 0, 0, 0);
    const diffTime = now.getTime() - targetDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today"; if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
};

export default function GardenPage() {
  const [systems, setSystems] = useState<System[]>(initialSystems);
  const [modal, setModal] = useState<"plant" | "tend" | "detail" | null>(null);
  const [activeSystem, setActiveSystem] = useState<System | null>(null);
  const [viewMode, setViewMode] = useState("freeform");
  const [plantingSystem, setPlantingSystem] = useState<any>(null);

  const handleOpenPlantModal = () => setModal("plant");
  const handleOpenTendModal = (system: System) => { setActiveSystem(system); setModal("tend"); };
  const handleViewSystemLogs = (system: System) => { setActiveSystem(system); setModal("detail"); };
  const handleCloseModal = () => { setModal(null); setActiveSystem(null); };

  const handlePlantSystem = (data: { name: string; description: string; color: string }) => {
    setModal(null);
    const newId = Date.now();
    setPlantingSystem({ ...data, id: newId, stage: 'planted' });
    
    setTimeout(() => {
        const newSystem: System = {
            ...data, id: newId, stage: 'planted',
            x: window.innerWidth / 2, y: window.innerHeight / 2,
            lastTended: "Just now", createdAt: new Date(), logs: [],
        };
        setSystems(prev => [...prev, newSystem]);
        setPlantingSystem(null);
    }, 400);
  };

  const handleTendSystem = (data: { note: string; mood: string }) => {
    if (!activeSystem) return;
    setSystems(systems.map(s => {
      if (s.id === activeSystem.id) {
        const currentStageIndex = growthStages.indexOf(s.stage);
        const nextStage = currentStageIndex < growthStages.length - 1 ? growthStages[currentStageIndex + 1] : s.stage;
        const newLog = { id: Date.now(), date: new Date().toISOString().split('T')[0], ...data };
        return { ...s, stage: nextStage, logs: [newLog, ...s.logs] };
      }
      return s;
    }));
    handleCloseModal();
  };

  const handleDragEnd = (id: number, info: PanInfo) => {
      setSystems(systems.map(s => s.id === id ? { ...s, x: s.x + info.offset.x, y: s.y + info.offset.y } : s));
  };
  
  const handleUpdateSystem = (systemId: number, updates: { name: string; description: string }) => {
    setSystems(systems.map(s => s.id === systemId ? { ...s, ...updates } : s));
  };
  
  const handleDeleteLog = (systemId: number, logId: number) => {
    setSystems(systems.map(s => {
      if (s.id === systemId) {
        return { ...s, logs: s.logs.filter(log => log.id !== logId) };
      }
      return s;
    }));
  };

  const handleUnplantSystem = (systemId: number) => {
    setSystems(systems.filter(s => s.id !== systemId));
    handleCloseModal();
  };

  const systemsWithDynamicTend = systems.map(system => {
    if (system.logs.length === 0) return { ...system, lastTended: "Not yet tended" };
    const lastLogDate = new Date(system.logs[0].date);
    return { ...system, lastTended: formatDistanceToNow(lastLogDate) };
  });

  return (
    <div className="relative h-screen w-screen overflow-hidden text-white bg-[#e7f5ed]">
      <InteractiveGradient startColor="#ffffff" endColor="#e7f5ed" />
      <nav className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 text-sm">
        {/* The button is now a Link component */}
        <Link href="/hub" className="text-[#444] hover:underline transition">
          ← Back to Hub
        </Link>
        <div className="flex items-center gap-4">
          <span className="w-3 h-3 rounded-full bg-[#FFC6D0]" title="Current Mood: Joy"></span>
        </div>
      </nav>

      <GardenCanvas 
        systems={systemsWithDynamicTend} 
        viewMode={viewMode}
        onSystemClick={handleOpenTendModal}
        onViewSystemLogs={handleViewSystemLogs}
        onDragEnd={handleDragEnd}
      />
      
      <ViewModeToggle onModeChange={setViewMode} />
      <FloatingButton onClick={handleOpenPlantModal} />

      <AnimatePresence>
        {modal === 'plant' && (
            <motion.div key="plant-modal" layoutId={plantingSystem ? plantingSystem.id : undefined} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }} className="fixed inset-0" >
                <PlantSystemModal onClose={handleCloseModal} onSubmit={handlePlantSystem} />
            </motion.div>
        )}
      </AnimatePresence>

      {modal === 'tend' && activeSystem && <TendSystemModal onClose={handleCloseModal} onSubmit={handleTendSystem} systemName={activeSystem.name} />}
      {modal === 'detail' && activeSystem && <SystemDetailModal onClose={handleCloseModal} system={activeSystem} onUnplant={handleUnplantSystem} onUpdate={handleUpdateSystem} onDeleteLog={handleDeleteLog} />}
    </div>
  );
}
