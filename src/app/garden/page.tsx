// src/app/garden/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { PanInfo } from "framer-motion";
import GardenCanvas from "@/components/garden/GardenCanvas";
import PlantSystemModal from "@/components/garden/PlantSystemModal";
import TendSystemModal from "@/components/garden/TendSystemModal";
import SystemDetailModal from "@/components/garden/SystemDetailModal";
import FloatingButton from "@/components/ui/FloatingButton";
import ViewModeToggle from "@/components/garden/ViewModeToggle";
import InteractiveGradient from "@/components/animation/interactive-gradient";
import { System, SystemLog } from "@/lib/growthtypes";
import OnboardingNextButton from "@/components/ui/OnboardingNextButton";

const initialSystems: System[] = [];

export default function GardenPage() {
  const [systems, setSystems] = useState<System[]>([]);
  const [modal, setModal] = useState<"plant" | "tend" | "detail" | null>(null);
  const [activeSystem, setActiveSystem] = useState<System | null>(null);
  const [viewMode, setViewMode] = useState("freeform");
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [hasPlantedOnboarding, setHasPlantedOnboarding] = useState(false);

  useEffect(() => {
    const step = localStorage.getItem('onboardingStep');
    if (step === '0') {
      setIsOnboarding(true);
      // Use sessionStorage to ensure the prompt only appears once per session
      if (systems.length === 0 && !sessionStorage.getItem('promptedToPlant')) {
        setTimeout(() => setModal("plant"), 1200);
        sessionStorage.setItem('promptedToPlant', 'true');
      }
    }
  }, [systems.length]);

  const handleOpenPlantModal = () => setModal("plant");
  const handleOpenTendModal = (system: System) => { setActiveSystem(system); setModal("tend"); };
  const handleViewSystemLogs = (system: System) => { setActiveSystem(system); setModal("detail"); };
  const handleCloseModal = () => setModal(null);

  const handlePlantSystem = (data: { name: string; description: string; color: string }) => {
    const newSystem: System = {
        ...data, id: Date.now(), stage: 'planted',
        x: window.innerWidth / 2, y: window.innerHeight / 2,
        lastTended: "Just now", createdAt: new Date(), logs: [],
    };
    setSystems(prev => [...prev, newSystem]);
    setModal(null);
    if (isOnboarding) {
        setHasPlantedOnboarding(true);
    }
  };

  const handleTendSystem = (data: { note: string; mood: string }) => {
    if (!activeSystem) return;
    const newLog: SystemLog = { id: Date.now(), date: new Date().toISOString().split('T')[0], ...data };
    setSystems(systems.map(s => (s.id === activeSystem.id ? { ...s, logs: [newLog, ...s.logs] } : s)));
    handleCloseModal();
  };

  const handleDragEnd = (id: number, info: PanInfo) => {
      setSystems(systems.map(s => s.id === id ? { ...s, x: s.x + info.offset.x, y: s.y + info.offset.y } : s));
  };
  
  const handleUpdateSystem = (systemId: number, updates: { name: string; description: string }) => {
    setSystems(systems.map(s => s.id === systemId ? { ...s, ...updates } : s));
  };
  
  const handleDeleteLog = (systemId: number, logId: number) => {
    setSystems(systems.map(s => s.id === systemId ? { ...s, logs: s.logs.filter(log => log.id !== logId) } : s));
  };

  const handleUnplantSystem = (systemId: number) => {
    setSystems(systems.filter(s => s.id !== systemId));
    handleCloseModal();
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden text-white bg-[#e7f5ed]">
      <InteractiveGradient startColor="#ffffff" endColor="#e7f5ed" />
      
      {isOnboarding && hasPlantedOnboarding && (
        <OnboardingNextButton nextStep={1} nextPath="/hub" />
      )}

      <GardenCanvas 
        systems={systems} 
        viewMode={viewMode}
        onSystemClick={handleOpenTendModal}
        onViewSystemLogs={handleViewSystemLogs}
        onDragEnd={handleDragEnd}
      />
      
      <ViewModeToggle onModeChange={setViewMode} />
      <FloatingButton onClick={handleOpenPlantModal} />

      {modal === 'plant' && <PlantSystemModal onClose={handleCloseModal} onSubmit={handlePlantSystem} />}
      {modal === 'tend' && activeSystem && <TendSystemModal onClose={handleCloseModal} onSubmit={handleTendSystem} systemName={activeSystem.name} />}
      {modal === 'detail' && activeSystem && <SystemDetailModal onClose={handleCloseModal} system={activeSystem} onUnplant={handleUnplantSystem} onUpdate={handleUpdateSystem} onDeleteLog={handleDeleteLog} />}
    </div>
  );
}
