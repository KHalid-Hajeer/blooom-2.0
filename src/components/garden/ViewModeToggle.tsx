// src/components/garden/ViewModeToggle.tsx
import React from "react";

const modes = ["freeform", "theme", "chronological"];

export default function ViewModeToggle({
  onModeChange,
}: {
  onModeChange: (mode: string) => void;
}) {
  const [modeIndex, setModeIndex] = React.useState(0);

  function nextMode() {
    const next = (modeIndex + 1) % modes.length;
    setModeIndex(next);
    onModeChange(modes[next]);
  }

  return (
    <button
      onClick={nextMode}
      className="fixed bottom-8 left-8 text-sm px-4 py-2 bg-black text-white rounded-lg shadow-lg hover:bg-gray-800 transition-colors z-20"
    >
      View: {modes[modeIndex]}
    </button>
  );
}