import { AlumniProfile, supabase } from './supabase'
import { LeaderboardEntry } from './types'

export class LeaderboardService {
  static async getLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
    try {
      const { data, error } = await supabase
        .from('alumni_profiles')
        .select(`
          id,
          name,
          elo,
          profile_picture_url,
          linkedin_url,
          experiences (*),
          education (*)
        `)
        .order('elo', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching leaderboard:', error)
        return []
      }

      const leaderboard = (data || []).map((profile, index) => ({
        rank: index + 1,
        id: profile.id,
        name: profile.name,
        elo: profile.elo,
        change: 0, // Will be calculated separately for daily changes
        profile_picture_url: profile.profile_picture_url,
        linkedin_url: profile.linkedin_url
      }))

      return leaderboard
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
      return []
    }
  }

  static async searchLeaderboard(query: string): Promise<LeaderboardEntry[]> {
    try {
      const { data, error } = await supabase
        .from('alumni_profiles')
        .select(`
          id,
          name,
          elo,
          profile_picture_url,
          linkedin_url,
          experiences (*),
          education (*)
        `)
        .ilike('name', `%${query}%`)
        .order('elo', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Error searching leaderboard:', error)
        return []
      }

      const leaderboard = (data || []).map((profile, index) => ({
        rank: index + 1,
        id: profile.id,
        name: profile.name,
        elo: profile.elo,
        change: 0,
        profile_picture_url: profile.profile_picture_url,
        linkedin_url: profile.linkedin_url
      }))

      return leaderboard
    } catch (error) {
      console.error('Error searching leaderboard:', error)
      return []
    }
  }

  static async getProfileRank(profileId: string): Promise<number | null> {
    try {
      // Get the profile's ELO
      const { data: profile, error: profileError } = await supabase
        .from('alumni_profiles')
        .select('elo')
        .eq('id', profileId)
        .single()

      if (profileError || !profile) return null

      // Count how many profiles have higher ELO
      const { count, error: countError } = await supabase
        .from('alumni_profiles')
        .select('*', { count: 'exact', head: true })
        .gt('elo', profile.elo)

      if (countError) return null

      return (count || 0) + 1
    } catch (error) {
      console.error('Error getting profile rank:', error)
      return null
    }
  }

  static async getDailyChanges(): Promise<Record<string, number>> {
    try {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      yesterday.setHours(0, 0, 0, 0)

      const { data, error } = await supabase
        .from('elo_history')
        .select('alumni_id, change_amount')
        .gte('created_at', yesterday.toISOString())

      if (error) throw error

      const changes: Record<string, number> = {}
      ;(data || []).forEach(record => {
        changes[record.alumni_id] = (changes[record.alumni_id] || 0) + record.change_amount
      })

      return changes
    } catch (error) {
      console.error('Error getting daily changes:', error)
      return {}
    }
  }
}
