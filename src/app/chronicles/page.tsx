// src/app/chronicles/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { PlusIcon } from '@/components/chronicle/Icons';
import { WritingModal } from '@/components/chronicle/WritingModal';
import { BookModal } from '@/components/chronicle/BookModal';
import Toast from '@/components/chronicle/Toast';
import OnboardingNextButton from '@/components/ui/OnboardingNextButton';

export const moodConfig = {
    joy: { color: 'bg-yellow-300', gradient: 'from-yellow-400 to-amber-200' },
    sadness: { color: 'bg-blue-400', gradient: 'from-blue-500 to-sky-300' },
    anger: { color: 'bg-red-500', gradient: 'from-red-600 to-rose-400' },
    calm: { color: 'bg-teal-300', gradient: 'from-teal-400 to-cyan-200' },
    powerful: { color: 'bg-indigo-500', gradient: 'from-indigo-600 to-purple-400' },
    thoughtful: { color: 'bg-gray-400', gradient: 'from-gray-500 to-slate-300' },
};
export type Mood = keyof typeof moodConfig;
export const moods = Object.keys(moodConfig) as Mood[];

export type Reflection = {
  id: number; title: string; content: string; mood: Mood; date: string;
  tags: string[]; archived: boolean; starred: boolean;
};

const getBookHeight = (content: string) => {
    const length = content.length;
    if (length > 400) return 'h-64';
    if (length > 200) return 'h-56';
    return 'h-48';
};

export default function ChroniclePage() {
    const [reflections, setReflections] = useState<Reflection[]>([]);
    const [activeReflection, setActiveReflection] = useState<Reflection | null>(null);
    const [isWritingModalOpen, setWritingModalOpen] = useState(false);
    const [editingReflection, setEditingReflection] = useState<Reflection | null>(null);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [isOnboarding, setIsOnboarding] = useState(false);
    const [hasWrittenOnboarding, setHasWrittenOnboarding] = useState(false);

    useEffect(() => {
      const step = localStorage.getItem('onboardingStep');
      if (step === '2') {
        setIsOnboarding(true);
        if (reflections.length === 0 && !sessionStorage.getItem('promptedToWrite')) {
          setTimeout(() => setWritingModalOpen(true), 1200);
          sessionStorage.setItem('promptedToWrite', 'true');
        }
      }
    }, [reflections.length]);

    const showNotification = (message: string) => {
        setToastMessage(message); setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    }

    const handleSaveReflection = (reflectionData: Omit<Reflection, 'date' | 'archived' | 'starred'>) => {
        const isEditing = !!editingReflection;
        if (isEditing) {
            setReflections(reflections.map(r => r.id === reflectionData.id ? { ...r, ...reflectionData } : r));
            showNotification("Reflection updated!");
        } else {
            const newReflection: Reflection = { 
                ...reflectionData, id: Date.now(), date: new Date().toISOString().split('T')[0], 
                archived: false, starred: false 
            };
            setReflections([newReflection, ...reflections]);
            showNotification("Reflection planted!");
        }
        setEditingReflection(null);
        setWritingModalOpen(false);
        if (isOnboarding) setHasWrittenOnboarding(true);
    };

    const activeReflections = reflections.filter(r => !r.archived);
    
    return (
        <>
        <Toast message={toastMessage} show={showToast} />
        <div className="bg-gray-800 text-white min-h-screen p-4 sm:p-8 relative overflow-hidden flex flex-col">
            {isOnboarding && hasWrittenOnboarding && (
              <OnboardingNextButton nextStep={3} nextPath="/hub" />
            )}
            <header className="text-center mb-8 z-10">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-wider">📖 REFLECTION CHRONICLE</h1>
            </header>
            <main className="flex-grow flex flex-col justify-center z-10">
                <div className="flex gap-2 px-4 sm:px-8 pb-8 overflow-x-auto custom-scrollbar">
                    {activeReflections.length > 0 ? activeReflections.map(reflection => (
                       <div key={reflection.id} onClick={() => setActiveReflection(reflection)} className={`flex-shrink-0 w-12 rounded-md transform transition-all duration-300 ease-in-out hover:-translate-y-2 ${getBookHeight(reflection.content)} ${moodConfig[reflection.mood].color} relative group`}>
                           <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                           <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white text-xs font-bold [writing-mode:vertical-rl] transform rotate-180 opacity-80">{reflection.title}</span>
                       </div>
                    )) : (
                        <div className="text-center w-full text-gray-500 py-16">Your shelf is empty. Time to plant a new reflection.</div>
                    )}
                 </div>
            </main>
            <div className="absolute bottom-8 right-8 z-20">
                <button onClick={() => { setEditingReflection(null); setWritingModalOpen(true); }} className="bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-full p-4 shadow-lg">
                    <PlusIcon />
                </button>
            </div>
            <WritingModal isOpen={isWritingModalOpen} onClose={() => setWritingModalOpen(false)} onSave={handleSaveReflection} reflection={editingReflection} moods={moods} />
            {activeReflection && <BookModal reflection={activeReflection} moodConfig={moodConfig} onClose={() => setActiveReflection(null)} onEdit={() => {}} onArchive={() => {}} onStar={() => {}} onCopy={() => {}}/>}
        </div>
        </>
    );
}
