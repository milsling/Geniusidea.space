// This is the main entry for Next.js App Router
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ThoughtCircus.Space',
  description: 'Browse, post, and share ideas. Minimal, creative, and open.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className + ' bg-white text-gray-900 min-h-screen'}>{children}</body>
    </html>
  );
}
