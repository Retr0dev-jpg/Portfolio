import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter, Roboto_Mono } from 'next/font/google'
import MouseEffect from './components/effects/MouseEffect'
import ParticlesBackground from './components/effects/ParticlesBackground'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
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
      <body className="min-h-screen antialiased overflow-x-hidden" suppressHydrationWarning>
        <MouseEffect />
        <ParticlesBackground />
        {children}
        {process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true' && <Analytics />}
        {process.env.NEXT_PUBLIC_ENABLE_SPEED_INSIGHTS === 'true' && <SpeedInsights />}
      </body>
    </html>
  )
} 