// src/app/companion/page.tsx
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { MessageBubble } from "@/components/companion/MessageBubble";
import { ChatInput } from "@/components/companion/ChatInput";
import OnboardingNextButton from "@/components/ui/OnboardingNextButton";
import { useAuth } from "../AuthContext";
import { supabase } from "@/lib/supabaseClient";

type Sender = "companion" | "user";
interface Message { id?: number; sender: Sender; text: string; }

export default function CompanionPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [hasMessagedOnboarding, setHasMessagedOnboarding] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`chat_messages:${user.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        setMessages(currentMessages => [...currentMessages, payload.new as Message]);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleSend = async (text: string) => {
    if (!user) return;
    
    // Insert user message
    await supabase.from('messages').insert({ text, sender: 'user', user_id: user.id });

    if (isOnboarding) {
        setHasMessagedOnboarding(true);
    } else {
        // Simulate companion response
        setTimeout(async () => {
          await supabase.from('messages').insert({
            text: "Thank you for sharing that. I'm here with you.",
            sender: 'companion',
            user_id: user.id
          });
        }, 1200);
    }
  };
  
  // Onboarding logic remains client-side
  useEffect(() => {
      const step = localStorage.getItem('onboardingStep');
      if (step === '3') {
        setIsOnboarding(true);
      }
  }, []);

  return (
    <div className="companion-container relative">
      {isOnboarding && hasMessagedOnboarding && (
        <OnboardingNextButton nextStep={4} nextPath="/hub" text="Complete Setup →" />
      )}

      <div className="companion-header">🌙 Your Companion</div>
      <div className="companion-messages">
        {loading ? <p className="text-center">Connecting...</p> : messages.map((msg, idx) => (
          <MessageBubble key={idx} sender={msg.sender} text={msg.text} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  );
}
