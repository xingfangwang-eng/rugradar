import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Audit Pulse | Smart Contract Security Audit Tool & Crypto Rug Pull Scanner',
  description: 'Protect your crypto investments with real-time AI-powered smart contract security audits. Detect rug pulls, honeypots, and vulnerabilities in seconds.',
  openGraph: {
    title: 'Audit Pulse | Smart Contract Security Audit Tool',
    description: 'Protect your crypto investments with real-time AI-powered smart contract security audits.',
    url: 'https://auditpulse.com',
    siteName: 'Audit Pulse',
    images: [
      {
        url: 'https://auditpulse.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Audit Pulse - Smart Contract Security Audit Tool',
      },
    ],
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
