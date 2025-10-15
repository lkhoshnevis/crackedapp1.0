'use client'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import RealtimeIndicator from '@/components/RealtimeIndicator'
import { Waves } from '@/components/ui/waves-background'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-black relative">
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
            className="fixed inset-0 z-0"
          />
          <main className="relative z-10">
            {children}
          </main>
          <RealtimeIndicator />
        </div>
      </body>
    </html>
  )
}
