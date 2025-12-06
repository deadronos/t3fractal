import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: "t3fractal",
  description: "t3fractal idle game",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

/**
 * Root layout component for the Next.js application.
 * Wraps the application with global styles and analytics.
 *
 * @param props - Component props.
 * @param props.children - The child pages to render.
 * @returns The root HTML structure.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        {children}
         <SpeedInsights />
         <Analytics />
      </body>
    </html>
  );
}
