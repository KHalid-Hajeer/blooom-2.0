// src/app/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
});

const PENDING_SYSTEM_KEY = 'bloom_pending_system';

const savePendingDataAfterLogin = async (user: User) => {
    const pendingSystemJSON = localStorage.getItem(PENDING_SYSTEM_KEY);
    if (pendingSystemJSON) {
        try {
            console.log("Found pending system. Saving to new account...");
            const systemData = JSON.parse(pendingSystemJSON);
            const { error } = await supabase.from('systems').insert({
                name: systemData.name,
                description: systemData.description,
                color: systemData.color,
                stage: systemData.stage,
                x_pos: systemData.x,
                y_pos: systemData.y,
                user_id: user.id,
            });
            if (error) throw error;
            // Clean up localStorage after successful save
            localStorage.removeItem(PENDING_SYSTEM_KEY);
            localStorage.setItem('onboardingCompleted', 'true');
            localStorage.removeItem('onboardingStep');
            console.log("Pending system saved and onboarding finalized.");
        } catch (error) {
            console.error("Failed to save pending system:", error);
        }
    } else {
        const isCompleted = localStorage.getItem('onboardingCompleted');
        if (!isCompleted) {
             localStorage.setItem('onboardingCompleted', 'true');
             localStorage.removeItem('onboardingStep');
        }
    }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === "SIGNED_IN" && session?.user) {
        await savePendingDataAfterLogin(session.user);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    loading,
  };

  // --- THIS IS THE CORRECTED LINE ---
  return (
    <AuthContext.Provider value={value}>
        {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};