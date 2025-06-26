// src/components/ui/FloatingButton.tsx
"use client";
import React from "react";

export default function FloatingButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-black text-white text-3xl font-light flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors duration-300"
      title="Plant a New System"
    >
      +
    </button>
  );
}