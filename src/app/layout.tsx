import type { Metadata } from 'next';
import { Inter, Space_Grotesk, Orbitron, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Providers from '@/providers/Providers';
import { AmbientBackground } from '@/components/effects/AmbientBackground';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-heading', display: 'swap' });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'Vidya Chinthana (විද්‍යා චින්තන) — Digital Science Magazine',
  description: 'A premium bilingual science, technology, and speculative philosophy digital magazine.',
  openGraph: {
    title: 'Vidya Chinthana — Digital Science Magazine',
    description: 'A premium bilingual science, technology, and speculative philosophy digital magazine.',
    images: ['https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vidya Chinthana',
    description: 'A premium bilingual science, technology, and speculative philosophy digital magazine.',
    images: ['https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${orbitron.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-white dark:bg-[#030712] text-slate-900 dark:text-slate-100 antialiased min-h-screen relative selection:bg-blue-500 selection:text-white transition-colors duration-300">
        <Providers>
          <AmbientBackground />
          <div className="relative z-10">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}

