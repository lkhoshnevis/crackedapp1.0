'use client'

import { useState, useEffect } from 'react'
import { AlumniProfile } from '@/lib/supabase'
import AlumniProfileCard from '@/components/AlumniProfileCard'
import { VotingService, VotingPair } from '@/lib/voting'
import { ArrowRight, RotateCcw, Trophy, Home, TrendingUp } from 'lucide-react'
import { LiquidButton } from '@/components/ui/liquid-glass-button'

export default function VotePage() {
  const [votingPair, setVotingPair] = useState<VotingPair | null>(null)
  const [loading, setLoading] = useState(true)
  const [voted, setVoted] = useState(false)
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null)
  const [votingEqual, setVotingEqual] = useState(false)
  const [eloChanges, setEloChanges] = useState<{
    profile1: { oldElo: number; newElo: number; change: number }
    profile2: { oldElo: number; newElo: number; change: number }
  } | null>(null)

  const loadNewPair = async () => {
    setLoading(true)
    setVoted(false)
    setSelectedWinner(null)
    setVotingEqual(false)
    setEloChanges(null)
    
    try {
      const pair = await VotingService.getRandomPair()
      setVotingPair(pair)
    } catch (error) {
      console.error('Error loading voting pair:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (winnerId?: string) => {
    if (!votingPair) return

    setSelectedWinner(winnerId || null)
    setVotingEqual(!winnerId)
    setVoted(true)

    try {
      const result = await VotingService.submitVote(
        votingPair.profile1.id,
        votingPair.profile2.id,
        votingPair.sessionId,
        winnerId
      )
      
      setEloChanges(result.eloChanges)
    } catch (error) {
      console.error('Error submitting vote:', error)
    }
  }

  useEffect(() => {
    loadNewPair()
  }, [])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-linkedin-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading voting pair...</p>
        </div>
      </div>
    )
  }

  if (!votingPair) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Profiles Available</h2>
          <p className="text-gray-600 mb-6">There aren't enough alumni profiles to create a voting pair.</p>
          <button
            onClick={loadNewPair}
            className="linkedin-button"
          >
            Try Again
          </button>
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
        <LiquidButton asChild size="default" variant="primary">
          <a href="/vote" className="inline-flex items-center font-medium">
            <Trophy className="w-5 h-5 mr-2" />
            Vote
          </a>
        </LiquidButton>
        <LiquidButton asChild size="default">
          <a href="/leaderboard" className="inline-flex items-center font-medium">
            <TrendingUp className="w-5 h-5 mr-2" />
            Leaderboard
          </a>
        </LiquidButton>
      </div>

      <div className="max-w-6xl mx-auto pt-16">
        <div className="text-center mb-8">
          <p className="text-gray-600">
            Vote between these two DVHS alumni profiles
          </p>
        </div>

        <div className="relative flex justify-center items-center">
          {/* Profiles Container */}
          <div className="grid grid-cols-2 gap-4 sm:gap-8 w-full max-w-5xl">
            {/* Profile 1 */}
            <div className="relative">
              <div className={`${!voted ? 'cursor-pointer hover:shadow-lg' : ''} transition-all duration-200`}>
                <AlumniProfileCard
                  profile={votingPair.profile1}
                  showElo={voted}
                  showLinkedIn={voted}
                  blurred={!voted}
                  eloChange={eloChanges?.profile1.change}
                  hoverLinkedIn={voted}
                />
              </div>
              {!voted && (
                <button
                  onClick={() => handleVote(votingPair.profile1.id)}
                  className="absolute inset-0 w-full h-full bg-transparent hover:bg-linkedin-blue hover:bg-opacity-10 transition-colors duration-200 rounded-lg"
                />
              )}
            </div>

            {/* Profile 2 */}
            <div className="relative">
              <div className={`${!voted ? 'cursor-pointer hover:shadow-lg' : ''} transition-all duration-200`}>
                <AlumniProfileCard
                  profile={votingPair.profile2}
                  showElo={voted}
                  showLinkedIn={voted}
                  blurred={!voted}
                  eloChange={eloChanges?.profile2.change}
                  hoverLinkedIn={voted}
                />
              </div>
              {!voted && (
                <button
                  onClick={() => handleVote(votingPair.profile2.id)}
                  className="absolute inset-0 w-full h-full bg-transparent hover:bg-linkedin-blue hover:bg-opacity-10 transition-colors duration-200 rounded-lg"
                />
              )}
            </div>
          </div>

          {/* Center Action Button */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            {!voted ? (
              <LiquidButton
                onClick={() => handleVote()}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full text-sm sm:text-base"
              >
                Equal
              </LiquidButton>
            ) : (
              <LiquidButton
                onClick={loadNewPair}
                variant="primary"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full"
              >
                <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </LiquidButton>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
