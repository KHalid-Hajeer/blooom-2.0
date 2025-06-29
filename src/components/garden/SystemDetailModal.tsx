// src/components/garden/SystemDetailModal.tsx
"use client";
import React, { useState } from "react";
import { System } from "@/lib/growthtypes";

export default function SystemDetailModal({
  system,
  onClose,
  onUnplant,
  onUpdate,
  onDeleteLog,
}: {
  system: System;
  onClose: () => void;
  onUnplant: (systemId: number) => void;
  onUpdate: (systemId: number, updates: { name: string; description: string }) => void;
  onDeleteLog: (systemId: number, logId: number) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(system.name);
  const [editedDescription, setEditedDescription] = useState(system.description);

  const handleSave = () => {
    onUpdate(system.id, { name: editedName, description: editedDescription });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(system.name);
    setEditedDescription(system.description);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-30" onClick={onClose}>
      <div className="bg-white text-black p-6 rounded-xl w-[90%] max-w-lg shadow-xl space-y-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start">
          {isEditing ? (
            <div className="flex-grow space-y-2">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full text-2xl font-bold p-1 border rounded-md"
              />
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="w-full text-gray-600 p-1 border rounded-md"
                rows={2}
              />
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold">{system.name}</h2>
              <p className="text-gray-600 mt-1">{system.description}</p>
            </div>
          )}
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors text-2xl ml-4">✕</button>
        </div>

        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Tending History</h3>
          <div className="space-y-3 pr-2 max-h-64 overflow-y-auto">
            {system.logs.length > 0 ? (
              system.logs.map((log) => (
                <div key={log.id} className="flex items-center group">
                  <div className="w-1 h-full rounded-full mr-3" style={{ backgroundColor: log.mood }}></div>
                  <div className="flex-grow">
                    <div className="text-xs text-gray-500 font-mono">{log.date}</div>
                    <div className="text-base text-gray-800">{log.note}</div>
                  </div>
                  {isEditing && (
                    <button 
                      onClick={() => onDeleteLog(system.id, log.id)} 
                      className="ml-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete this log"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                      </svg>
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">No logs yet.</div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          {isEditing ? (
            <div className="flex gap-2">
              <button onClick={handleSave} className="text-sm px-3 py-1 bg-black text-white rounded-md">Save</button>
              <button onClick={handleCancel} className="text-sm px-3 py-1">Cancel</button>
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)} className="text-sm text-gray-600 hover:underline">Edit System</button>
          )}
          <button onClick={() => onUnplant(system.id)} className="text-sm text-red-600 hover:underline">Unplant System</button>
        </div>
      </div>
    </div>
  );
}
