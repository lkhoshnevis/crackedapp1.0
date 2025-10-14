import { supabase } from './supabase'
import { parseCSV, parseExperiencesAndEducation } from './csv-parser'
import { AlumniProfile, Experience, Education } from './supabase'

export interface AdminStats {
  totalProfiles: number
  totalVotes: number
  totalSessions: number
  averageElo: number
  topProfile: AlumniProfile | null
  recentActivity: {
    votesToday: number
    newProfilesToday: number
    averageEloChangeToday: number
  }
}

export interface VoteAnalytics {
  sessionId: string
  timestamp: string
  profile1Name: string
  profile2Name: string
  winnerName?: string
  votedEqual: boolean
  eloChanges: {
    profile1: number
    profile2: number
  }
}

export class AdminService {
  static async getStats(): Promise<AdminStats> {
    try {
      // Get basic counts with error handling
      const [
        { count: totalProfiles, error: profilesError },
        { count: totalVotes, error: votesError },
        { count: totalSessions, error: sessionsError },
        { data: profiles, error: eloError },
        { data: topProfile, error: topProfileError }
      ] = await Promise.all([
        supabase.from('alumni_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('vote_sessions').select('*', { count: 'exact', head: true }),
        supabase.from('vote_sessions').select('*', { count: 'exact', head: true }),
        supabase.from('alumni_profiles').select('elo'),
        supabase.from('alumni_profiles').select(`
          *,
          experiences (*),
          education (*)
        `).order('elo', { ascending: false }).limit(1).maybeSingle()
      ])

      // Log any errors for debugging
      if (profilesError) console.error('Error getting profiles count:', profilesError)
      if (votesError) console.error('Error getting votes count:', votesError)
      if (sessionsError) console.error('Error getting sessions count:', sessionsError)
      if (eloError) console.error('Error getting ELO data:', eloError)
      if (topProfileError) console.error('Error getting top profile:', topProfileError)

      // Calculate average ELO
      const averageElo = profiles && profiles.length > 0 ? 
        Math.round(profiles.reduce((sum, p) => sum + p.elo, 0) / profiles.length) : 2000

      // Get today's activity
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const [
        { count: votesToday, error: votesTodayError },
        { count: newProfilesToday, error: newProfilesTodayError },
        { data: eloChangesToday, error: eloChangesTodayError }
      ] = await Promise.all([
        supabase.from('vote_sessions').select('*', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
        supabase.from('alumni_profiles').select('*', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
        supabase.from('elo_history').select('change_amount').gte('created_at', today.toISOString())
      ])

      // Log errors for today's activity
      if (votesTodayError) console.error('Error getting votes today:', votesTodayError)
      if (newProfilesTodayError) console.error('Error getting new profiles today:', newProfilesTodayError)
      if (eloChangesTodayError) console.error('Error getting ELO changes today:', eloChangesTodayError)

      const averageEloChangeToday = eloChangesToday && eloChangesToday.length > 0 ? 
        Math.round(eloChangesToday.reduce((sum, change) => sum + change.change_amount, 0) / eloChangesToday.length) : 0

      return {
        totalProfiles: totalProfiles || 0,
        totalVotes: totalVotes || 0,
        totalSessions: totalSessions || 0,
        averageElo,
        topProfile: topProfile || null,
        recentActivity: {
          votesToday: votesToday || 0,
          newProfilesToday: newProfilesToday || 0,
          averageEloChangeToday
        }
      }
    } catch (error) {
      console.error('Error getting admin stats:', error)
      throw error
    }
  }

  static async getVoteAnalytics(limit: number = 50): Promise<VoteAnalytics[]> {
    try {
      const { data, error } = await supabase
        .from('vote_sessions')
        .select(`
          id,
          session_id,
          created_at,
          alumni_1_id,
          alumni_2_id,
          winner_id,
          voted_equal,
          alumni_profiles!vote_sessions_alumni_1_id_fkey(name),
          alumni_profiles!vote_sessions_alumni_2_id_fkey(name),
          alumni_profiles!vote_sessions_winner_id_fkey(name),
          elo_history(change_amount)
        `)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return (data || []).map(session => ({
        sessionId: session.session_id,
        timestamp: session.created_at,
        profile1Name: 'Unknown', // TODO: Fix alumni_profiles relation
        profile2Name: 'Unknown', // TODO: Fix alumni_profiles relation
        winnerName: undefined, // TODO: Fix alumni_profiles relation
        votedEqual: session.voted_equal,
        eloChanges: {
          profile1: session.elo_history?.[0]?.change_amount || 0,
          profile2: session.elo_history?.[1]?.change_amount || 0
        }
      }))
    } catch (error) {
      console.error('Error getting vote analytics:', error)
      throw error
    }
  }

  static async uploadCSV(csvContent: string): Promise<{ success: boolean; message: string; profilesAdded: number }> {
    try {
      // Parse CSV
      const alumniData = parseCSV(csvContent)
      
      console.log('CSV parsed successfully. Found', alumniData.length, 'profiles')
      
      if (alumniData.length === 0) {
        return { success: false, message: 'No valid profiles found in CSV', profilesAdded: 0 }
      }

      let profilesAdded = 0

      // Process each alumni profile
      for (const alumni of alumniData) {
        const parsedProfile = parseExperiencesAndEducation(alumni)

        // Check if profile already exists by name (since LinkedIn URL might be empty)
        const { data: existingProfile, error: checkError } = await supabase
          .from('alumni_profiles')
          .select('id')
          .eq('name', parsedProfile.name)
          .maybeSingle()

        if (checkError) {
          console.error('Error checking existing profile:', checkError)
        }

        if (existingProfile) {
          console.log('Skipping existing profile:', parsedProfile.name)
          continue // Skip existing profiles
        }

        // Insert new profile
        const { data: newProfile, error: profileError } = await supabase
          .from('alumni_profiles')
          .insert({
            name: parsedProfile.name,
            location: parsedProfile.location,
            profile_picture_url: parsedProfile.profile_picture_url,
            high_school: parsedProfile.high_school,
            dvhs_class_of: parsedProfile.dvhs_class_of,
            college_1_name: parsedProfile.college_1_name,
            college_1_degree: parsedProfile.college_1_degree,
            college_1_logo: parsedProfile.college_1_logo,
            college_2_name: parsedProfile.college_2_name,
            college_2_degree: parsedProfile.college_2_degree,
            college_2_logo: parsedProfile.college_2_logo,
            college_3_name: parsedProfile.college_3_name,
            college_3_degree: parsedProfile.college_3_degree,
            college_3_logo: parsedProfile.college_3_logo,
            experience_1_company: parsedProfile.experience_1_company,
            experience_1_role: parsedProfile.experience_1_role,
            experience_1_logo: parsedProfile.experience_1_logo,
            experience_2_company: parsedProfile.experience_2_company,
            experience_2_role: parsedProfile.experience_2_role,
            experience_2_logo: parsedProfile.experience_2_logo,
            experience_3_company: parsedProfile.experience_3_company,
            experience_3_role: parsedProfile.experience_3_role,
            experience_3_logo: parsedProfile.experience_3_logo,
            experience_4_company: parsedProfile.experience_4_company,
            experience_4_role: parsedProfile.experience_4_role,
            experience_4_logo: parsedProfile.experience_4_logo,
            linkedin_url: parsedProfile.linkedin_url,
            elo: 2000 // Default ELO
          })
          .select()
          .single()

        if (profileError) {
          console.error('Error inserting profile:', parsedProfile.name, profileError)
          continue
        }

        console.log('Successfully inserted profile:', parsedProfile.name)

        // Insert experiences
        if (parsedProfile.experiences.length > 0) {
          const experiences = parsedProfile.experiences.map((exp, index) => ({
            alumni_id: newProfile.id,
            role: exp.role,
            company: exp.company,
            order_index: index
          }))

          await supabase.from('experiences').insert(experiences)
        }

        // Insert education
        if (parsedProfile.education.length > 0) {
          const education = parsedProfile.education.map((edu, index) => ({
            alumni_id: newProfile.id,
            school: edu.school,
            degree: edu.degree,
            order_index: index
          }))

          await supabase.from('education').insert(education)
        }

        profilesAdded++
      }

      return { 
        success: true, 
        message: `Successfully added ${profilesAdded} new profiles`, 
        profilesAdded 
      }
    } catch (error) {
      console.error('Error uploading CSV:', error)
      return { 
        success: false, 
        message: `Error processing CSV: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        profilesAdded: 0 
      }
    }
  }

  static async getAllProfiles(limit: number = 100): Promise<AlumniProfile[]> {
    try {
      const { data, error } = await supabase
        .from('alumni_profiles')
        .select(`
          *,
          experiences (*),
          education (*)
        `)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error getting all profiles:', error)
        return []
      }
      return data || []
    } catch (error) {
      console.error('Error getting all profiles:', error)
      return []
    }
  }

  static async updateProfileElo(profileId: string, newElo: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('alumni_profiles')
        .update({ elo: newElo })
        .eq('id', profileId)

      return !error
    } catch (error) {
      console.error('Error updating profile ELO:', error)
      return false
    }
  }
}
