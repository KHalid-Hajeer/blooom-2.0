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
    lastTended: raw.last_tended ?? undefined,
    logs: (raw.system_logs || []).map((log): SystemLog => ({
        id: log.id,
        note: log.note,
        mood: log.mood,
        date: log.created_at,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  };
}

const PENDING_SYSTEM_KEY = 'bloom_pending_system';

export default function GardenPage() {
  const { user } = useAuth();
  const [systems, setSystems] = useState<System[]>([]);
  const [modal, setModal] = useState<"plant" | "tend" | "detail" | null>(null);
  const [activeSystem, setActiveSystem] = useState<System | null>(null);
  const [viewMode, setViewMode] = useState("freeform");
  const [loading, setLoading] = useState(true);
  const [submissionStatus, setSubmissionStatus] = useState({ isLoading: false, error: null as string | null });

  const fetchSystems = useCallback(async () => {
    // Handle unauthenticated user first
    if (!user) {
        const pendingSystemJSON = localStorage.getItem(PENDING_SYSTEM_KEY);
        if (pendingSystemJSON) {
            const pendingSystem = JSON.parse(pendingSystemJSON);
            setSystems([pendingSystem]);
        }
        setLoading(false);
        return;
    };
    
    // Handle authenticated user
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
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSystems();
  }, [fetchSystems]);

  const handleOpenPlantModal = () => {
    setSubmissionStatus({ isLoading: false, error: null });
    setModal("plant");
  };
  
  const handleOpenTendModal = (system: System) => {
    setActiveSystem(system);
    setModal("tend");
  };
  
  const handleViewSystemLogs = (system: System) => {
    setActiveSystem(system);
    setModal("detail");
  };

  const handleCloseModal = useCallback(() => {
    setModal(null);
    setActiveSystem(null);
  }, []);

  const handlePlantSystem = useCallback(async (data: { name: string; description: string; color: string; }) => {
    setSubmissionStatus({ isLoading: true, error: null });
    
    // If user is not logged in, save to localStorage
    if (!user) {
        const pendingSystem: System = {
            id: Date.now(), // Use a temporary ID for the key
            ...data,
            stage: 'seed',
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            createdAt: new Date(),
            logs: [],
        };
        localStorage.setItem(PENDING_SYSTEM_KEY, JSON.stringify(pendingSystem));
        setSystems([pendingSystem]);
        setSubmissionStatus({ isLoading: false, error: null });
        handleCloseModal();
        // This is where you would typically trigger the next step of onboarding
        // For example, by using the router to navigate to the signup page.
        // router.push('/onboarding/create-account');
        return;
    }

    // Authenticated User Logic
    try {
      const { data: newSystemData, error } = await supabase
        .from("systems")
        .insert({
          ...data,
          user_id: user.id,
          x_pos: window.innerWidth / 2 + (Math.random() - 0.5) * 100,
          y_pos: window.innerHeight / 2 + (Math.random() - 0.5) * 100,
          stage: "seed",
        })
        .select("*, system_logs(*)")
        .single();

      if (error) throw error;

      if (newSystemData) {
        setSystems(prevSystems => [...prevSystems, formatSystem(newSystemData as RawSystem)]);
        handleCloseModal();
      }
    } catch (error: any) {
      console.error("Error planting system:", error);
      setSubmissionStatus({ isLoading: false, error: error.message || "An unknown error occurred." });
    }
  }, [user, handleCloseModal]);

  const handleTendSystem = useCallback(async (data: { note: string; mood: string }) => {
    if (!activeSystem || !user) return;
    try {
      const { error: logError } = await supabase
        .from("system_logs")
        .insert({ ...data, system_id: activeSystem.id, user_id: user.id })
        .select()
        .single();
      
      if (logError) throw logError;

      const newTimestamp = new Date().toISOString();
      const { data: updatedSystemData, error: systemError } = await supabase
        .from("systems")
        .update({ last_tended: newTimestamp })
        .eq("id", activeSystem.id)
        .select("*, system_logs(*)")
        .single();

      if (systemError) throw systemError;
      
      if (updatedSystemData) {
        setSystems(prevSystems => 
          prevSystems.map(s => s.id === activeSystem.id ? formatSystem(updatedSystemData as RawSystem) : s)
        );
      }
    } catch (error) {
      console.error("Error tending system:", error);
    } finally {
      handleCloseModal();
    }
  }, [activeSystem, user, handleCloseModal]);

  const handleDragEnd = useCallback(async (id: number, info: PanInfo) => {
    if (!user) return; // Prevent dragging for unauthenticated users

    const originalSystem = systems.find((s) => s.id === id);
    if (!originalSystem) return;

    const newX = originalSystem.x + info.offset.x;
    const newY = originalSystem.y + info.offset.y;

    setSystems(currentSystems => currentSystems.map((s) => s.id === id ? { ...s, x: newX, y: newY } : s));

    try {
      const { error } = await supabase
        .from("systems")
        .update({ x_pos: newX, y_pos: newY })
        .eq("id", id);
      
      if (error) throw error;

    } catch(error) {
      console.error("Error updating system position:", error);
      setSystems(currentSystems => currentSystems.map((s) => s.id === id ? originalSystem : s));
    }
  }, [systems, user]);

  const handleUpdateSystem = useCallback(async (systemId: number, updates: { name: string; description: string }) => {
    if (!user) return;
    try {
        const { data: updatedSystem, error } = await supabase
            .from("systems")
            .update(updates)
            .eq("id", systemId)
            .select("*, system_logs(*)")
            .single();

        if (error) throw error;
        
        if (updatedSystem) {
          setSystems(prev => prev.map(s => s.id === systemId ? formatSystem(updatedSystem as RawSystem) : s));
        }
    } catch(error) {
        console.error("Error updating system:", error);
    }
  }, [user]);

  const handleDeleteLog = useCallback(async (systemId: number, logId: number) => {
    if (!user) return;
    try {
      const { error } = await supabase.from("system_logs").delete().eq("id", logId);
      if (error) throw error;

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
    }
  }, [user]);

  const handleUnplantSystem = useCallback(async (systemId: number) => {
    if (!user) {
        localStorage.removeItem(PENDING_SYSTEM_KEY);
        setSystems([]);
        handleCloseModal();
        return;
    }
    try {
        const { error } = await supabase.from("systems").delete().eq("id", systemId);
        if (error) throw error;

        setSystems(prev => prev.filter(s => s.id !== systemId));
        handleCloseModal();
    } catch (error) {
        console.error("Error unplanting system:", error);
    }
  }, [user, handleCloseModal]);
  
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
          isLoading={submissionStatus.isLoading}
          error={submissionStatus.error}
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