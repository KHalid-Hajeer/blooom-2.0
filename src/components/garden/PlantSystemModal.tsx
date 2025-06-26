// src/components/garden/PlantSystemModal.tsx
"use client";
import React, { useState } from "react";

const themeColors = ["#98D7A5", "#D7BDE2", "#F9C1B1", "#A2D2FF", "#FFE07D", "#E4BAD4"];

export default function PlantSystemModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; color: string }) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(themeColors[0]);

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit({ name, description, color });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-30">
      <div className="bg-white text-black p-6 rounded-xl w-[90%] max-w-md shadow-xl space-y-4">
        <h2 className="text-lg font-semibold">🌿 Plant a New System</h2>
        <input
          type="text"
          placeholder="System Name (e.g., 'Morning Stillness')"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {/* 6. Added description textarea */}
        <textarea
            placeholder="What is the intention behind this system?"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
        />
        <div>
          <label className="block text-sm font-medium mb-2">🎨 Pick a Theme</label>
          <div className="flex gap-2">
            {themeColors.map((c) => (
              <div
                key={c}
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full cursor-pointer border-2 transition-all ${color === c ? 'ring-2 ring-offset-2 ring-black' : 'border-transparent'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button className="text-sm text-gray-600 hover:underline" onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit} className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">Plant Seed</button>
        </div>
      </div>
    </div>
  );
}