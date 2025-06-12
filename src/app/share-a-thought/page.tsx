"use client";

import { useState, useEffect } from 'react';
import AppHeader from "@/components/layout/AppHeader";
import { LightBulbIcon, BugAntIcon, SparklesIcon, ClockIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { useForm, ValidationError } from '@formspree/react';

type Category = 'idea' | 'issue' | 'praise';

const categories = {
    idea: { icon: LightBulbIcon, text: "A sprouting idea", emoji: "🌱" },
    issue: { icon: BugAntIcon, text: "A tangled vine", emoji: "�️" },
    praise: { icon: SparklesIcon, text: "A ray of sunlight", emoji: "☀️" },
};

export default function ShareAThoughtPage() {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [feedbackText, setFeedbackText] = useState('');
    
    // The useForm hook remains the same.
    const [state, handleSubmit] = useForm("xjkrwyle"); // I've used your ID here directly

    // This effect will log any submission errors to the console for debugging.
    useEffect(() => {
        // FIX: The `state.errors` object is not an array. 
        // We just need to check if it exists to know if there are errors.
        if (state.errors) {
            console.error("Formspree submission error:", state.errors);
        }
    }, [state.errors]);

    if (state.succeeded) {
        return (
            <div className="min-h-screen bg-background text-text font-body flex flex-col">
                <AppHeader />
                <main className="flex-grow flex flex-col items-center justify-center text-center p-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-10 rounded-2xl shadow-lg max-w-md"
                    >
                        <SparklesIcon className="w-16 h-16 text-yellow-400 mx-auto" />
                        <h2 className="text-3xl font-display text-primary mt-6">Thank you for your kindness.</h2>
                        <p className="text-gray-600 mt-2">Your note has been received and will be tended to with care. We&apos;re grateful to have you in our community.</p>
                        <Link href="/garden">
                            <button className="mt-8 px-8 py-3 bg-primary text-background font-bold font-display text-md rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300">
                                Back to Your Garden
                            </button>
                        </Link>
                    </motion.div>
                </main>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-background text-text font-body flex flex-col">
            <AppHeader />
            <main className="flex-grow flex flex-col items-center p-6 pt-12">
                <div className="w-full max-w-2xl mx-auto">
                    <h2 className="text-4xl font-display text-center text-primary">A Note for the Gardeners</h2>
                    <p className="text-center text-gray-500 mt-2">What&apos;s on your mind?</p>

                    <div className="grid grid-cols-3 gap-4 my-8">
                        {(Object.keys(categories) as Category[]).map(key => (
                            <div 
                                key={key}
                                onClick={() => setSelectedCategory(key)}
                                className={`p-4 rounded-xl text-center cursor-pointer border-2 transition-all duration-200 ${selectedCategory === key ? 'border-primary bg-primary/10' : 'border-transparent hover:bg-gray-100'}`}
                            >
                                <span className="text-4xl">{categories[key].emoji}</span>
                                <p className="font-display font-semibold mt-2 text-text">{categories[key].text}</p>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* We now pass the category as a standard form field that Formspree can read. */}
                        <input type="hidden" name="category" value={selectedCategory || ''} />

                        <label htmlFor="feedback" className="sr-only">Feedback</label>
                        <textarea
                            id="feedback"
                            name="feedback"
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder={
                                selectedCategory === 'idea' ? "Describe your idea..." :
                                selectedCategory === 'issue' ? "What seems to be the trouble?" :
                                selectedCategory === 'praise' ? "Share your kind words..." :
                                "Please select a category first..."
                            }
                            disabled={!selectedCategory || state.submitting}
                            rows={6}
                            className="w-full p-4 border-2 border-gray-200 rounded-2xl bg-white shadow-inner focus:ring-2 focus:ring-primary focus:outline-none transition-shadow disabled:bg-gray-100"
                        />
                         {/* This helper from Formspree can display specific field errors if needed */}
                        <ValidationError 
                            prefix="Feedback" 
                            field="feedback"
                            errors={state.errors}
                        />

                        <div className="flex justify-center mt-6">
                             <button 
                                type="submit"
                                disabled={!feedbackText.trim() || !selectedCategory || state.submitting}
                                className="px-10 py-4 bg-primary text-background font-bold font-display text-lg rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300 disabled:bg-gray-300 disabled:scale-100 flex items-center gap-2"
                            >
                                {state.submitting && <ClockIcon className="w-6 h-6 animate-spin" />}
                                Send Note
                            </button>
                        </div>
                        
                        {/* This will display a generic error if the submission fails for other reasons */}
                        <ValidationError 
                            errors={state.errors} 
                            className="text-center text-red-500 mt-4"
                        />
                    </form>
                </div>
            </main>
        </div>
    );
}