import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter, Roboto_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import LazyEffects from './components/effects/LazyEffects'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto-mono',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: 'Retr0_ Portfolio',
  description: 'Portfolio di Marco Simone Cannizzaro — Full-stack developer, HMI specialist, codename Retr0_. If I can script it, I will.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" className={`${inter.variable} ${robotoMono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://challenges.cloudflare.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen antialiased overflow-x-hidden" suppressHydrationWarning>
        <LazyEffects />
        {children}
        {process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true' && <Analytics />}
        {process.env.NEXT_PUBLIC_ENABLE_SPEED_INSIGHTS === 'true' && <SpeedInsights />}
      </body>
    </html>
  )
} 