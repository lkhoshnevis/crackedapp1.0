import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import RealtimeIndicator from '@/components/RealtimeIndicator'
import { ClientNav } from '@/components/ClientNav'
import { Squares } from '@/components/ui/squares-background'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DVHS Alumni Ranking - Who\'s More Cracked?',
  description: 'Vote between DVHS alumni profiles to determine who\'s more cracked. See live ELO rankings and compete with your fellow Wildcats!',
  keywords: 'DVHS, Dougherty Valley High School, alumni, ranking, voting, ELO',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-[#060606] relative">
          <div className="fixed inset-0 w-full h-full -z-10">
            <Squares 
              direction="diagonal"
              speed={0.5}
              squareSize={40}
              borderColor="#333" 
              hoverFillColor="#222"
            />
          </div>
          <ClientNav />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-20 pb-24 relative z-10">
            {children}
          </main>
          <RealtimeIndicator />
        </div>
      </body>
    </html>
  )
}
