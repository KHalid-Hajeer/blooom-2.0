import type { Metadata } from "next";
import { Baloo_2, Source_Serif_4 } from "next/font/google";
import { GoalsProvider } from "@/contexts/GoalsContexts"; // Assuming the file is GoalsContexts.tsx
import "./globals.css";

// Configure Baloo 2 (primary font)
const fontDisplay = Baloo_2({
  subsets: ["latin"],
  weight: "500", // Using Medium weight (500) instead of a heavy bold
  variable: "--font-display",
  display: "swap",
});

// Configure Source Serif 4 (text font)
const fontBody = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "700"], // Regular and Bold weights
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bloom",
  description: "A kinder way to grow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fontBody.variable} ${fontDisplay.variable}`}>
      <body className="bg-background text-text font-body antialiased">
        {/* GoalsProvider wraps the entire application, making goal data available to all pages */}
        <GoalsProvider>
          {children}
        </GoalsProvider>
      </body>
    </html>
  );
}
