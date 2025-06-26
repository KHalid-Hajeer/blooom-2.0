// src/components/settings/SettingsPanel.tsx
"use client";

import React, { useState } from 'react';

// A beautifully styled toggle switch
const ToggleSwitch = ({ enabled, setEnabled }: { enabled: boolean; setEnabled: (enabled: boolean) => void; }) => (
    <button
        onClick={() => setEnabled(!enabled)}
        className={`${enabled ? 'bg-gray-700' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
        aria-checked={enabled}
        role="switch"
    >
        <span
            className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ease-in-out shadow-md`}
        />
    </button>
);

// A reusable section component
const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="py-6 border-b border-gray-100 last:border-b-0">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">{title}</h3>
        <div className="space-y-4">{children}</div>
    </div>
);

// A reusable row component for aligning labels and controls
const SettingsRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">{label}</span>
        {children}
    </div>
);

export const Terminal: React.FC = () => {
    // State for various settings remains the same
    const [fontTone, setFontTone] = useState<'serif' | 'sans'>('serif');
    const [planetVisibility, setPlanetVisibility] = useState({
        chronicle: true,
        dreamscape: true,
        memoryHub: false,
    });
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [companionMode, setCompanionMode] = useState('stillness');

    return (
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-2xl shadow-gray-500/10 animate-fade-in">
            {/* Header */}
            <header className="p-6 text-center border-b border-gray-200/80">
                <h2 className="text-xl font-semibold text-gray-800">⚙️ Inner Control Room</h2>
                <p className="text-sm text-gray-500 mt-1">Realign your inner experience.</p>
            </header>
            
            {/* Settings Body */}
            <div className="p-6 max-h-[65vh] overflow-y-auto custom-scrollbar">
                <SettingsSection title="Theme Settings">
                    <SettingsRow label="Font Tone">
                        <div className="bg-gray-200/70 p-1 rounded-full flex text-sm">
                            <button
                                onClick={() => setFontTone('serif')}
                                className={`px-4 py-1 rounded-full transition-all duration-300 ${fontTone === 'serif' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
                            >
                                Serif
                            </button>
                            <button
                                onClick={() => setFontTone('sans')}
                                className={`px-4 py-1 rounded-full transition-all duration-300 ${fontTone === 'sans' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
                            >
                                Sans
                            </button>
                        </div>
                    </SettingsRow>
                </SettingsSection>

                <SettingsSection title="Planet Visibility">
                    <SettingsRow label="Reflection Chronicle">
                        <ToggleSwitch enabled={planetVisibility.chronicle} setEnabled={(val) => setPlanetVisibility(p => ({ ...p, chronicle: val }))} />
                    </SettingsRow>
                    <SettingsRow label="Dreamscape Journal">
                        <ToggleSwitch enabled={planetVisibility.dreamscape} setEnabled={(val) => setPlanetVisibility(p => ({ ...p, dreamscape: val }))} />
                    </SettingsRow>
                    <SettingsRow label="Memory Hub">
                        <ToggleSwitch enabled={planetVisibility.memoryHub} setEnabled={(val) => setPlanetVisibility(p => ({ ...p, memoryHub: val }))} />
                    </SettingsRow>
                </SettingsSection>

                <SettingsSection title="Companion Mode">
                    <SettingsRow label="Default Companion">
                        <select value={companionMode} onChange={e => setCompanionMode(e.target.value)} className="bg-gray-200/70 border-none rounded-full text-sm py-1.5 pl-4 pr-8 focus:ring-2 focus:ring-gray-400 appearance-none">
                            <option value="stillness">Stillness</option>
                            <option value="warm">Warm</option>
                            <option value="wayfinder">Wayfinder</option>
                        </select>
                    </SettingsRow>
                </SettingsSection>
                
                <SettingsSection title="Notification Flow">
                    <SettingsRow label="Gentle Reminders">
                       <ToggleSwitch enabled={notificationsEnabled} setEnabled={setNotificationsEnabled} />
                    </SettingsRow>
                </SettingsSection>
                
                <SettingsSection title="Data & Backup">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <button className="bg-gray-100 hover:bg-gray-200/80 text-gray-700 font-medium py-2 px-4 rounded-full flex items-center justify-center transition-colors duration-300 shadow-sm">
                           Export Data
                        </button>
                        <button className="bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-full flex items-center justify-center transition-colors duration-300 shadow-sm">
                           Import Backup
                        </button>
                    </div>
                </SettingsSection>
            </div>
        </div>
    );
};
