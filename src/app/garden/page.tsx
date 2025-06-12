"use client";

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { paceOptions } from '@/components/onboarding/StepThree';

// --- DATA & LOGIC IMPORTS ---
import { useGoals } from '@/contexts/GoalsContexts';
import {
    type Plant,
    getPlantVisual,
    isPlantDue,
    GROWTH_STAGES
} from '@/lib/growthLogic';
import {
    generateIsometricGardenLayout,
    TOTAL_GARDEN_PLOTS,
} from '@/lib/gardenLayout';

// --- PRESENTATION IMPORTS ---
import GardenView from '@/components/garden/GardenView';
import AppHeader from '@/components/layout/AppHeader';

const PlantTooltip = ({ plant, position }: { plant: Plant; position: { top: number; left: number } }) => {
    const visual = getPlantVisual(plant.growthScore);
    const maxScore = GROWTH_STAGES[GROWTH_STAGES.length - 1].score;
    const progressPercentage = Math.min(100, (plant.growthScore / maxScore) * 100);
    const isDue = isPlantDue(plant);

    return (
        <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ left: position.left, top: position.top, transform: 'translateX(-50%)' }}
            className="fixed z-50 w-72 rounded-xl bg-[#343A40] text-[#F5F5F1] p-4 shadow-2xl pointer-events-auto"
            // Stop propagation to prevent clicks inside the tooltip from closing it.
            onClick={(e) => e.stopPropagation()}
        >
            <h3 className="font-['Lora'] text-xl font-bold mb-2 truncate">{plant.intention}</h3>
            <p className="text-sm opacity-80 mb-1">Status: {visual.status}</p>
            <p className="text-sm opacity-80 mb-4">Growth Score: {plant.growthScore.toFixed(2)}</p>
            <div className="w-full bg-white/10 h-2 rounded-full mb-4">
                <motion.div
                    className="bg-[#FDECB3] h-2 rounded-full"
                    animate={{ width: `${progressPercentage}%` }}
                />
            </div>
            {isDue ? (
                <Link href="/today" className="block w-full text-center px-4 py-2 rounded-lg font-bold bg-[#A3B18A] text-white hover:bg-[#8FA076] transition-colors">
                    Go to Today Page
                </Link>
            ) : (
                <div className="w-full text-center px-4 py-2 rounded-lg font-bold bg-gray-400 text-white cursor-not-allowed">
                    Resting
                </div>
            )}
        </motion.div>
    );
};

