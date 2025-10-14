'use client'

import { useEffect, useState } from 'react'
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates'
import { Activity, Users, TrendingUp } from 'lucide-react'

export default function RealtimeIndicator() {
  const { updates } = useRealtimeUpdates()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (updates.length > 0) {
      setIsVisible(true)
      const timer = setTimeout(() => setIsVisible(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [updates])

  if (!isVisible || updates.length === 0) return null

  const latestUpdate = updates[updates.length - 1]

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'elo_change':
        return <TrendingUp className="w-4 h-4" />
      case 'new_vote':
        return <Users className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getUpdateMessage = (type: string) => {
    switch (type) {
      case 'elo_change':
        return 'ELO ratings updated!'
      case 'new_vote':
        return 'New vote recorded!'
      default:
        return 'Live update!'
    }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-linkedin-blue text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-pulse">
      <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
      {getUpdateIcon(latestUpdate.type)}
      <span className="text-sm font-medium">{getUpdateMessage(latestUpdate.type)}</span>
    </div>
  )
}

