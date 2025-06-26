"use client";

import MemorySpace from "@/components/space/MemorySpace";

export default function HubPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* The MemorySpace now serves as the primary background, containing both stars and interactive planets. */}
      <MemorySpace />
    </div>
  );
}
