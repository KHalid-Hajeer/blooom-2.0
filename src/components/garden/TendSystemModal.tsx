// src/components/garden/TendSystemModal.tsx
"use client";
import React, { useState } from "react";

const moodColors = ["#FFD580", "#D3E4CD", "#B3A8D9", "#FF9AA2"];

export default function TendSystemModal({
  systemName,
  onClose,
  onSubmit,
}: {
  systemName: string;
  onClose: () => void;
  onSubmit: (data: { note: string; mood: string }) => void;
}) {
  const [note, setNote] = useState("");
  const [mood, setMood] = useState(moodColors[0]);

  const handleSubmit = () => {
    if (note.trim()) {
      onSubmit({ note, mood });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-30">
      <div className="bg-white text-black p-6 rounded-xl w-[90%] max-w-md shadow-xl space-y-4">
        <h2 className="text-lg font-semibold">🌿 Tend: {systemName}</h2>
        <label htmlFor="note-area" className="block text-sm font-medium">How did you tend to this today?</label>
        <textarea
          id="note-area"
          rows={4}
          className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g., Meditated for 10 minutes and felt a sense of calm."
        />
        <div>
          <label className="block text-sm font-medium mb-2">Mood</label>
          <div className="flex gap-2">
            {moodColors.map((color) => (
              <div
                key={color}
                className={`w-8 h-8 rounded-full cursor-pointer border-2 transition-all ${mood === color ? "ring-2 ring-offset-2 ring-black" : "border-transparent"}`}
                onClick={() => setMood(color)}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button className="text-sm text-gray-600 hover:underline" onClick={onClose}>Cancel</button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Tend
          </button>
        </div>
      </div>
    </div>
  );
}