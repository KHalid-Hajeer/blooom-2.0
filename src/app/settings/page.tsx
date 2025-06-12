import AppHeader from "@/components/layout/AppHeader";
import Link from "next/link"; // Import Link for navigation
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';


export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background text-text font-body">
      <AppHeader />
      <main className="p-6 max-w-2xl mx-auto">
        <h2 className="text-3xl font-display text-text mt-8">Settings</h2>
        
        <div className="mt-10 space-y-8">
            {/* Profile Section */}
            <div className="bg-white p-6 rounded-2xl shadow">
                <h3 className="font-bold font-display text-xl">Profile</h3>
                <div className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-500">Email</label>
                        <input type="email" value="sarah.m@example.com" disabled className="w-full p-2 border rounded-lg bg-background/50 mt-1" />
                    </div>
                    <button className="font-display text-primary hover:underline">Change Email</button>
                </div>
            </div>

            {/* Subscription Section */}
            <div className="bg-white p-6 rounded-2xl shadow">
                <h3 className="font-bold font-display text-xl">Subscription</h3>
                <div className="mt-4">
                    <p className="text-gray-600">You are currently on the <span className="font-bold text-primary">Bloom Free</span> plan.</p>
                    <p className="text-gray-600">Unlock your full potential. Tend to unlimited seeds with <span className="font-bold text-primary">Bloom Premium</span>.</p>
                    <button className="mt-4 px-6 py-3 bg-primary text-background font-bold font-display text-md rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300">
                        Explore Bloom Premium
                    </button>
                </div>
            </div>

            {/* Community & Feedback Section */}
            <div className="bg-white p-6 rounded-2xl shadow">
                <h3 className="font-bold font-display text-xl">Community</h3>
                <div className="mt-4 space-y-4">
                   <p className="text-gray-600">Your reflections help us tend to this space with care.</p>
                   <Link href="/share-a-thought">
                       <div className="flex items-center gap-3 text-primary hover:underline cursor-pointer">
                           <ChatBubbleLeftRightIcon className="w-6 h-6" />
                           <span className="font-display font-bold">Share a thought with the gardeners</span>
                       </div>
                   </Link>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
