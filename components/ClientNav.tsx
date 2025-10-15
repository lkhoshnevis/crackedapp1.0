"use client"

import { NavBar } from '@/components/ui/tubelight-navbar'

const navItems = [
  { name: 'Home', url: '/', iconName: 'home' },
  { name: 'Leaderboard', url: '/leaderboard', iconName: 'trophy' },
]

export function ClientNav() {
  return <NavBar items={navItems} />
}
