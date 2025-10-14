import { AlumniProfile, supabase } from './supabase'
import { EloCalculator } from './elo-calculator'

export interface VotingPair {
  profile1: AlumniProfile
  profile2: AlumniProfile
  sessionId: string
}

export interface VoteResult {
  winner?: string
  equal: boolean
  sessionId: string
  eloChanges: {
    profile1: { oldElo: number; newElo: number; change: number }
    profile2: { oldElo: number; newElo: number; change: number }
  }
}

export class VotingService {
  private static recentProfiles: string[] = []
  private static readonly RECENT_BUFFER_SIZE = 10

  static async getRandomPair(): Promise<VotingPair> {
    try {
      // Get all alumni profiles
      const { data: profiles, error } = await supabase
        .from('alumni_profiles')
        .select(`
          *,
          experiences (*),
          education (*)
        `)
        .order('elo', { ascending: false })

      if (error) throw error
      if (!profiles || profiles.length < 2) {
        throw new Error('Not enough profiles for voting')
      }

      // Filter out recently shown profiles
      const availableProfiles = profiles.filter(
        profile => !this.recentProfiles.includes(profile.id)
      )

      // If we don't have enough available profiles, reset the recent list
      const profilesToUse = availableProfiles.length >= 2 ? availableProfiles : profiles

      // Randomly select two profiles
      const shuffled = [...profilesToUse].sort(() => Math.random() - 0.5)
      const profile1 = shuffled[0]
      const profile2 = shuffled[1]

      // Add to recent profiles
      this.recentProfiles.push(profile1.id, profile2.id)
      
      // Keep only the most recent profiles
      if (this.recentProfiles.length > this.RECENT_BUFFER_SIZE) {
        this.recentProfiles = this.recentProfiles.slice(-this.RECENT_BUFFER_SIZE)
      }

      // Generate session ID
      const sessionId = `vote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      return {
        profile1,
        profile2,
        sessionId
      }
    } catch (error) {
      console.error('Error getting random pair:', error)
      throw error
    }
  }

  static async submitVote(
    profile1Id: string,
    profile2Id: string,
    sessionId: string,
    winnerId?: string
  ): Promise<VoteResult> {
    try {
      const votedEqual = !winnerId

      // Create vote session record
      const { data: voteSession, error: sessionError } = await supabase
        .from('vote_sessions')
        .insert({
          session_id: sessionId,
          alumni_1_id: profile1Id,
          alumni_2_id: profile2Id,
          winner_id: winnerId,
          voted_equal: votedEqual
        })
        .select()
        .single()

      if (sessionError) throw sessionError

      let eloChanges = {
        profile1: { oldElo: 0, newElo: 0, change: 0 },
        profile2: { oldElo: 0, newElo: 0, change: 0 }
      }

      // Handle ELO changes if not equal vote
      if (!votedEqual && winnerId) {
        // Get current ELO ratings
        const { data: profiles, error: profilesError } = await supabase
          .from('alumni_profiles')
          .select('id, elo')
          .in('id', [profile1Id, profile2Id])

        if (profilesError) throw profilesError

        const profile1 = profiles.find(p => p.id === profile1Id)
        const profile2 = profiles.find(p => p.id === profile2Id)

        if (!profile1 || !profile2) throw new Error('Profile not found')

        const winnerElo = winnerId === profile1Id ? profile1.elo : profile2.elo
        const loserElo = winnerId === profile1Id ? profile2.elo : profile1.elo

        // Calculate new ELO ratings
        const { winnerNewElo, loserNewElo, winnerChange, loserChange } = 
          EloCalculator.calculateNewElos(winnerElo, loserElo)

        // Update profiles in database
        const updates = [
          supabase
            .from('alumni_profiles')
            .update({ elo: winnerId === profile1Id ? winnerNewElo : loserNewElo })
            .eq('id', winnerId),
          supabase
            .from('alumni_profiles')
            .update({ elo: winnerId === profile1Id ? loserNewElo : winnerNewElo })
            .eq('id', winnerId === profile1Id ? profile2Id : profile1Id)
        ]

        await Promise.all(updates)

        // Create ELO history records
        const historyInserts = [
          supabase
            .from('elo_history')
            .insert({
              alumni_id: winnerId,
              old_elo: winnerElo,
              new_elo: winnerNewElo,
              change_amount: winnerChange,
              vote_session_id: voteSession.id
            }),
          supabase
            .from('elo_history')
            .insert({
              alumni_id: winnerId === profile1Id ? profile2Id : profile1Id,
              old_elo: loserElo,
              new_elo: loserNewElo,
              change_amount: loserChange,
              vote_session_id: voteSession.id
            })
        ]

        await Promise.all(historyInserts)

        // Set elo changes for response
        eloChanges = {
          profile1: {
            oldElo: profile1.elo,
            newElo: winnerId === profile1Id ? winnerNewElo : loserNewElo,
            change: winnerId === profile1Id ? winnerChange : loserChange
          },
          profile2: {
            oldElo: profile2.elo,
            newElo: winnerId === profile1Id ? loserNewElo : winnerNewElo,
            change: winnerId === profile1Id ? loserChange : winnerChange
          }
        }
      }

      return {
        winner: winnerId,
        equal: votedEqual,
        sessionId,
        eloChanges
      }
    } catch (error) {
      console.error('Error submitting vote:', error)
      throw error
    }
  }
}

