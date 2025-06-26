"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { PlusIcon, SearchIcon, StarIcon } from '@/components/chronicle/Icons';
import { WritingModal } from '@/components/chronicle/WritingModal';
import { BookModal } from '@/components/chronicle/BookModal';
import Toast from '@/components/chronicle/Toast';
import { useRouter } from 'next/navigation';

export const moodConfig = {
    joy: { color: 'bg-yellow-300', gradient: 'from-yellow-400 to-amber-200' },
    sadness: { color: 'bg-blue-400', gradient: 'from-blue-500 to-sky-300' },
    anger: { color: 'bg-red-500', gradient: 'from-red-600 to-rose-400' },
    calm: { color: 'bg-teal-300', gradient: 'from-teal-400 to-cyan-200' },
    powerful: { color: 'bg-indigo-500', gradient: 'from-indigo-600 to-purple-400' },
    thoughtful: { color: 'bg-gray-400', gradient: 'from-gray-500 to-slate-300' },
};
export type MoodConfig = typeof moodConfig;
export type Mood = keyof MoodConfig;
export const moods = Object.keys(moodConfig) as Mood[];

export type Reflection = {
  id: number;
  title: string;
  content: string;
  mood: Mood;
  date: string;
  tags: string[];
  archived: boolean;
  starred: boolean;
};

const initialReflections: Reflection[] = [];

const getBookHeight = (content: string) => {
    const length = content.length;
    if (length > 400) return 'h-64';
    if (length > 200) return 'h-56';
    return 'h-48';
};

export default function ChroniclePage() {
    const [reflections, setReflections] = useState<Reflection[]>(initialReflections);
    const [activeReflection, setActiveReflection] = useState<Reflection | null>(null);
    const [isWritingModalOpen, setWritingModalOpen] = useState(false);
    const [editingReflection, setEditingReflection] = useState<Reflection | null>(null);
    const [filterMood, setFilterMood] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'active' | 'archived'>('active');
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [isOnboarding, setIsOnboarding] = useState(false);
    const router = useRouter();
    const mainShelfRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const step = localStorage.getItem('onboardingStep');
      if (step === '2') {
        setIsOnboarding(true);
        setTimeout(() => setWritingModalOpen(true), 1000);
      }
    }, []);

    const showNotification = (message: string) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    }

    const handleSaveReflection = (reflectionData: Omit<Reflection, 'date' | 'archived' | 'starred'>) => {
        const isEditing = !!editingReflection;
        if (isEditing) {
            setReflections(reflections.map(r => r.id === reflectionData.id ? { ...r, ...reflectionData } : r));
            showNotification("Reflection updated!");
        } else {
            const newReflection: Reflection = { 
                ...reflectionData, 
                id: Date.now(), 
                date: new Date().toISOString().split('T')[0], 
                archived: false, 
                starred: false 
            };
            setReflections([newReflection, ...reflections]);
            showNotification("Reflection planted!");
        }
        setEditingReflection(null);
        setWritingModalOpen(false);

        if (isOnboarding) {
            localStorage.setItem('onboardingStep', '3');
            router.push('/hub');
        }
    };

    const handleOpenEdit = (reflection: Reflection) => { /*...*/ };
    const handleToggleArchive = (id: number) => { /*...*/ };
    const handleToggleStar = (id: number) => { /*...*/ };
    const handleCopy = (text: string) => { /*...*/ };
    
    const filteredReflections = reflections.filter(r => { /*...*/ });
    const activeReflections = filteredReflections.filter(r => !r.archived);
    const archivedReflections = filteredReflections.filter(r => r.archived);

    return (
        <>
        <Toast message={toastMessage} show={showToast} />
        <div className="bg-gray-800 text-white min-h-screen p-4 sm:p-8 relative overflow-hidden flex flex-col">
            <nav className="absolute top-4 left-4 z-20">
              <Link href="/hub" className="text-white/70 hover:text-white transition">
                ← Back to Hub
              </Link>
            </nav>
            <header className="text-center mb-8 z-10">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-wider">📖 REFLECTION CHRONICLE</h1>
                {isOnboarding ? (
                  <p className="text-lg text-yellow-300 mt-2 animate-pulse">Write your first reflection to continue.</p>
                ) : (
                  <p className="text-lg text-gray-400 mt-2">The Library of You</p>
                )}
            </header>
            <main className="flex-grow flex flex-col justify-center z-10">
                <div ref={mainShelfRef} className="flex gap-2 px-4 sm:px-8 pb-8 overflow-x-auto custom-scrollbar">
                    {activeReflections.length > 0 ? activeReflections.map(reflection => (
                       <div key={reflection.id} onClick={() => setActiveReflection(reflection)} className={`flex-shrink-0 w-12 rounded-md transform transition-all duration-300 ease-in-out hover:-translate-y-2 ${getBookHeight(reflection.content)} ${moodConfig[reflection.mood].color} relative group`}>
                            {/* Book content */}
                       </div>
                    )) : (
                        <div className="text-center w-full text-gray-500 py-16">Your shelf is empty. Time to plant a new reflection!</div>
                    )}
                 </div>
            </main>
            <div className="absolute bottom-8 right-8 z-20">
                <button onClick={() => { setEditingReflection(null); setWritingModalOpen(true); }} className="bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-full p-4 shadow-lg">
                    <PlusIcon />
                </button>
            </div>
            <WritingModal isOpen={isWritingModalOpen} onClose={() => setWritingModalOpen(false)} onSave={handleSaveReflection} reflection={editingReflection} moods={moods} />
            <BookModal reflection={activeReflection} moodConfig={moodConfig} onClose={() => setActiveReflection(null)} onEdit={handleOpenEdit} onArchive={handleToggleArchive} onStar={handleToggleStar} onCopy={handleCopy}/>
        </div>
        </>
    );
}