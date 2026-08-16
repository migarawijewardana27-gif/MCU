import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import AchievementToast from "@/components/AchievementToast";
import AmbientBackdrop from "@/components/AmbientBackdrop";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MARVEL MULTIVERSE TRACKER | Road to Avengers: Doomsday",
  description:
    "Track your progress through the ultimate Marvel watch order. 165+ titles across the MCU, Fox X-Men, and Sony Spider-Verse — all leading up to Avengers: Doomsday (Dec 2026).",
  keywords: [
    "Marvel",
    "MCU",
    "Avengers Doomsday",
    "watch order",
    "multiverse",
    "tracker",
    "marathon",
  ],
  openGraph: {
    title: "MARVEL MULTIVERSE TRACKER",
    description:
      "The ultimate Marvel marathon tracker. 165+ movies and TV shows leading to Avengers: Doomsday.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <AppProvider>
          <AmbientBackdrop />
          {children}
          <AchievementToast />
        </AppProvider>
      </body>
    </html>
  );
}
