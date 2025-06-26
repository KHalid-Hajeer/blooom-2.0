"use client";

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { MessageBubble } from "@/components/companion/MessageBubble";
import { ChatInput } from "@/components/companion/ChatInput";
import { useRouter } from "next/navigation";

type Sender = "companion" | "user";

interface Message {
  sender: Sender;
  text: string;
}

export default function CompanionPage() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "companion", text: "Hi, I’m here for you." }
  ]);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const step = localStorage.getItem('onboardingStep');
    if (step === '3') {
      setIsOnboarding(true);
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'companion', text: "Try sending a message to continue."}]);
      }, 1000);
    }
  }, []);

  const handleSend = (text: string) => {
    setMessages((prev) => [...prev, { sender: "user", text }]);

    if (isOnboarding) {
        localStorage.setItem('onboardingStep', '4');
        router.push('/hub');
        return;
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "companion", text: "Thank you for sharing that. I'm here with you." }
      ]);
    }, 1200);
  };

  return (
    <div className="companion-container relative">
      <nav className="absolute top-4 left-4 z-20">
        <Link href="/hub" className="text-white/70 hover:text-white transition">
          ← Back to Hub
        </Link>
      </nav>
      <div className="companion-header">🌙 Your Companion</div>
      <div className="companion-messages">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} sender={msg.sender} text={msg.text} />
        ))}
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  );
}