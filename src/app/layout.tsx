import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import type { ReactNode } from 'react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: 'EEIA CUP',
  description: 'Portal quizowy EEIA CUP dla trybow League of Legends i Counter-Strike 2.',
  metadataBase: new URL('https://example.com')
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pl" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
