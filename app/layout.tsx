'use client'

import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import RealtimeIndicator from '@/components/RealtimeIndicator'
import { Waves } from '@/components/ui/waves-background'

const outfit = Outfit({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <Waves
          lineColor="rgba(0, 119, 181, 0.15)"
          backgroundColor="transparent"
          waveSpeedX={0.02}
          waveSpeedY={0.01}
          waveAmpX={40}
          waveAmpY={20}
          friction={0.9}
          tension={0.01}
          maxCursorMove={120}
          xGap={12}
          yGap={36}
          className="fixed inset-0 z-0 pointer-events-none"
        />
        <main className="relative z-10 min-h-screen">
          {children}
        </main>
        <RealtimeIndicator />
      </body>
    </html>
  )
}