const AddSeedModal = ({
    isOpen,
    onClose,
    onAddSeed
}: {
    isOpen: boolean;
    onClose: () => void;
    onAddSeed: (intention: string, rhythmIndex: number) => void;
}) => {
    const [step, setStep] = useState(1);
    const [intention, setIntention] = useState('');
    const [rhythmIndex, setRhythmIndex] = useState(2);

    const handleNext = () => {
        if (intention.trim()) setStep(2);
    };

    const handleAdd = () => {
        onAddSeed(intention.trim(), rhythmIndex);
        setIntention('');
        setRhythmIndex(2);
        setStep(1);
        onClose();
    };

    const handleClose = () => {
        setIntention('');
        setRhythmIndex(2);
        setStep(1);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
                        className="bg-[#F5F5F1] p-8 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ x: 300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -300, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            >
                                {step === 1 ? (
                                    <div>
                                        <h2 className="font-['Lora'] text-2xl text-[#343A40] mb-4">What would you like to grow?</h2>
                                        <p className="mb-6 opacity-70 text-[#343A40]">Name your intention—something gentle, something real.</p>
                                        <input
                                            type="text"
                                            value={intention}
                                            onChange={(e) => setIntention(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                                            className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-[#A3B18A] focus:outline-none transition bg-white"
                                            placeholder="e.g., 'Read for 15 minutes'"
                                            autoFocus
                                        />
                                        <div className="flex gap-4 mt-6">
                                            <button onClick={handleClose} className="w-full bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-bold hover:bg-gray-300">
                                                Cancel
                                            </button>
                                            <button onClick={handleNext} disabled={!intention.trim()} className="w-full px-4 py-3 rounded-lg font-bold bg-[#A3B18A] text-white hover:scale-105 transition-transform disabled:bg-gray-300 disabled:scale-100">
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h2 className="font-['Lora'] text-2xl text-[#343A40] mb-4">What's your ideal rhythm?</h2>
                                        <div className="mb-6 text-center">
                                            <p className="text-lg text-[#343A40]">{paceOptions[rhythmIndex].primary}</p>
                                            <p className="text-sm opacity-70 text-[#343A40]">{paceOptions[rhythmIndex].secondary}</p>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max={paceOptions.length - 1}
                                            value={rhythmIndex}
                                            onChange={(e) => setRhythmIndex(Number(e.target.value))}
                                            className="w-full accent-[#A3B18A]"
                                        />
                                        <div className="flex gap-4 mt-6">
                                            <button onClick={() => setStep(1)} className="w-full bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-bold hover:bg-gray-300">
                                                Back
                                            </button>
                                            <button onClick={handleAdd} className="w-full px-4 py-3 rounded-lg font-bold bg-[#A3B18A] text-white hover:scale-105 transition-transform">
                                                Plant Seed
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default function GardenPage() {
    const { plants, addPlant } = useGoals();
    const [activePlantId, setActivePlantId] = useState<string | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Use the new isometric layout generator.
    const plotPositions = useMemo(() => generateIsometricGardenLayout(), []);

    const handlePlantClick = useCallback(
      (plantId: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent the main page click from firing.
        
        // If the clicked plant is already active, deactivate it.
        if (plantId === activePlantId) {
            setActivePlantId(null);
            setTooltipPosition(null);
            return;
        }

        // Otherwise, activate the new plant and set its tooltip position.
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const position = {
            top: rect.top + window.scrollY - 10,
            left: rect.left + rect.width / 2 + window.scrollX,
        };
        setTooltipPosition(position);
        setActivePlantId(plantId);
      },
      [activePlantId] // Depend on activePlantId to get the current state.
    );
    
    // Effect to handle "clicking off" the tooltip to close it.
    useEffect(() => {
        const handleOutsideClick = () => {
            setActivePlantId(null);
            setTooltipPosition(null);
        };

        if (activePlantId) {
            document.addEventListener('click', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [activePlantId]);


    const activePlant = useMemo(
        () => plants.find((p) => p.id === activePlantId) || null,
        [activePlantId, plants]
    );

    const handleAddSeed = useCallback(
        (intention: string, rhythmIndex: number) => {
            const occupiedPlotIds = new Set(plants.map((p) => p.plotId));
            const availablePlots = plotPositions.filter((p) => !occupiedPlotIds.has(p.id));

            if (availablePlots.length === 0) {
                alert("Your garden is full!");
                return;
            }

            // Assign a random available plot.
            const randomPlot = availablePlots[Math.floor(Math.random() * availablePlots.length)];
            addPlant({
                intention,
                plotId: randomPlot.id,
                rhythm: paceOptions[rhythmIndex],
            });
        },
        [plants, plotPositions, addPlant]
    );

    return (
        <div className="flex flex-col min-h-screen w-full bg-[#F5F5F1] font-['Inter'] text-[#343A40]">
            <AppHeader />
            <main className="flex-grow flex flex-col items-center justify-center relative w-full overflow-hidden">
                {plants.length === 0 ? (
                    <div className="text-center flex flex-col items-center">
                        <div className="w-24 h-24 bg-[#A3B18A]/20 rounded-full flex items-center justify-center">
                            <span className="text-4xl animate-pulse">🌱</span>
                        </div>
                        <p className="text-gray-500 mt-6 max-w-xs">Your garden is quiet. Plant a seed to begin.</p>
                    </div>
                ) : (
                    <GardenView plants={plants} plotPositions={plotPositions} onPlantClick={handlePlantClick} />
                )}

                {plants.length < TOTAL_GARDEN_PLOTS && (
                    <div className="absolute bottom-8 z-20">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-[#A3B18A] text-white font-['Lora'] font-bold text-lg px-8 py-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        >
                            Plant a New Intention
                        </button>
                    </div>
                )}

                <AddSeedModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAddSeed={handleAddSeed}
                />

                <AnimatePresence>
                    {activePlant && tooltipPosition && (
                        <PlantTooltip plant={activePlant} position={tooltipPosition} />
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}