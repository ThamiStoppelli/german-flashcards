import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wortschatz AI",
  description: "AI-powered German flashcards for serious language learning.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
