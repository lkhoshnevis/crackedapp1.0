'use client'

import { useEffect, useState } from 'react'
import { supabase, AlumniProfile } from '@/lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

export interface RealtimeUpdate {
  type: 'elo_change' | 'new_vote' | 'profile_update'
  data: any
  timestamp: string
}

export function useRealtimeUpdates() {
  const [updates, setUpdates] = useState<RealtimeUpdate[]>([])
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    // Create subscription channel
    const realtimeChannel = supabase
      .channel('public_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'alumni_profiles',
          filter: 'elo'
        },
        (payload) => {
          setUpdates(prev => [...prev.slice(-9), {
            type: 'elo_change',
            data: payload,
            timestamp: new Date().toISOString()
          }])
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'vote_sessions'
        },
        (payload) => {
          setUpdates(prev => [...prev.slice(-9), {
            type: 'new_vote',
            data: payload,
            timestamp: new Date().toISOString()
          }])
        }
      )
      .subscribe()

    setChannel(realtimeChannel)

    return () => {
      realtimeChannel.unsubscribe()
    }
  }, [])

  return { updates, channel }
}

export function useRealtimeLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<AlumniProfile[]>([])
  const [loading, setLoading] = useState(true)

  const loadLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('alumni_profiles')
        .select(`
          *,
          experiences (*),
          education (*)
        `)
        .order('elo', { ascending: false })
        .limit(100)

      if (error) throw error
      setLeaderboard(data || [])
    } catch (error) {
      console.error('Error loading leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLeaderboard()

    // Subscribe to ELO changes
    const channel = supabase
      .channel('leaderboard_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'alumni_profiles',
          filter: 'elo'
        },
        () => {
          // Reload leaderboard when ELO changes
          loadLeaderboard()
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  return { leaderboard, loading, refreshLeaderboard: loadLeaderboard }
}

export function useRealtimeStats() {
  const [stats, setStats] = useState<{
    totalProfiles: number
    totalVotes: number
    averageElo: number
  } | null>(null)

  const loadStats = async () => {
    try {
      const [
        { count: totalProfiles },
        { count: totalVotes },
        { data: profiles }
      ] = await Promise.all([
        supabase.from('alumni_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('vote_sessions').select('*', { count: 'exact', head: true }),
        supabase.from('alumni_profiles').select('elo')
      ])

      const averageElo = profiles ? 
        Math.round(profiles.reduce((sum, p) => sum + p.elo, 0) / profiles.length) : 2000

      setStats({
        totalProfiles: totalProfiles || 0,
        totalVotes: totalVotes || 0,
        averageElo
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  useEffect(() => {
    loadStats()

    // Subscribe to changes
    const channel = supabase
      .channel('stats_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'alumni_profiles'
        },
        () => {
          loadStats()
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'vote_sessions'
        },
        () => {
          loadStats()
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  return { stats, refreshStats: loadStats }
}

