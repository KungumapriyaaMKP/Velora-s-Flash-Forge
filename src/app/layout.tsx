import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display, Montserrat } from 'next/font/google';

const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-playfair' 
});

const montserrat = Montserrat({ 
  subsets: ['latin'], 
  variable: '--font-montserrat' 
});

export const metadata: Metadata = {
  title: 'Velora Cosmetics',
  description: 'Limited Edition Flash Drops',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable}`}>
      <body className={`${montserrat.className} bg-[#fafafa] text-stone-800 antialiased selection:bg-stone-900 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
