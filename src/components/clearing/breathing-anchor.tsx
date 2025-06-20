"use client";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import Typewriter from "../animation/typewriter";
import InteractiveGradient from "../animation/interactive-gradient";

const PHASES = [
	{ label: "Breathe in", duration: 4.5 },
	{ label: "Rest", duration: 2 },
	{ label: "Breathe out", duration: 4.5 },
	{ label: "Rest", duration: 3 },
];

export default function BreathingAnchor() {
	const [phaseIdx, setPhaseIdx] = useState(0);

	// Cycle through phases
	useEffect(() => {
		const timeout = setTimeout(() => {
			setPhaseIdx((idx) => (idx + 1) % PHASES.length);
		}, PHASES[phaseIdx].duration * 1000);
		return () => clearTimeout(timeout);
	}, [phaseIdx]);

	// Animation values for scale and opacity
	const getAnimation = () => {
		switch (phaseIdx) {
			case 0: // Breathe in
				return { scale: 1.2, opacity: 1 };
			case 1: // Rest (hold)
				return { scale: 1.2, opacity: 1 };
			case 2: // Breathe out
				return { scale: 1, opacity: 0.7 };
			case 3: // Rest (hold)
				return { scale: 1, opacity: 0.7 };
			default:
				return { scale: 1, opacity: 0.7 };
		}
	};

	return (
		<div className="relative flex items-center justify-center h-screen w-full overflow-hidden">
			{/* Interactive Gradient Background */}
			<InteractiveGradient
				startColor="var(--color-sadness-start)"
				endColor="var(--color-sadness-end)"
			/>

			{/* Centered breathing circle and text */}
			<div className="absolute inset-0 flex flex-col items-center justify-center z-10">
				<motion.div
					className="relative w-48 h-48 md:w-64 md:h-64 rounded-full bg-white/20 flex items-center justify-center"
					animate={getAnimation()}
					transition={{
						duration: PHASES[phaseIdx].duration,
						ease: "easeInOut",
					}}
				>
					<span className="font-body text-xl md:text-2xl text-white drop-shadow text-center select-none pointer-events-none">
						{PHASES[phaseIdx].label}
					</span>
				</motion.div>
				<div className="font-body text-[var(--color-sadness-text)] mt-12 text-lg opacity-90">
					<Typewriter text="Sync your breath with the light" speed={40} />
				</div>
			</div>
		</div>
	);
}