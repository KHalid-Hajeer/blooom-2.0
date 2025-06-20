import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import "./globals.css";

// Font setup
const fontDisplay = Lora({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-display",
  display: "swap",
});

const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bloom",
  description: "A kinder way to grow — a digital sanctuary for self-growth and reflection.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fontBody.variable} ${fontDisplay.variable}`}>
      <head>
        <meta charSet="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="theme-color" content="#1e1e24" />
      </head>
      <body className="font-body" style={{ background: "linear-gradient(180deg, var(--color-heavy-start), var(--color-heavy-end))", color: "rgba(255,255,255,0.9)" }}>
        <main>{children}</main>
      </body>
    </html>
  );
}
