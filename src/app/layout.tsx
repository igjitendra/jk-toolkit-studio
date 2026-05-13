import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JK Toolkit Studio — Universal Photo Sheet Generator',
  description: 'Professional photo studio toolkit for CSC centers, print shops, and photo studios. Generate mixed-size photo sheets with face detection and auto-layout.',
  keywords: ['photo studio', 'passport photo', 'photo sheet', 'CSC center', 'print shop', 'photo layout'],
  authors: [{ name: 'Jitendra Kumar', url: 'https://github.com/igjitendra' }],
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'JK Studio' },
  openGraph: {
    title: 'JK Toolkit Studio',
    description: 'Universal Photo Sheet Generator for photo studios and print shops',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#6366f1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-studio-bg text-studio-text antialiased">
        {children}
      </body>
    </html>
  );
}
