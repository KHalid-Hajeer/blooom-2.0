// src/app/companion/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { MessageBubble } from "@/components/companion/MessageBubble";
import { ChatInput } from "@/components/companion/ChatInput";
import OnboardingNextButton from "@/components/ui/OnboardingNextButton";

type Sender = "companion" | "user";
interface Message { sender: Sender; text: string; }

export default function CompanionPage() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "companion", text: "Hi, I’m here for you." }
  ]);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [hasMessagedOnboarding, setHasMessagedOnboarding] = useState(false);

  useEffect(() => {
    const step = localStorage.getItem('onboardingStep');
    if (step === '3') {
      setIsOnboarding(true);
      if (!sessionStorage.getItem('promptedToChat')) {
        setTimeout(() => {
          setMessages(prev => [...prev, { sender: 'companion', text: "Try sending a message to continue."}]);
        }, 1000);
        sessionStorage.setItem('promptedToChat', 'true');
      }
    }
  }, []);

  const handleSend = (text: string) => {
    setMessages((prev) => [...prev, { sender: "user", text }]);

    if (isOnboarding) {
        setHasMessagedOnboarding(true);
        // Don't auto-reply during onboarding to let the user click next.
    } else {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { sender: "companion", text: "Thank you for sharing that. I'm here with you." }
          ]);
        }, 1200);
    }
  };

  return (
    <div className="companion-container relative">
      {isOnboarding && hasMessagedOnboarding && (
        <OnboardingNextButton nextStep={4} nextPath="/onboarding/create-account" text="Complete Setup →" />
      )}

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
