'use client'

import { AlumniProfile } from '@/lib/supabase'

interface ProfilePictureProps {
  profile: AlumniProfile
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-12 h-12 text-base',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-24 h-24 text-xl'
}

export default function ProfilePicture({ profile, size = 'md', className = '' }: ProfilePictureProps) {
  const initials = profile.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  // Generate background color based on name hash
  const colors = ['#0077B5', '#004182', '#0066CC', '#0052CC', '#003366']
  const colorIndex = profile.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
  const backgroundColor = colors[colorIndex]

  // Use actual profile picture if available, otherwise show initials
  if (profile.profile_picture_url) {
    return (
      <img
        src={profile.profile_picture_url}
        alt={profile.name}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
        onError={(e) => {
          // Fallback to initials if image fails to load
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
          const parent = target.parentElement
          if (parent) {
            parent.innerHTML = `<div class="${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-semibold" style="background-color: ${backgroundColor}">${initials}</div>`
          }
        }}
      />
    )
  }

  return (
    <div 
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-semibold ${className}`}
      style={{ backgroundColor }}
    >
      {initials}
    </div>
  )
}
