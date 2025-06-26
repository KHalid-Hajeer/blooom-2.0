"use client";

import React from "react";

interface MessageBubbleProps {
  sender: "user" | "companion";
  text: string;
}

export const MessageBubble = ({ sender, text }: MessageBubbleProps) => {
  const isUser = sender === "user";

  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs px-4 py-2 my-1 rounded-2xl text-sm shadow-md ${
          isUser
            ? "bg-[#D9CCE3] text-black rounded-br-none"
            : "bg-[#6E62B6] text-white rounded-bl-none"
        }`}
      >
        {text}
      </div>
    </div>
  );
};
