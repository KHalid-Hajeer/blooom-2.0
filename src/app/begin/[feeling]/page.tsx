"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion"; // Import AnimatePresence

import Typewriter from "@/components/animation/typewriter";
import { wisps } from "@/data/content"; // Import wisps from centralized data

export default function FeelingPage() {
    const params = useParams();
    const router = useRouter();
    const feeling = params.feeling as string;

    const [groundingIntroComplete, setGroundingIntroComplete] = useState(false);
    const [isGroundingComplete, setIsGroundingComplete] = useState(false);
    const [isReflectionComplete, setIsReflectionComplete] = useState(false);

    const wisp = wisps.find((w) => w.path === feeling);

    // Save last visited feeling to local storage
    useEffect(() => {
        if (feeling) {
            localStorage.setItem("lastVisitedFeeling", feeling);
        }
    }, [feeling]);

    if (!wisp) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#1a1a1f] text-white/90">
                <h1 className="font-display text-2xl">Invalid feeling state. Redirecting...</h1>
                {/* Redirect after a short delay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    onAnimationComplete={() => router.push('/')}
                />
            </div>
        );
    }

    const handleGroundingIntroComplete = () => {
        setGroundingIntroComplete(true);
    };

    const handleGroundingComplete = () => {
        setIsGroundingComplete(true);
    };

    const handleNextStep = () => {
        router.push(`/reflectionroom`);
    };

    return (
        <div className="w-full h-screen overflow-hidden flex flex-col items-center justify-center bg-[#1a1a1f]">
            <AnimatePresence mode="wait"> {/* Use AnimatePresence for transitions */}
                {/* Initial Quote and Grounding Introduction */}
                {!groundingIntroComplete && (
                    <motion.div
                        key="intro-quote"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute top-10 w-full text-center px-4 flex flex-col items-center justify-center h-full"
                    >
                        <h1 className="font-display text-2xl md:text-4xl lg:text-5xl text-white/90 mb-8 max-w-4xl mx-auto">
                            <Typewriter text={wisp.quote} speed={60} delay={0} onComplete={() => {}} />
                        </h1>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: wisp.quote.length * 0.06 + 0.5 }} // Delay based on quote length + buffer
                            className="mt-8 text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-body"
                        >
                            <Typewriter
                                text={wisp.groundingInstruction}
                                speed={50}
                                delay={0}
                                onComplete={handleGroundingIntroComplete}
                            />
                        </motion.div>
                        {groundingIntroComplete && (
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                onClick={() => setIsGroundingComplete(false)} // Set to false to show component and instructions
                                className="mt-12 px-8 py-4 bg-white/20 text-white rounded-lg hover:bg-white/30 transition z-20"
                            >
                                Start Grounding
                            </motion.button>
                        )}
                    </motion.div>
                )}

                                {/* Grounding Experience */}
                {groundingIntroComplete && !isGroundingComplete && (
                    <motion.div
                        key="grounding-experience"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full relative flex items-center justify-center"
                    >
                        {wisp.component}
                        {/* Call to action for interaction, now without the fade-in */}
                        <div
                            className="absolute z-30 font-body text-white/80 text-lg md:text-xl pointer-events-none"
                            style={{
                                // Position based on component for better visibility
                                bottom: feeling === 'anger' ? 'calc(50% + 120px)' : 'calc(50% + 120px)', // Adjust for ThoughtCatcher input or other components
                                transform: 'translateX(-50%)',
                                left: '50%',
                            }}
                        >
                            <Typewriter text={wisp.callToAction} speed={50} />
                        </div>

                        <button
                            onClick={handleGroundingComplete}
                            className="absolute bottom-10 right-10 px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition z-40"
                        >
                            Complete Grounding
                        </button>
                    </motion.div>
                )}


                {/* Reflection */}
                {isGroundingComplete && (
                    <motion.div
                        key="reflection"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col items-center justify-center text-center px-4 h-full"
                    >
                        <h2 className="font-display text-2xl md:text-4xl lg:text-5xl text-white/90 mb-12 max-w-2xl">
                            <Typewriter
                                text={wisp.reflection}
                                speed={60}
                                delay={0}
                                onComplete={() => setIsReflectionComplete(true)}
                            />
                        </h2>
                        {isReflectionComplete && (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={handleNextStep}
                                className="mt-8 px-8 py-4 bg-white/20 text-white rounded-lg hover:bg-white/30 transition"
                            >
                                Ready to reflect?
                            </motion.button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

