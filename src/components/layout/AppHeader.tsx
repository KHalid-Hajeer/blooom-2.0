"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// =================================================================================
// --- FILE: /components/layout/AppHeader.tsx (Updated) ---
// This is the updated, self-contained navigation header. It uses Next.js's
// <Link> component for client-side navigation and the usePathname hook to
// dynamically style the active link.
// =================================================================================
export default function AppHeader() {
  const pathname = usePathname(); // Hook to get the current URL path

  // Define the navigation links for the header
  const navLinks = [
    { name: "Garden", href: "/garden" },
    { name: "Today", href: "/today" },
    { name: "Explore", href: "/explore" },
    { name: "Settings", href: "/settings" },
  ];

  return (
    <header className="flex items-center justify-between p-6 bg-background">
      {/* The main logo links back to the primary user dashboard, the garden */}
        <h1 className="text-2xl font-display text-primary font-bold">Bloom</h1>


      {/* The main navigation menu */}
      <nav className="flex items-center gap-6 font-display text-md">
        {navLinks.map((link) => (
          <Link key={link.name} href={link.href}>
            <span
              className={`pb-1 transition-colors duration-300 ${
                // Apply active styles if the current path matches the link's href
                pathname === link.href
                  ? "text-primary border-b-2 border-primary"
                  : "text-text-muted hover:text-text"
              }`}
            >
              {link.name}
            </span>
          </Link>
        ))}
      </nav>
    </header>
  );
}
