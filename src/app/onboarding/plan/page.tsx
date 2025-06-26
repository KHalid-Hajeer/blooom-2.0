"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import InteractiveGradient from "@/components/animation/interactive-gradient";

const plans = [
	{
		name: "Sapling 🌱",
		key: "sapling",
		description:
			"For gentle beginnings. A quiet corner to plant a single seed and watch it grow.",
		price: "$5/month",
		sequence: ["🌰", "🌱"],
	},
	{
		name: "Grove 🌳",
		key: "grove",
		description:
			"For deeper roots. An expanding space to nurture a small collection of thoughts and feelings.",
		price: "$10/month",
		sequence: ["🌰", "🌱", "🌿", "🌳"],
	},
	{
		name: "Sanctuary 🌺",
		key: "sanctuary",
		description:
			"For a world of your own. A vast, private haven for every reflection, journey, and dream to flourish.",
		price: "$15/month",
		sequence: ["🌰", "🌱", "🌿", "🌸", "🌺"],
	},
];

export default function PlanPage() {
	const [selected, setSelected] = useState<number | null>(null);
	const [showAnimation, setShowAnimation] = useState(false);
	const [emojiStep, setEmojiStep] = useState(0);
	const router = useRouter();

	const handleStart = () => {
		setShowAnimation(true);
		setEmojiStep(0);
	};

	// Animate emoji sequence
	React.useEffect(() => {
		if (!showAnimation || selected === null) return;
		const sequence = plans[selected].sequence;
		if (emojiStep < sequence.length - 1) {
			const timeout = setTimeout(() => setEmojiStep((s) => s + 1), 900);
			return () => clearTimeout(timeout);
		}
	}, [emojiStep, showAnimation, selected]);

	const handleFoundations = () => {
		router.push("/onboarding/create-account");
	};

	return (
		<div className="w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 py-12">
			{/* Animated background */}
			<InteractiveGradient
				startColor="var(--color-heavy-start)"
				endColor="var(--color-heaby-end)"
			/>

			<AnimatePresence>
				{!showAnimation && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="w-full flex flex-col items-center"
					>
						<motion.h1
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.7 }}
							className="font-display text-3xl md:text-5xl text-white/90 mb-12 text-center z-10"
						>
							What does your space need to grow?
						</motion.h1>
						<div className="flex flex-col md:flex-row gap-8 mb-12 z-10">
							{plans.map((plan, idx) => (
								<motion.div
									key={plan.name}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.1 * idx }}
									whileHover={{
										scale: 1.06,
										boxShadow: "0 8px 32px 0 rgba(255,182,193,0.25)",
									}}
									onClick={() => setSelected(idx)}
									className={`bg-white/90 rounded-2xl shadow-lg px-8 py-8 flex-1 min-w-[260px] max-w-xs flex flex-col items-center border transition-all duration-200 cursor-pointer ${
										selected === idx
											? "border-pink-400 ring-2 ring-pink-300"
											: "border-white/30"
									}`}
								>
									<div className="text-2xl font-semibold mb-2 text-gray-900">
										{plan.name}
									</div>
									<div className="text-gray-700 text-center">
										{plan.description}
									</div>
								</motion.div>
							))}
						</div>
						<AnimatePresence>
							{selected !== null && (
								<motion.div
									initial={{ opacity: 0, y: 20, height: 0 }}
									animate={{ opacity: 1, y: 0, height: "auto" }}
									exit={{ opacity: 0, y: 10, height: 0 }}
									transition={{ duration: 0.5, ease: "easeInOut" }}
									className="text-center mt-8 z-10"
								>
									<h2 className="text-xl text-white/80 font-display">
										Energy to sustain your space
									</h2>
									<p className="text-3xl text-white font-semibold my-2">
										{plans[selected].price}
									</p>
									<p className="text-white/60 italic max-w-sm mx-auto">
										Your support allows this space to remain a sanctuary,
										free of ads and distractions.
									</p>
									<motion.button
										className="mt-6 px-8 py-3 rounded-xl bg-pink-500 text-white font-semibold shadow-lg hover:bg-pink-600 transition"
										onClick={handleStart}
									>
										Continue with this intention
									</motion.button>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{showAnimation && selected !== null && (
					<motion.div
						key="emoji-sequence"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="flex flex-col items-center justify-center w-full h-full absolute top-0 left-0 z-20"
					>
						<div className="flex flex-col items-center justify-center min-h-[300px]">
							<motion.div
								key={emojiStep}
								initial={{ opacity: 0, scale: 0.7 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.5 }}
								className="text-7xl md:text-8xl mb-8"
							>
								{plans[selected].sequence[emojiStep]}
							</motion.div>
						</div>
						{emojiStep === plans[selected].sequence.length - 1 && (
							<>
								<div className="text-center text-white/90 italic text-2xl mb-8">
									Every journey begins with intention.
								</div>
								<button
									className="px-8 py-3 rounded-xl bg-pink-500 text-white font-semibold shadow-lg hover:bg-pink-600 transition"
									onClick={handleFoundations}
								>
									Let's set the foundations
								</button>
							</>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}