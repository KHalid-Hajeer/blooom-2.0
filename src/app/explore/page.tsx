import AppHeader from "@/components/layout/AppHeader";
import { LightBulbIcon, SparklesIcon, EyeIcon, HeartIcon, LockClosedIcon, PencilIcon } from '@heroicons/react/24/outline';

const exploreCards = [
    { title: "Reflection", icon: <LightBulbIcon className="w-10 h-10" /> },
    { title: "Curiosity", icon: <SparklesIcon className="w-10 h-10" /> },
    { title: "A Visual", icon: <EyeIcon className="w-10 h-10" /> },
    { title: "Emotion Check-in", icon: <HeartIcon className="w-10 h-10" /> },
    { title: "Mini-Unlock", icon: <LockClosedIcon className="w-10 h-10" />, status: "Coming Soon" },
    { title: "Creativity", icon: <PencilIcon className="w-10 h-10" /> },
];

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-background text-text font-body">
      <AppHeader />
      <main className="p-6 text-center">
        <h2 className="text-3xl font-display text-text mt-8">Six sparks to reflect, wonder, or simply enjoy.</h2>
        <p className="text-text-muted mt-2">Shuffles each week.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            {exploreCards.map(card => (
                <div key={card.title} className="bg-white rounded-2xl shadow p-8 flex flex-col items-center justify-center aspect-square text-primary/80 hover:text-primary hover:bg-primary/5 transition-all duration-300 cursor-pointer">
                    {card.icon}
                    <h3 className="font-display font-bold text-xl mt-4">{card.title}</h3>
                    {card.status && <p className="text-xs text-text-muted mt-1">{card.status}</p>}
                </div>
            ))}
        </div>
      </main>
    </div>
  );
}