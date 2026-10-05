import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Velora's Flash Forge — High-Scale E-Commerce Flash Sale Platform",
  description: 'System Design Hackathon Blueprint & High-Concurrency Simulator (10,000 Users vs 100 Units)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
