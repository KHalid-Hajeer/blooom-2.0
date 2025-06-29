// src/components/chronicle/WritingModal.tsx
import React, { useState, useEffect } from 'react';
// FIX: Corrected the import path to the new data file.
import { Reflection } from '@/app/chronicles/page'; 
import { Mood, moods } from '@/data/moods'; // Import moods here

interface WritingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (reflection: Omit<Reflection, 'date' | 'archived' | 'starred'>) => void;
    reflection: Reflection | null;
}

export const WritingModal: React.FC<WritingModalProps> = ({ isOpen, onClose, onSave, reflection }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [mood, setMood] = useState<Mood>('joy');
    const [tags, setTags] = useState('');

    useEffect(() => {
        if (reflection && isOpen) {
            setTitle(reflection.title);
            setContent(reflection.content);
            setMood(reflection.mood);
            setTags(reflection.tags.join(', '));
        } else {
            setTitle('');
            setContent('');
            setMood('joy');
            setTags('');
        }
    }, [reflection, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
        onSave({ id: reflection?.id ?? Date.now(), title, content, mood, tags: tagArray });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div 
                className="bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-2xl transform transition-all duration-300 scale-95 animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-6 text-white">{reflection ? 'Edit Reflection' : 'Plant a New Reflection'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-400" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-400 mb-2">Reflection</label>
                        <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required rows={8} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 resize-y"></textarea>
                    </div>
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="mood" className="block text-sm font-medium text-gray-400 mb-2">Mood</label>
                            <div className="relative">
                               <select id="mood" value={mood} onChange={(e) => setMood(e.target.value as Mood)} className="w-full appearance-none bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 capitalize">
                                    {moods.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium text-gray-400 mb-2">Tags (comma separated)</label>
                            <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-400" placeholder="e.g. gratitude, work" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-md text-gray-300 hover:bg-gray-700 transition">Cancel</button>
                        <button type="submit" className="px-6 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-500 transition font-semibold">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};