'use client'

import { useState, useEffect } from 'react'
import { AlumniProfile } from '@/lib/supabase'
import AlumniProfileCard from '@/components/AlumniProfileCard'
import { VotingService, VotingPair } from '@/lib/voting'
import { ArrowRight, RotateCcw, Trophy } from 'lucide-react'

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
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <p className="text-gray-600">
          Vote between these two DVHS alumni profiles
        </p>
      </div>

      <div className="relative">
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
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

        {/* VS Circle - positioned between profiles */}
        <div className="flex justify-center items-center my-8">
          <div className="relative">
            <div className="w-20 h-20 bg-linkedin-blue rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
              VS
            </div>
            {!voted && (
              <button
                onClick={() => handleVote()}
                className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200"
              >
                Equal
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Next Pair Button */}
      {voted && (
        <div className="text-center">
          <button
            onClick={loadNewPair}
            className="linkedin-button inline-flex items-center px-8 py-3 text-lg"
          >
            <ArrowRight className="w-5 h-5 mr-2" />
            Next Pair
          </button>
        </div>
      )}

      {/* Voting Instructions */}
      {!voted && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            How to Vote
          </h3>
          <p className="text-blue-800">
            Click on the profile you think is more &quot;cracked&quot; or click &quot;Equal&quot; if you think they&apos;re equally impressive.
            <br />
            Names, profile pictures, ELO scores, and LinkedIn links will be revealed after you vote.
          </p>
        </div>
      )}
    </div>
  )
}
