"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import Link from "next/link";
import GardenCanvas from "@/components/garden/GardenCanvas";
import PlantSystemModal from "@/components/garden/PlantSystemModal";
import TendSystemModal from "@/components/garden/TendSystemModal";
import SystemDetailModal from "@/components/garden/SystemDetailModal";
import FloatingButton from "@/components/ui/FloatingButton";
import ViewModeToggle from "@/components/garden/ViewModeToggle";
import InteractiveGradient from "@/components/animation/interactive-gradient";
import { System, SystemStage, SystemLog } from "@/lib/growthtypes";
import { useRouter } from "next/navigation";

const initialSystems: System[] = [];

const formatDistanceToNow = (date: Date): string => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
};

export default function GardenPage() {
  const [systems, setSystems] = useState<System[]>(initialSystems);
  const [modal, setModal] = useState<"plant" | "tend" | "detail" | "onboarding-complete" | null>(null);
  const [activeSystem, setActiveSystem] = useState<System | null>(null);
  const [viewMode, setViewMode] = useState("freeform");
  const [isOnboarding, setIsOnboarding] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const step = localStorage.getItem('onboardingStep');
    if (step === '0') {
      setIsOnboarding(true);
      setTimeout(() => setModal("plant"), 1000);
    }
  }, []);

  const handleOpenPlantModal = () => setModal("plant");
  const handleOpenTendModal = (system: System) => { setActiveSystem(system); setModal("tend"); };
  const handleViewSystemLogs = (system: System) => { setActiveSystem(system); setModal("detail"); };
  const handleCloseModal = () => { setModal(null); setActiveSystem(null); };

  const handlePlantSystem = (data: { name: string; description: string; color: string }) => {
    const newSystem: System = {
        ...data, id: Date.now(), stage: 'planted',
        x: window.innerWidth / 2, y: window.innerHeight / 2,
        lastTended: "Just now", createdAt: new Date(), logs: [],
    };
    setSystems(prev => [...prev, newSystem]);
    setModal(null);

    if (isOnboarding) {
        setTimeout(() => handleOpenTendModal(newSystem), 500);
    }
  };

  const handleTendSystem = (data: { note: string; mood: string }) => {
    if (!activeSystem) return;
    const newLog: SystemLog = { id: Date.now(), date: new Date().toISOString().split('T')[0], ...data };
    setSystems(systems.map(s => (s.id === activeSystem.id ? { ...s, logs: [newLog, ...s.logs] } : s)));
    handleCloseModal();
    if (isOnboarding) {
      setModal("onboarding-complete");
    }
  };

  const completeOnboardingStep = () => {
    localStorage.setItem('onboardingStep', '1');
    router.push('/hub');
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
      <nav className="absolute top-4 left-4 z-10 text-sm">
        <Link href="/hub" className="text-[#444] hover:underline transition">
          ← Back to Hub
        </Link>
      </nav>

      <GardenCanvas 
        systems={systems} 
        viewMode={viewMode}
        onSystemClick={handleOpenTendModal}
        onViewSystemLogs={handleViewSystemLogs}
        onDragEnd={handleDragEnd}
      />
      
      {!isOnboarding && <ViewModeToggle onModeChange={setViewMode} />}
      {!isOnboarding && <FloatingButton onClick={handleOpenPlantModal} />}

      <AnimatePresence>
        {modal === 'plant' && <PlantSystemModal onClose={handleCloseModal} onSubmit={handlePlantSystem} />}
        {modal === 'tend' && activeSystem && <TendSystemModal onClose={handleCloseModal} onSubmit={handleTendSystem} systemName={activeSystem.name} />}
        {modal === 'detail' && activeSystem && <SystemDetailModal onClose={handleCloseModal} system={activeSystem} onUnplant={handleUnplantSystem} onUpdate={handleUpdateSystem} onDeleteLog={handleDeleteLog} />}
        {modal === 'onboarding-complete' && (
             <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50">
                <div className="bg-white text-black p-6 rounded-xl w-[90%] max-w-md shadow-xl space-y-4 text-center">
                    <h2 className="text-xl font-bold">Garden Planted!</h2>
                    <p>You've taken the first step. Let's return to your space to see what's next.</p>
                    <button onClick={completeOnboardingStep} className="mt-4 px-6 py-2 bg-black text-white rounded-lg">Return to Hub</button>
                </div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}