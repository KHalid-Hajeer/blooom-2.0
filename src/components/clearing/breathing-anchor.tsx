"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Typewriter from "../animation/typewriter";

const PHASES = [
	{ label: "Breathe in", duration: 4.5 },
	{ label: "Rest", duration: 2 },
	{ label: "Breathe out", duration: 4.5 },
	{ label: "Rest", duration: 3 },
];

export default function BreathingAnchor() {
	const [phaseIdx, setPhaseIdx] = useState(0);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setPhaseIdx((idx) => (idx + 1) % PHASES.length);
		}, PHASES[phaseIdx].duration * 1000);
		return () => clearTimeout(timeout);
	}, [phaseIdx]);

	const getAnimation = () => {
		switch (phaseIdx) {
			case 0: return { scale: 1.2, opacity: 1 };
			case 1: return { scale: 1.2, opacity: 1 };
			case 2: return { scale: 1, opacity: 0.7 };
			case 3: return { scale: 1, opacity: 0.7 };
			default: return { scale: 1, opacity: 0.7 };
		}
	};

	return (
		<div className="relative flex items-center justify-center h-full w-full overflow-hidden font-body">
			<div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4">
				<motion.div
					className="relative w-48 h-48 md:w-64 md:h-64 rounded-full bg-white/20 flex items-center justify-center"
					animate={getAnimation()}
					transition={{
						duration: PHASES[phaseIdx].duration,
						ease: "easeInOut",
					}}
				>
					<span className="text-xl md:text-2xl text-white drop-shadow text-center select-none pointer-events-none">
						{PHASES[phaseIdx].label}
					</span>
				</motion.div>
				<div className="text-white/90 mt-12 text-lg">
					<Typewriter text="Sync your breath with the light" speed={40} />
				</div>
			</div>
		</div>
	);
}
