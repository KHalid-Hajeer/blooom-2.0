// src/app/chronicles/page.tsx
"use client"; // Required for App Router pages that use hooks

import React, { useState, useEffect, useRef } from 'react';
import { PlusIcon, SearchIcon, StarIcon } from '@/components/chronicle/Icons';
import { WritingModal } from '@/components/chronicle/WritingModal';
import { BookModal } from '@/components/chronicle/BookModal';
import Toast from '@/components/chronicle/Toast';

// Data and Types are now inside the page component
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
const initialReflections: Reflection[] = [
    { id: 1, title: "Sunny Day Musings", content: "Today felt like a burst of sunshine after a long rain. I spent the afternoon in the park, just watching the world go by. There's a simple, profound happiness in that.", mood: 'joy', date: '2023-10-26', tags: ['gratitude', 'nature'], archived: false, starred: true },
    { id: 2, title: "A Quiet Storm", content: "Some days the sadness is a quiet storm, a pressure behind the eyes. It's not about anything specific, just a weight. Writing it down helps to release some of that pressure. It's okay to not be okay.", mood: 'sadness', date: '2023-10-24', tags: ['self-care'], archived: false, starred: false },
    { id: 3, title: "The Long Road", content: "The journey of a thousand miles begins with a single step. I've been thinking about this a lot lately.", mood: 'thoughtful', date: '2023-10-22', tags: ['philosophy', 'motivation'], archived: false, starred: false },
    { id: 4, title: "Archived Memory", content: "This is an older thought, a whisper from the past.", mood: 'calm', date: '2023-01-15', tags: ['memory'], archived: true, starred: false },
];


