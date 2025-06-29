// src/components/chronicle/BookModal.tsx
import React from 'react';
import { Reflection } from '@/app/chronicles/page';
import { EditIcon, ArchiveIcon, CopyIcon, StarIcon } from './Icons';
import { motion } from 'framer-motion';
// FIX: Changed MoodConfig to moodConfig to match the export.
import { moodConfig as MoodConfigType } from '@/data/moods';

interface BookModalProps {
    reflection: Reflection;
    // FIX: Use the imported type alias.
    moodConfig: typeof MoodConfigType;
    onClose: () => void;
    onEdit: (reflection: Reflection) => void;
    onArchive: (id: number) => void;
    onStar: (id: number) => void;
    onCopy: (message: string) => void;
}

export const BookModal: React.FC<BookModalProps> = ({ reflection, moodConfig, onClose, onEdit, onArchive, onStar, onCopy }) => {
    
    const moodStyle = moodConfig[reflection.mood as keyof typeof moodConfig];
    const fullTextToCopy = `Title: ${reflection.title}\nDate: ${reflection.date}\nMood: ${reflection.mood}\n\n${reflection.content}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(fullTextToCopy);
        onCopy('Copied to clipboard!');
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div 
                initial={{ y: 50, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 50, opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <header className={`p-6 rounded-t-xl bg-gradient-to-r ${moodStyle.gradient} text-black relative`}>
                    <h2 className="text-3xl font-bold">{reflection.title}</h2>
                    <div className="flex items-center gap-4 mt-2">
                        <span className={`text-sm font-semibold px-3 py-1 bg-black/20 rounded-full capitalize`}>{reflection.mood}</span>
                        <span className="text-sm font-medium opacity-80">{new Date(reflection.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </header>

                <div className="p-8 flex-grow overflow-y-auto custom-scrollbar">
                    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-lg">{reflection.content}</p>
                </div>

                <footer className="p-6 border-t border-gray-700">
                    {reflection.tags && reflection.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {reflection.tags.map((tag: string) => (
                                <span key={tag} className="bg-gray-700 text-gray-300 text-xs font-mono px-2.5 py-1 rounded-full">{tag}</span>
                            ))}
                        </div>
                    )}
                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <div className="flex gap-2 text-gray-400">
                           <button onClick={() => onEdit(reflection)} title="Edit" className="p-2 rounded-full hover:bg-gray-700 hover:text-white transition"><EditIcon /></button>
                           <button onClick={() => onArchive(reflection.id)} title={reflection.archived ? "Unarchive" : "Archive"} className="p-2 rounded-full hover:bg-gray-700 hover:text-white transition"><ArchiveIcon /></button>
                           <button onClick={handleCopy} title="Copy to Clipboard" className="p-2 rounded-full hover:bg-gray-700 hover:text-white transition"><CopyIcon /></button>
                        </div>
                        <button onClick={() => onStar(reflection.id)} title="Star as Memory" className={`p-2 rounded-full transition flex items-center gap-2 px-4 ${reflection.starred ? 'text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20' : 'text-gray-400 hover:bg-gray-700 hover:text-yellow-400'}`}>
                            <StarIcon className={`w-5 h-5 transition-transform ${reflection.starred ? 'scale-110' : ''}`} />
                            <span className="font-semibold text-sm">{reflection.starred ? 'Starred Memory' : 'Star as Memory'}</span>
                        </button>
                    </div>
                </footer>
            </motion.div>
        </motion.div>
    );
};