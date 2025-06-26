// src/app/companion/page.tsx
"use client";

import React, { useState } from "react";
import { MessageBubble } from "@/components/companion/MessageBubble";
import { ChatInput } from "@/components/companion/ChatInput";

type Sender = "companion" | "user";

interface Message {
  sender: Sender;
  text: string;
}

export default function CompanionPage() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "companion", text: "Hi, I’m here for you." }
  ]);

  const handleSend = (text: string) => {
    setMessages((prev) => [...prev, { sender: "user", text }]);

    // Placeholder for typing simulation
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "companion", text: "Thank you for sharing that. I'm here with you." }
      ]);
    }, 1200);
  };

  return (
    <div className="companion-container">
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
