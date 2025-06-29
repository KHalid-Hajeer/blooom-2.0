// src/app/garden/page.tsx
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { PanInfo } from "framer-motion";
import GardenCanvas from "../../components/garden/GardenCanvas";
import PlantSystemModal from "../../components/garden/PlantSystemModal";
import TendSystemModal from "../../components/garden/TendSystemModal";
import SystemDetailModal from "../../components/garden/SystemDetailModal";
import FloatingButton from "../../components/ui/FloatingButton";
import ViewModeToggle from "../../components/garden/ViewModeToggle";
import InteractiveGradient from "../../components/animation/interactive-gradient";
import { System, SystemLog } from "../../lib/growthtypes";
import { useAuth } from "../AuthContext";
import { supabase } from "../../lib/supabaseClient";

export default function GardenPage() {
  const { user } = useAuth();
  const [systems, setSystems] = useState<System[]>([]);
  const [modal, setModal] = useState<"plant" | "tend" | "detail" | null>(null);
  const [activeSystem, setActiveSystem] = useState<System | null>(null);
  const [viewMode, setViewMode] = useState("freeform");
  const [loading, setLoading] = useState(true);

  const fetchSystems = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('systems')
      .select('*, system_logs(*)')
      .eq('user_id', user.id);

    if (error) {
      console.error("Error fetching systems:", error);
    } else if (data) {
      const formattedSystems = data.map((s: any) => ({
        ...s,
        x: s.x_pos,
        y: s.y_pos,
        createdAt: new Date(s.created_at),
        logs: s.system_logs.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
      }));
      setSystems(formattedSystems);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchSystems();
    } else {
      setLoading(false);
    }
  }, [user, fetchSystems]);

  const handleOpenPlantModal = () => setModal("plant");
  const handleOpenTendModal = (system: System) => { setActiveSystem(system); setModal("tend"); };
  const handleViewSystemLogs = (system: System) => { setActiveSystem(system); setModal("detail"); };
  const handleCloseModal = () => { setModal(null); setActiveSystem(null); };

  const handlePlantSystem = async (data: { name: string; description: string; color: string }) => {
    if (!user) return;
    const { data: newSystemData, error } = await supabase
      .from('systems')
      .insert({
        ...data,
        user_id: user.id,
        x_pos: window.innerWidth / 2,
        y_pos: window.innerHeight / 2,
      })
      .select()
      .single();

    if (error) {
      console.error("Error planting system:", error);
    } else if (newSystemData) {
      await fetchSystems(); // Re-fetch to get the latest state
    }
    handleCloseModal();
  };

  const handleTendSystem = async (data: { note: string; mood: string }) => {
    if (!activeSystem || !user) return;
    
    // Add the log
    await supabase.from('system_logs').insert({
      ...data,
      system_id: activeSystem.id,
      user_id: user.id,
    });

    // Update the system's last_tended date
    await supabase.from('systems').update({ last_tended: new Date().toISOString() }).eq('id', activeSystem.id);
    
    await fetchSystems();
    handleCloseModal();
  };

  const handleDragEnd = async (id: number, info: PanInfo) => {
    const system = systems.find(s => s.id === id);
    if (!system) return;
    const newX = system.x + info.offset.x;
    const newY = system.y + info.offset.y;

    // Update local state immediately for responsiveness
    setSystems(systems.map(s => s.id === id ? { ...s, x: newX, y: newY } : s));
    
    await supabase
      .from('systems')
      .update({ x_pos: newX, y_pos: newY })
      .eq('id', id);
  };
  
  const handleUpdateSystem = async (systemId: number, updates: { name: string; description: string }) => {
    await supabase.from('systems').update(updates).eq('id', systemId);
    await fetchSystems();
  };
  
  const handleDeleteLog = async (systemId: number, logId: number) => {
    await supabase.from('system_logs').delete().eq('id', logId);
    await fetchSystems();
  };

  const handleUnplantSystem = async (systemId: number) => {
    await supabase.from('systems').delete().eq('id', systemId);
    await fetchSystems();
    handleCloseModal();
  };

  if (loading) {
    return <div className="w-screen h-screen flex items-center justify-center text-white bg-[#e7f5ed]">Loading your garden...</div>
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden text-white bg-[#e7f5ed]">
      <InteractiveGradient startColor="#ffffff" endColor="#e7f5ed" />
      
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
