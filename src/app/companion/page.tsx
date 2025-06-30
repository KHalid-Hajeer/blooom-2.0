// src/app/companion/page.tsx
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { MessageBubble } from "@/components/companion/MessageBubble";
import { ChatInput } from "@/components/companion/ChatInput";
import OnboardingNextButton from "@/components/ui/OnboardingNextButton";
import { useAuth } from "../AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from 'framer-motion';

type Sender = "companion" | "user";
interface Message { id?: number; sender: Sender; text: string; }

// A list of predefined, empathetic responses for the companion
const predefinedResponses = [
    "Thank you for sharing that. I'm here with you.",
    "That sounds important. Tell me more if you feel comfortable.",
    "I'm listening. It's a safe space to explore that feeling.",
    "It takes courage to express that. I'm holding space for you.",
    "I understand. What does that feel like for you right now?"
];

// The initial greeting from the companion
const initialMessage: Message = {
    id: 1,
    sender: 'companion',
    text: "Welcome. This is a quiet space to feel heard. What's on your mind?"
};

export default function CompanionPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [loading, setLoading] = useState(true);
  
  // State to manage the onboarding flow and companion "typing" illusion
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = useCallback(async () => {
    if (!user) {
        setLoading(false);
        return;
    };
    setLoading(true);
    const { data, error } = await supabase.from('messages').select('*').eq('user_id', user.id).order('created_at', { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      // If there's an error, still show the initial greeting
      setMessages([initialMessage]);
    } else if (data && data.length > 0) {
      // If user has history, show it. Otherwise, start with the greeting.
      setMessages(data);
    } else {
      setMessages([initialMessage]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    const step = localStorage.getItem('onboardingStep');
    if (step === '3') {
      setIsOnboarding(true);
      setLoading(false);
    } else {
        fetchMessages();
    }
  }, [fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Real-time subscription for logged-in users
  useEffect(() => {
    if (!user || isOnboarding) return;

    const channel = supabase.channel(`chat_messages:${user.id}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `user_id=eq.${user.id}`}, (payload) => {
        setMessages(currentMessages => [...currentMessages, payload.new as Message]);
      }).subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isOnboarding]);

  const handleSend = async (text: string) => {
    const userMessage: Message = { sender: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Onboarding Logic
    if (isOnboarding) {
        setTimeout(() => {
            const companionResponse: Message = { sender: 'companion', text: "Thank you for sharing that." };
            setMessages(prev => [...prev, companionResponse]);
            setIsTyping(false);
            setShowNextButton(true); // Show button after companion responds
        }, 1500);
        return;
    }

    // Regular Logic for logged-in users
    if (!user) {
        setIsTyping(false);
        return;
    };
    
    await supabase.from('messages').insert({ text, sender: 'user', user_id: user.id });

    // Simulate companion response with a random choice
    setTimeout(async () => {
        const randomResponse = predefinedResponses[Math.floor(Math.random() * predefinedResponses.length)];
        await supabase.from('messages').insert({
            text: randomResponse,
            sender: 'companion',
            user_id: user.id
        });
        setIsTyping(false);
    }, 1500 + Math.random() * 500);
  };
  
  return (
    <div className="companion-container relative">
      {isOnboarding && showNextButton && (
        <OnboardingNextButton nextStep={4} nextPath="/onboarding/create-account" text="Set Up Your Space →" />
      )}

      <div className="companion-header">🌙 Your Companion</div>
      <div className="companion-messages">
        {loading && !isOnboarding ? <p className="text-center">Connecting...</p> : messages.map((msg, idx) => (
          <MessageBubble key={msg.id || idx} sender={msg.sender} text={msg.text} />
        ))}
        <AnimatePresence>
            {isTyping && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                >
                    <MessageBubble sender="companion" text="..." />
                </motion.div>
            )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  );
}