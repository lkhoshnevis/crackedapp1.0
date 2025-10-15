'use client'

import { useState, useEffect } from 'react'
import { LeaderboardService } from '@/lib/leaderboard'
import { LeaderboardEntry } from '@/lib/types'
import SearchBar from '@/components/SearchBar'
import ProfilePicture from '@/components/ProfilePicture'
import { AlumniProfile } from '@/lib/supabase'
import { TrendingUp, TrendingDown, Trophy, Medal, Award, ExternalLink, Home } from 'lucide-react'
import { LiquidButton, LiquidGlassCard } from '@/components/ui/liquid-glass-button'

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [dailyChanges, setDailyChanges] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const loadLeaderboard = async () => {
    setLoading(true)
    try {
      const [leaderboardData, changesData] = await Promise.all([
        LeaderboardService.getLeaderboard(100),
        LeaderboardService.getDailyChanges()
      ])
      
      setLeaderboard(leaderboardData)
      setDailyChanges(changesData)
    } catch (error) {
      console.error('Error loading leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    
    if (!query.trim()) {
      loadLeaderboard()
      return
    }

    setSearching(true)
    try {
      const searchResults = await LeaderboardService.searchLeaderboard(query)
      setLeaderboard(searchResults)
    } catch (error) {
      console.error('Error searching leaderboard:', error)
    } finally {
      setSearching(false)
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
    if (rank === 2) return <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
    if (rank === 3) return <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
    return <span className="text-sm sm:text-lg font-bold text-gray-600">#{rank}</span>
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />
    return null
  }

  useEffect(() => {
    loadLeaderboard()
  }, [])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-linkedin-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      {/* Navigation Buttons */}
      <div className="absolute top-6 left-6 flex space-x-3">
        <LiquidButton asChild size="default">
          <a href="/" className="inline-flex items-center font-medium">
            <Home className="w-5 h-5 mr-2" />
            Home
          </a>
        </LiquidButton>
        <LiquidButton asChild size="default">
          <a href="/vote" className="inline-flex items-center font-medium">
            <Trophy className="w-5 h-5 mr-2" />
            Vote
          </a>
        </LiquidButton>
        <LiquidButton asChild size="default" variant="primary">
          <a href="/leaderboard" className="inline-flex items-center font-medium">
            <TrendingUp className="w-5 h-5 mr-2" />
            Leaderboard
          </a>
        </LiquidButton>
      </div>

      <div className="max-w-4xl mx-auto pt-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            DVHS Alumni Leaderboard
          </h1>
          <p className="text-gray-600">
            Live ELO rankings of all DVHS alumni
          </p>
        </div>

      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search for a specific alumni..."
        />
        {searching && (
          <div className="text-center mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-linkedin-blue mx-auto"></div>
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <LiquidGlassCard className="overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Top Rankings'}
          </h2>
          <p className="text-sm text-gray-600">
            {searchQuery ? `${leaderboard.length} results` : `${leaderboard.length} alumni ranked`}
          </p>
        </div>

        {leaderboard.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No alumni found.</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchQuery ? 'Try a different search term.' : 'Check back later for rankings.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {leaderboard.map((entry) => (
              <div 
                key={entry.id} 
                className={`px-3 sm:px-6 py-3 sm:py-4 transition-all duration-200 ${
                  entry.linkedin_url 
                    ? 'hover:bg-linkedin-blue hover:bg-opacity-5 cursor-pointer hover:shadow-sm border-l-4 border-transparent hover:border-linkedin-blue' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => {
                  if (entry.linkedin_url) {
                    window.open(entry.linkedin_url, '_blank')
                  }
                }}
                title={entry.linkedin_url ? "Click to view LinkedIn profile" : ""}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                    {/* Rank */}
                    <div className="flex items-center justify-center w-8 sm:w-12 flex-shrink-0">
                      {getRankIcon(entry.rank)}
                    </div>

                    {/* Profile Picture */}
                    <div className="flex-shrink-0">
                      <ProfilePicture
                        profile={{
                          id: entry.id,
                          name: entry.name,
                          profile_picture_url: entry.profile_picture_url,
                          location: '',
                          experiences: [],
                          education: [],
                          created_at: '',
                          updated_at: '',
                          elo: entry.elo
                        }}
                        size="md"
                      />
                    </div>

                    {/* Name and ELO */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <h3 className="text-sm sm:text-lg font-semibold text-gray-900 break-words">
                          {entry.name}
                        </h3>
                        {entry.linkedin_url && (
                          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-linkedin-blue flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm text-linkedin-blue font-semibold">
                          ELO: {entry.elo}
                        </span>
                        {dailyChanges[entry.id] !== undefined && dailyChanges[entry.id] !== 0 && (
                          <div className="flex items-center gap-0.5 sm:gap-1">
                            {getChangeIcon(dailyChanges[entry.id])}
                            <span className={`text-xs sm:text-sm font-medium ${
                              dailyChanges[entry.id] > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {dailyChanges[entry.id] > 0 ? '+' : ''}{dailyChanges[entry.id]}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ELO Score - Hidden on mobile */}
                  <div className="text-right hidden sm:block">
                    <div className="text-2xl font-bold text-linkedin-blue">
                      {entry.elo}
                    </div>
                    <div className="text-sm text-gray-500">
                      ELO Rating
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </LiquidGlassCard>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Rankings are updated in real-time based on community votes.
            <br />
            ELO ratings start at 2000 for new profiles.
          </p>
        </div>
      </div>
    </div>
  )
}

