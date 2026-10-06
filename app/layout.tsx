import './globals.css';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Inter, Roboto_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import LazyEffects from './components/effects/LazyEffects';
import { FEATURES, SITE } from './config/site';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: `${SITE.brand} Portfolio`,
  description: `Portfolio di ${SITE.owner} — Full-stack developer, HMI specialist, codename ${SITE.brand}. If I can script it, I will.`,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // Browser extensions often inject attributes on <html>/<body>; ignore those hydration diffs.
    <html lang="it" className={`${inter.variable} ${robotoMono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://challenges.cloudflare.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen antialiased overflow-x-hidden" suppressHydrationWarning>
        <LazyEffects />
        {children}
        {FEATURES.analytics && <Analytics />}
        {FEATURES.speedInsights && <SpeedInsights />}
      </body>
    </html>
  );
}
