"use client";

import { motion } from "framer-motion";
import InteractiveGradient from "@/components/animation/interactive-gradient";

const plans = [
	{
		name: "Sapling 🌱",
		description: "Start small. Nurture your growth with the essentials.",
	},
	{
		name: "Grove 🌳",
		description: "Expand your roots. More space and features for your journey.",
	},
	{
		name: "Sanctuary 🌸",
		description:
			"A flourishing haven. All-inclusive, for deep reflection and growth.",
	},
];

export default function PlanPage() {
	return (
		<div className="w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 py-12">
			{/* Animated background */}
			<InteractiveGradient
				startColor="var(--color-heavy-start)"
				endColor="var(--color-heaby-end)"
			/>

			<motion.h1
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.7 }}
				className="font-display text-3xl md:text-5xl text-white/90 mb-12 text-center z-10"
			>
				Choose your space to grow
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
						className="bg-white/90 rounded-2xl shadow-lg px-8 py-8 flex-1 min-w-[260px] max-w-xs flex flex-col items-center border border-white/30 transition-all duration-200 cursor-pointer"
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
			<div className="text-center text-white/80 italic text-lg mt-4 max-w-xl z-10">
				“You’re not buying tools. You’re building a space to return to.”
			</div>
		</div>
	);
}