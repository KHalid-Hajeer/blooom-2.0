// src/app/chronicles/page.tsx
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PlusIcon } from '../../components/chronicle/Icons';
import { WritingModal } from '../../components/chronicle/WritingModal';
import { BookModal } from '../../components/chronicle/BookModal';
import Toast from '../../components/chronicle/Toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { supabase } from '@/lib/supabaseClient';

// Types and Configs
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
    const length = content?.length || 0;
    if (length > 800) return 'h-72';
    if (length > 400) return 'h-64';
    if (length > 200) return 'h-56';
    return 'h-48';
};

export default function ChroniclePage() {
    const { user } = useAuth();
    const [reflections, setReflections] = useState<Reflection[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeReflection, setActiveReflection] = useState<Reflection | null>(null);
    const [isWritingModalOpen, setWritingModalOpen] = useState(false);
    const [editingReflection, setEditingReflection] = useState<Reflection | null>(null);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [isOnboarding] = useState(false); // Onboarding state remains client-side
    const [, setHasWrittenOnboarding] = useState(false);

    // Filters
    const [searchTerm] = useState('');
    const [moodFilter] = useState<Mood | 'all'>('all');
    const [showArchived] = useState(false);

    const fetchReflections = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('reflections')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching reflections:", error);
        } else if (data) {
            setReflections(data.map(r => ({ ...r, date: r.created_at })));
        }
        setLoading(false);
    }, [user]);

    useEffect(() => {
        fetchReflections();
    }, [fetchReflections]);

    const showNotification = (message: string) => {
        setToastMessage(message); setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleSaveReflection = async (reflectionData: Omit<Reflection, 'date' | 'archived' | 'starred'>) => {
        if (!user) return;
        const isEditing = !!editingReflection;
        
        const dataToSave = {
            title: reflectionData.title,
            content: reflectionData.content,
            mood: reflectionData.mood,
            tags: reflectionData.tags,
            user_id: user.id,
        };

        if (isEditing) {
            await supabase.from('reflections').update(dataToSave).eq('id', reflectionData.id);
            showNotification("Reflection updated!");
        } else {
            await supabase.from('reflections').insert(dataToSave);
            showNotification("Reflection planted!");
        }

        await fetchReflections(); // Re-fetch data
        setEditingReflection(null);
        setWritingModalOpen(false);
        if (isOnboarding) setHasWrittenOnboarding(true);
    };

    const handleEdit = (reflection: Reflection) => {
        setActiveReflection(null);
        setEditingReflection(reflection);
        setWritingModalOpen(true);
    };

    const handleArchive = async (id: number) => {
        const isArchived = reflections.find(r => r.id === id)?.archived;
        await supabase.from('reflections').update({ archived: !isArchived }).eq('id', id);
        await fetchReflections();
        setActiveReflection(null);
        showNotification(isArchived ? "Reflection unarchived." : "Reflection archived.");
    };

    const handleStar = async (id: number) => {
        const isStarred = reflections.find(r => r.id === id)?.starred;
        await supabase.from('reflections').update({ starred: !isStarred }).eq('id', id);
        await fetchReflections();
        setActiveReflection(r => r && r.id === id ? { ...r, starred: !isStarred } : r);
        showNotification(isStarred ? "Memory unstarred." : "Starred as a memory! ✨");
    };

    const filteredReflections = useMemo(() => {
        return reflections
            .filter(r => showArchived ? true : !r.archived)
            .filter(r => moodFilter === 'all' || r.mood === moodFilter)
            .filter(r => {
                const search = searchTerm.toLowerCase();
                return r.title.toLowerCase().includes(search) ||
                       (r.content || '').toLowerCase().includes(search) ||
                       r.tags.some(tag => tag.toLowerCase().includes(search));
            });
    }, [reflections, showArchived, moodFilter, searchTerm]);

    return (
        <>
            <Toast message={toastMessage} show={showToast} />
            <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-8 flex flex-col">
                {/* Onboarding logic remains client-side */}
                <header className="text-center mb-4 z-10">
                    <h1 className="text-3xl sm:text-4xl font-display tracking-wide">📖 REFLECTION CHRONICLE</h1>
                    <p className="text-white/60 font-body text-sm sm:text-base">The Library of You</p>
                </header>

                <div className="w-full max-w-4xl mx-auto mb-6 z-10 space-y-4">
                    {/* Filters UI remains the same */}
                </div>

                <main className="flex-grow flex items-center justify-center z-10 w-full overflow-hidden">
                    {loading ? (
                        <p>Loading your library...</p>
                    ) : (
                        <AnimatePresence>
                            {filteredReflections.length > 0 ? (
                                <div className="w-full flex items-center justify-center h-80">
                                    <div className="flex items-end gap-2 px-4 sm:px-8 pb-8 overflow-x-auto custom-scrollbar w-full h-full">
                                        {filteredReflections.map(reflection => (
                                            <motion.div
                                                key={reflection.id}
                                                layout
                                                initial={{ opacity: 0, y: 50 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -50 }}
                                                onClick={() => setActiveReflection(reflection)}
                                                className={`flex-shrink-0 w-12 rounded-t-md transform transition-all duration-300 ease-in-out hover:-translate-y-2 cursor-pointer relative group ${getBookHeight(reflection.content)} ${moodConfig[reflection.mood].color}`}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-t-md"></div>
                                                {reflection.starred && <div className="absolute -top-1 -right-1 text-yellow-300">✨</div>}
                                                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-black text-xs font-bold [writing-mode:vertical-rl] transform rotate-180 opacity-80 group-hover:opacity-100 transition-opacity p-1">{reflection.title}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-500 py-16">
                                    Your library is awaiting its first story.
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </main>

                <div className="fixed bottom-8 right-8 z-20">
                    <button
                        onClick={() => { setEditingReflection(null); setWritingModalOpen(true); }}
                        className="bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-full p-4 shadow-lg flex items-center gap-2"
                        title="Plant a New Reflection"
                    >
                        <PlusIcon />
                        <span className="hidden sm:inline">Plant a New Reflection</span>
                    </button>
                </div>

                <WritingModal isOpen={isWritingModalOpen} onClose={() => setWritingModalOpen(false)} onSave={handleSaveReflection} reflection={editingReflection} moods={moods} />
                <AnimatePresence>
                    {activeReflection && (
                        <BookModal
                            reflection={activeReflection}
                            moodConfig={moodConfig}
                            onClose={() => setActiveReflection(null)}
                            onEdit={handleEdit}
                            onArchive={handleArchive}
                            onStar={handleStar}
                            onCopy={showNotification}
                        />
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
