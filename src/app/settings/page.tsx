// src/app/settings/page.tsx
"use client";

import React from 'react';
import { Terminal } from '@/components/settings/Terminal';

export default function SettingsPage() {
  return (
    <main className="w-full h-screen interactive-gradient-background flex items-center justify-center p-4">
      <Terminal />
    </main>
  );
}