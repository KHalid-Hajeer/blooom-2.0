"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../AuthContext'; // Using your existing AuthContext
import { supabase } from '@/lib/supabaseClient'; // Using your existing Supabase client

// A reusable section header
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-xl font-semibold text-white tracking-wide border-b border-white/20 pb-2 mb-6">
        {children}
    </h2>
);

// A simple toast notification component
const Toast = ({ message, type }: { message: string, type: 'success' | 'error' }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg text-white font-semibold shadow-2xl z-50 ${
            type === 'success' ? 'bg-green-600/80' : 'bg-red-600/80'
        } backdrop-blur-sm`}
    >
        {message}
    </motion.div>
);


export default function SettingsPage() {
    const { user } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [emailLoading, setEmailLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Set notification and clear it after a delay
    const showNotification = (message: string, type: 'success' | 'error', duration = 4000) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), duration);
    };

    // Populate email from user session
    useEffect(() => {
        if (user?.email) {
            setEmail(user.email);
        }
    }, [user]);

    const handleEmailChange = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || email === user.email) return;

        setEmailLoading(true);
        const { error } = await supabase.auth.updateUser({ email });

        if (error) {
            showNotification(error.message, 'error');
        } else {
            showNotification('Confirmation sent to both email addresses.', 'success');
        }
        setEmailLoading(false);
    }, [email, user]);

    const handlePasswordChange = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            showNotification("Passwords do not match.", 'error');
            return;
        }
        if (password.length < 6) {
            showNotification("Password must be at least 6 characters.", 'error');
            return;
        }

        setPasswordLoading(true);
        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            showNotification(error.message, 'error');
        } else {
            showNotification('Password updated successfully!', 'success');
            setPassword('');
            setConfirmPassword('');
        }
        setPasswordLoading(false);
    }, [password, confirmPassword]);

    return (
        <main className="w-full min-h-screen interactive-gradient-background flex flex-col items-center justify-center p-4">
            <AnimatePresence>
                {notification && <Toast message={notification.message} type={notification.type} />}
            </AnimatePresence>

            <nav className="absolute top-4 left-4 z-20">
                <Link href="/hub" className="text-white/70 hover:text-white transition">
                    ← Back to Hub
                </Link>
            </nav>
            
            <div className="w-full max-w-xl animate-fade-in space-y-10">
                <header className="text-center">
                    <h1 className="text-5xl font-bold text-white tracking-tight">Settings</h1>
                </header>

                <div className="space-y-12">
                    {/* Profile Section */}
                    <form onSubmit={handleEmailChange}>
                        <section>
                            <SectionTitle>Profile</SectionTitle>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm text-white/80 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={emailLoading}
                                        className="w-full px-4 py-2 bg-black/20 text-white placeholder-white/50 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 transition backdrop-blur-sm disabled:opacity-50"
                                    />
                                </div>
                                <button type="submit" disabled={emailLoading || email === user?.email} className="px-5 py-2 bg-white/10 border border-white/30 text-white text-sm font-semibold rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                                    {emailLoading ? 'Saving...' : 'Change Email'}
                                </button>
                            </div>
                        </section>
                    </form>

                    {/* Password Section */}
                    <form onSubmit={handlePasswordChange}>
                        <section>
                            <SectionTitle>Password</SectionTitle>
                            <div className="space-y-4">
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={passwordLoading}
                                    className="w-full px-4 py-2 bg-black/20 text-white placeholder-white/50 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 transition backdrop-blur-sm disabled:opacity-50"
                                />
                                <input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={passwordLoading}
                                    className="w-full px-4 py-2 bg-black/20 text-white placeholder-white/50 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 transition backdrop-blur-sm disabled:opacity-50"
                                />
                                <button type="submit" disabled={passwordLoading || !password} className="px-5 py-2 bg-white/10 border border-white/30 text-white text-sm font-semibold rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                                    {passwordLoading ? 'Saving...' : 'Change Password'}
                                </button>
                            </div>
                        </section>
                    </form>

                    {/* Community Section */}
                    <section>
                        <SectionTitle>Community</SectionTitle>
                        <div className="space-y-4">
                            <p className="text-sm text-white/80">
                                Your reflections help us tend to this space with care.
                            </p>
                            <button className="px-5 py-2 bg-white/10 border border-white/30 text-white text-sm font-semibold rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm shadow-lg">
                                Share a thought with the gardeners
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}