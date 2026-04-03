import './globals.css'
import type { Metadata } from 'next'
import MouseEffect from './components/MouseEffect'
import ParticlesBackground from './components/ParticlesBackground'

export const metadata: Metadata = {
  title: 'Retr0_ Portfolio',
  description: 'Minimal and clean portfolio website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen antialiased overflow-x-hidden" suppressHydrationWarning>
        <MouseEffect />
        <ParticlesBackground />
        {children}
      </body>
    </html>
  )
} 