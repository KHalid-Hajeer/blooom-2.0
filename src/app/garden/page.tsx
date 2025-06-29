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
import { System, SystemLog, SystemStage } from "../../lib/growthtypes";
import { useAuth } from "../AuthContext";
import { supabase } from "../../lib/supabaseClient";

// Define a more specific type for the raw data from Supabase
type RawSystemLog = {
  id: number;
  note: string;
  mood: string;
  created_at: string;
};

type RawSystem = {
  id: number;
  name: string;
  description: string;
  color: string;
  stage: string;
  created_at: string;
  x_pos: number;
  y_pos: number;
  last_tended?: string;
  system_logs: RawSystemLog[];
};

// Helper function to format raw Supabase data into our frontend System type
function formatSystem(raw: RawSystem): System {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    color: raw.color,
    stage: raw.stage as SystemStage,
    x: raw.x_pos,
    y: raw.y_pos,
    createdAt: new Date(raw.created_at),
    lastTended: raw.last_tended ?? undefined, // Use undefined for better type alignment
    logs: raw.system_logs
      .map((log): SystemLog => ({
        id: log.id,
        note: log.note,
        mood: log.mood,
        date: log.created_at,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  };
}

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
    try {
      const { data, error } = await supabase
        .from("systems")
        .select("*, system_logs(*)")
        .eq("user_id", user.id);

      if (error) throw error;
      
      if (data) {
        setSystems((data as RawSystem[]).map(formatSystem));
      }
    } catch (error) {
      console.error("Error fetching systems:", error);
      // NOTE: Consider adding user-facing error feedback (e.g., a toast notification)
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchSystems();
    } else {
      // If no user, stop loading and show an empty garden.
      setLoading(false);
      setSystems([]);
    }
  }, [user, fetchSystems]);

  const handleOpenPlantModal = () => setModal("plant");
  
  const handleOpenTendModal = (system: System) => {
    setActiveSystem(system);
    setModal("tend");
  };
  
  const handleViewSystemLogs = (system: System) => {
    setActiveSystem(system);
    setModal("detail");
  };

  const handleCloseModal = () => {
    setModal(null);
    setActiveSystem(null);
  };

  const handlePlantSystem = useCallback(async (data: { name: string; description: string; color: string; }) => {
    if (!user) return;
    try {
      const { data: newSystemData, error } = await supabase
        .from("systems")
        .insert({
          ...data,
          user_id: user.id,
          // Place new systems in a slightly random position near the center
          x_pos: window.innerWidth / 2 + (Math.random() - 0.5) * 100,
          y_pos: window.innerHeight / 2 + (Math.random() - 0.5) * 100,
          stage: "seed",
        })
        .select("*, system_logs(*)")
        .single();

      if (error) throw error;

      if (newSystemData) {
        // OPTIMIZATION: Update state directly instead of re-fetching all systems
        setSystems(prevSystems => [...prevSystems, formatSystem(newSystemData as RawSystem)]);
      }
    } catch (error) {
      console.error("Error planting system:", error);
      // NOTE: Add user-facing error feedback here
    } finally {
      handleCloseModal();
    }
  }, [user]);

  const handleTendSystem = useCallback(async (data: { note: string; mood: string }) => {
    if (!activeSystem || !user) return;
    try {
      // 1. Insert the new log
      const { data: newLogData, error: logError } = await supabase
        .from("system_logs")
        .insert({ ...data, system_id: activeSystem.id, user_id: user.id })
        .select()
        .single();
      
      if (logError) throw logError;

      // 2. Update the system's last_tended timestamp
      const newTimestamp = new Date().toISOString();
      const { data: updatedSystemData, error: systemError } = await supabase
        .from("systems")
        .update({ last_tended: newTimestamp })
        .eq("id", activeSystem.id)
        .select("*, system_logs(*)") // Re-select to get updated logs
        .single();

      if (systemError) throw systemError;
      
      // OPTIMIZATION: Update the specific system in the local state
      setSystems(prevSystems => 
        prevSystems.map(s => s.id === activeSystem.id ? formatSystem(updatedSystemData as RawSystem) : s)
      );

    } catch (error) {
      console.error("Error tending system:", error);
      // NOTE: Add user-facing error feedback here
    } finally {
      handleCloseModal();
    }
  }, [activeSystem, user]);

  const handleDragEnd = useCallback(async (id: number, info: PanInfo) => {
    const originalSystem = systems.find((s) => s.id === id);
    if (!originalSystem) return;

    const newX = originalSystem.x + info.offset.x;
    const newY = originalSystem.y + info.offset.y;

    // Optimistic UI update
    setSystems(systems.map((s) => s.id === id ? { ...s, x: newX, y: newY } : s));

    try {
      const { error } = await supabase
        .from("systems")
        .update({ x_pos: newX, y_pos: newY })
        .eq("id", id);
      
      if (error) throw error;

    } catch(error) {
      console.error("Error updating system position:", error);
      // REVERT UI on failure
      setSystems(systems.map((s) => s.id === id ? originalSystem : s));
      // NOTE: Add user-facing error feedback here
    }
  }, [systems]);

  const handleUpdateSystem = useCallback(async (systemId: number, updates: { name: string; description: string }) => {
    try {
        const { data: updatedSystem, error } = await supabase
            .from("systems")
            .update(updates)
            .eq("id", systemId)
            .select("*, system_logs(*)")
            .single();

        if (error) throw error;
        
        // OPTIMIZATION: Update the specific system in state
        setSystems(prev => prev.map(s => s.id === systemId ? formatSystem(updatedSystem as RawSystem) : s));
    } catch(error) {
        console.error("Error updating system:", error);
        // NOTE: Add user-facing error feedback here
    }
  }, []);

  const handleDeleteLog = useCallback(async (systemId: number, logId: number) => {
    try {
      const { error } = await supabase.from("system_logs").delete().eq("id", logId);
      if (error) throw error;

      // OPTIMIZATION: Remove the log from the system in the local state
      setSystems(prevSystems =>
        prevSystems.map(system => {
          if (system.id === systemId) {
            return { ...system, logs: system.logs.filter(log => log.id !== logId) };
          }
          return system;
        })
      );
    } catch (error) {
      console.error("Error deleting log:", error);
      // NOTE: Add user-facing error feedback here
    }
  }, []);

  const handleUnplantSystem = useCallback(async (systemId: number) => {
    try {
        const { error } = await supabase.from("systems").delete().eq("id", systemId);
        if (error) throw error;

        // OPTIMIZATION: Remove the system from state directly
        setSystems(prev => prev.filter(s => s.id !== systemId));
        handleCloseModal();
    } catch (error) {
        console.error("Error unplanting system:", error);
        // NOTE: Add user-facing error feedback here
    }
  }, []);
  
  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center text-white bg-[#e7f5ed]">
        Loading your garden...
      </div>
    );
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

      {modal === "plant" && (
        <PlantSystemModal
          onClose={handleCloseModal}
          onSubmit={handlePlantSystem}
        />
      )}
      {modal === "tend" && activeSystem && (
        <TendSystemModal
          onClose={handleCloseModal}
          onSubmit={handleTendSystem}
          systemName={activeSystem.name}
        />
      )}
      {modal === "detail" && activeSystem && (
        <SystemDetailModal
          onClose={handleCloseModal}
          system={activeSystem}
          onUnplant={handleUnplantSystem}
          onUpdate={handleUpdateSystem}
          onDeleteLog={handleDeleteLog}
        />
      )}
    </div>
  );
}