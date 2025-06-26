"use client";

import MemorySpace from "@/components/space/MemorySpace";
import { useEffect, useState } from "react";

export default function HubPage() {
  const [onboardingStep, setOnboardingStep] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Wait until the component has mounted to safely access localStorage
    setIsClient(true);

    const handleStorageChange = () => {
      const step = localStorage.getItem('onboardingStep');
      const isCompleted = localStorage.getItem('onboardingCompleted');

      if (isCompleted) {
        setOnboardingStep(999); // A special value to signify completion
      } else {
        setOnboardingStep(step ? parseInt(step, 10) : null);
      }
    };
    
    handleStorageChange(); // Set initial state
    window.addEventListener('storage', handleStorageChange); // Listen for changes from other tabs
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Render nothing on the server to prevent a hydration mismatch with localStorage
  if (!isClient) {
    return null; 
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      <MemorySpace onboardingStep={onboardingStep} />
    </div>
  );
}