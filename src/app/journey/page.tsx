//Multi-day growth programs (Phase 3)
// revamp everything
//

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Leaf, Sparkles, Eye, Sun, Lock, BookOpen, Bot } from 'lucide-react';

// --- Data for Cards ---
const feelingData = {
  hopeful: { name: 'Hopeful', Icon: Sun, color: 'text-amber-600', path: '/begin/hopeful' },
  curious: { name: 'Curious', Icon: Sparkles, color: 'text-yellow-700', path: '/begin/curious' },
  unclear: { name: 'Unclear', Icon: Eye, color: 'text-slate-500', path: '/begin/unclear' },
  heavy: { name: 'Heavy', Icon: Leaf, color: 'text-emerald-700', path: '/begin/heavy' },
};
type Feeling = keyof typeof feelingData;

const roomToFeelingMap: Record<string, Feeling> = {
    greenhouse: 'hopeful',
    meadow: 'curious',
    mirror: 'unclear',
    nest: 'heavy',
};


// --- MAIN JOURNEY HUB PAGE ---
export default function JourneyPage() {
  const router = useRouter();
  const [lastRoom, setLastRoom] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    // For the MVP, we use localStorage to remember the last room.
    // In a full app, this would come from a user database.
    const savedRoom = localStorage.getItem('lastVisitedRoom');
    if (savedRoom && roomToFeelingMap[savedRoom]) {
      setLastRoom(savedRoom);
    }
  }, []);

  const lastFeeling = lastRoom ? roomToFeelingMap[lastRoom] : null;
  const LastIcon = lastFeeling ? feelingData[lastFeeling].Icon : null;

  return (
    <div className="w-full min-h-screen bg-[#f7f4ef] text-slate-800">
      <main className="flex flex-col items-center p-6 pt-20 md:pt-24 pb-24 space-y-16">

        {/* Section 1: Today's Bloom */}
        <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-2xl text-center"
        >
            <h1 className="font-display text-4xl">Today's Bloom</h1>
            {hasMounted && lastRoom && lastFeeling && LastIcon ? (
                <div className="mt-4 p-6 bg-white/60 rounded-lg shadow-sm border border-black/5">
                    <p className="text-slate-600">You last visited a space for feeling <span className="font-semibold">{lastFeeling}</span>.</p>
                    <div className="flex items-center justify-center space-x-3 mt-3">
                        <LastIcon className={`${feelingData[lastFeeling].color}`} />
                        <p className={`font-display text-2xl ${feelingData[lastFeeling].color}`}>The {lastRoom.charAt(0).toUpperCase() + lastRoom.slice(1)}</p>
                    </div>
                </div>
            ) : (
                <p className="mt-4 text-slate-500">Begin a journey to see your progress here.</p>
            )}
        </motion.section>

        {/* Section 2: Feeling Cards Grid */}
        <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition:{ staggerChildren: 0.1, delay: 0.3 } }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl"
        >
          {Object.values(feelingData).map(({ name, Icon, color, path }) => (
            <motion.div 
                key={name} 
                variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}
                className="group"
            >
              <button onClick={() => router.push(path)} className={`w-full h-32 md:h-40 p-4 flex flex-col items-center justify-center bg-white/50 rounded-lg shadow-sm border border-black/5 ${color} hover:bg-white hover:shadow-lg transition-all duration-300`}>
                <Icon size={32} className="transition-transform duration-300 group-hover:-translate-y-1" />
                <p className="font-display text-xl mt-2">{name}</p>
              </button>
            </motion.div>
          ))}
        </motion.section>

        {/* Section 3: Locked Features & CTA */}
        <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="w-full max-w-2xl text-center pt-8 border-t border-black/10"
        >
            <h2 className="font-display text-3xl text-slate-700">Go Deeper</h2>
            <p className="mt-2 text-slate-500">Your journey is just beginning. There is more to discover.</p>
            
            <div className="mt-8 space-y-4">
                {/* Locked Feature: Journal */}
                <div className="flex items-center p-4 bg-gray-200/50 rounded-lg text-slate-500">
                    <Lock size={20} className="mr-4 flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold">Journal Archive</h3>
                        <p className="text-sm">Revisit your past blooms and reflections over time.</p>
                    </div>
                </div>
                {/* Locked Feature: Companion */}
                <div className="flex items-center p-4 bg-gray-200/50 rounded-lg text-slate-500">
                    <Lock size={20} className="mr-4 flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold">Bloom Companion</h3>
                        <p className="text-sm">Receive gentle whispers based on your journey.</p>
                    </div>
                </div>
            </div>

            <div className="mt-12">
                 <button className="bg-emerald-800 text-white font-display text-xl px-8 py-3 rounded-full hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300">
                    Want to see more of yourself?
                </button>
            </div>
        </motion.section>

      </main>
    </div>
  );
}
