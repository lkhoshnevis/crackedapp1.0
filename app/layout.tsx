import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import RealtimeIndicator from '@/components/RealtimeIndicator'

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
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold text-linkedin-blue">
                    DVHS Alumni Network
                  </h1>
                  <span className="text-xs text-gray-500">
                    limited to CS Majors
                  </span>
                </div>
                <nav className="flex space-x-4">
                  <a href="/" className="text-linkedin-blue hover:text-linkedin-dark font-medium">
                    Home
                  </a>
                  <a href="/vote" className="text-gray-600 hover:text-linkedin-blue font-medium">
                    Vote
                  </a>
                  <a href="/leaderboard" className="text-gray-600 hover:text-linkedin-blue font-medium">
                    Leaderboard
                  </a>
                </nav>
              </div>
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <RealtimeIndicator />
        </div>
      </body>
    </html>
  )
}