// Helper function to get book height based on content length
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

    const mainShelfRef = useRef<HTMLDivElement>(null);

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
    };

    const handleOpenEdit = (reflection: Reflection) => {
        setEditingReflection(reflection);
        setActiveReflection(null);
        setWritingModalOpen(true);
    }
    
    const handleToggleArchive = (id: number) => {
        let wasArchived = false;
        setReflections(reflections.map(r => {
            if (r.id === id) {
                wasArchived = r.archived;
                return { ...r, archived: !r.archived };
            }
            return r;
        }));
        showNotification(wasArchived ? "Reflection unarchived." : "Reflection archived.");
        setActiveReflection(null);
    }

    const handleToggleStar = (id: number) => {
       let wasStarred = false;
       const updatedReflections = reflections.map(r => {
            if (r.id === id) {
                wasStarred = r.starred;
                return { ...r, starred: !r.starred };
            }
            return r;
        });
        setReflections(updatedReflections);
        const updatedActiveReflection = updatedReflections.find(r => r.id === id);
        setActiveReflection(updatedActiveReflection || null);
        if (!wasStarred) {
           showNotification("Starred as a memory! ✨");
        }
    }
    
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied to clipboard!');
        });
    }

    const filteredReflections = reflections.filter(r => {
        const moodMatch = filterMood === 'all' || r.mood === filterMood;
        const searchMatch = searchTerm === '' || 
                            r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            r.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            r.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        return moodMatch && searchMatch;
    });

    const activeReflections = filteredReflections.filter(r => !r.archived);
    const archivedReflections = filteredReflections.filter(r => r.archived);
    
    useEffect(() => {
        const shelf = mainShelfRef.current;
        const onWheel = (e: WheelEvent) => {
            if (e.deltaY === 0 || !shelf) return;
            e.preventDefault();
            shelf.scrollTo({ left: shelf.scrollLeft + e.deltaY, behavior: 'smooth' });
        };
        shelf?.addEventListener('wheel', onWheel);
        return () => shelf?.removeEventListener('wheel', onWheel);
    }, [activeReflections, archivedReflections, viewMode]);


    return (
        <>
        <Toast message={toastMessage} show={showToast} />
        <div className="bg-gray-800 text-white min-h-screen p-4 sm:p-8 relative overflow-hidden flex flex-col">
            <header className="text-center mb-8 z-10">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-wider">📖 REFLECTION CHRONICLE</h1>
                <p className="text-lg text-gray-400 mt-2">The Library of You</p>
            </header>

            <div className="mb-8 px-4 sm:px-0 z-10 flex flex-col gap-y-4">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 items-center w-full">
                    <div className="relative flex-grow w-full sm:w-auto">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2"><SearchIcon /></span>
                        <input type="text" placeholder="Search by keyword, tag..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-full w-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-teal-400" />
                    </div>
                    <div className="bg-gray-700 p-1 rounded-full flex flex-wrap justify-center gap-1">
                         <button onClick={() => setFilterMood('all')} className={`px-4 py-1 text-sm rounded-full transition-colors ${filterMood === 'all' ? 'bg-teal-500 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>All</button>
                        {moods.map(mood => (
                            <button key={mood} onClick={() => setFilterMood(mood)} className={`px-4 py-1 text-sm rounded-full transition-colors capitalize ${filterMood === mood ? `${moodConfig[mood].color} text-black` : 'text-gray-300 hover:bg-gray-600'}`}>
                                {mood}
                            </button>
                        ))}
                    </div>
                </div>
                 <div className="flex justify-center">
                    <div className="bg-gray-700 p-1 rounded-full flex gap-1">
                         <button onClick={() => setViewMode('active')} className={`px-4 py-1 text-sm rounded-full transition-colors ${viewMode === 'active' ? 'bg-teal-500 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
                            Active Reflections
                         </button>
                         <button onClick={() => setViewMode('archived')} className={`px-4 py-1 text-sm rounded-full transition-colors ${viewMode === 'archived' ? 'bg-gray-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
                            Archived ({archivedReflections.length})
                         </button>
                    </div>
                </div>
            </div>

            {viewMode === 'active' && (
                <main className="flex-grow flex flex-col justify-center z-10">
                    <div className="relative py-12">
                         <h2 className="text-xl text-gray-400 mb-4 ml-4 sm:ml-8 font-sans">Your Reflections</h2>
                         <div ref={mainShelfRef} className="flex gap-2 px-4 sm:px-8 pb-8 overflow-x-auto custom-scrollbar cursor-grab active:cursor-grabbing">
                            {activeReflections.length > 0 ? activeReflections.map(reflection => (
                               <div key={reflection.id} onClick={() => setActiveReflection(reflection)} className={`flex-shrink-0 w-12 rounded-md transform transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50 ${getBookHeight(reflection.content)} ${moodConfig[reflection.mood].color} relative group`}>
                                    <div className={`absolute inset-0 bg-gradient-to-t ${moodConfig[reflection.mood].gradient} opacity-50`}></div>
                                    <div className="absolute inset-0 ring-1 ring-black/10 rounded-md"></div>
                                    <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap text-sm font-bold text-black/70 tracking-wider">
                                        {reflection.title}
                                    </span>
                                    {reflection.starred && <StarIcon className="absolute bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 text-yellow-300 drop-shadow-lg" />}
                                    <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${reflection.starred ? 'opacity-20' : 'opacity-0'} group-hover:opacity-10`}></div>
                               </div>
                            )) : (
                                <div className="text-center w-full text-gray-500 py-16">Your shelf is empty. Time to plant a new reflection!</div>
                            )}
                         </div>
                    </div>
                </main>
            )}
            
            {viewMode === 'archived' && (
                 <main className="flex-grow flex flex-col justify-center z-10">
                    <div className="relative py-12">
                         <h2 className="text-xl text-gray-400 mb-4 ml-4 sm:ml-8 font-sans">Archived Reflections</h2>
                         <div ref={mainShelfRef} className="flex gap-2 px-4 sm:px-8 pb-8 overflow-x-auto custom-scrollbar cursor-grab active:cursor-grabbing">
                             {archivedReflections.length > 0 ? archivedReflections.map(reflection => (
                               <div key={reflection.id} onClick={() => setActiveReflection(reflection)} className={`flex-shrink-0 w-12 rounded-md transform transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50 ${getBookHeight(reflection.content)} ${moodConfig[reflection.mood].color} relative group opacity-60 hover:opacity-100`}>
                                    <div className={`absolute inset-0 bg-gradient-to-t ${moodConfig[reflection.mood].gradient} opacity-50`}></div>
                                   <div className="absolute inset-0 ring-1 ring-black/10 rounded-md"></div>
                                   <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap text-sm font-bold text-black/70 tracking-wider">
                                       {reflection.title}
                                    </span>
                               </div>
                             )) : (
                                <div className="text-center w-full text-gray-500 py-16">No archived reflections.</div>
                             )}
                         </div>
                    </div>
                </main>
            )}

            <div className="absolute bottom-8 right-8 z-20">
                <button onClick={() => { setEditingReflection(null); setWritingModalOpen(true); }} className="bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-full p-4 shadow-lg transform hover:scale-110 transition-all duration-200" aria-label="Plant a New Reflection">
                    <PlusIcon />
                </button>
            </div>

            <WritingModal isOpen={isWritingModalOpen} onClose={() => setWritingModalOpen(false)} onSave={handleSaveReflection} reflection={editingReflection} moods={moods} />
            <BookModal reflection={activeReflection} moodConfig={moodConfig} onClose={() => setActiveReflection(null)} onEdit={handleOpenEdit} onArchive={handleToggleArchive} onStar={handleToggleStar} onCopy={handleCopy}/>

            {/* Background decorative elements */}
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-50"></div>
             <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-teal-500/5 rounded-full filter blur-3xl animate-pulse"></div>
             <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-indigo-500/5 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>
        </>
    );
}
