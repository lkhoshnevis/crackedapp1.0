'use client'

import { useState, useEffect } from 'react'
import { AlumniProfile } from '@/lib/supabase'
import SearchBar from '@/components/SearchBar'
import AlumniProfileCard from '@/components/AlumniProfileCard'
import ProfilePicture from '@/components/ProfilePicture'
import { Trophy, Users, TrendingUp, ExternalLink, Home } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { LiquidButton, LiquidGlassCard } from '@/components/ui/liquid-glass-button'

export default function HomePage() {
  const [searchResults, setSearchResults] = useState<AlumniProfile[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setHasSearched(false)
      return
    }

    setIsSearching(true)
    setHasSearched(true)

    try {
      // Search in multiple fields using Supabase text search
      const { data, error } = await supabase
        .from('alumni_profiles')
        .select(`
          *,
          experiences (*),
          education (*)
        `)
        .or(`name.ilike.%${query}%, experience_1_role.ilike.%${query}%, experience_1_company.ilike.%${query}%, college_1_name.ilike.%${query}%, college_1_degree.ilike.%${query}%`)
        .limit(20)

      if (error) {
        console.error('Search error:', error)
        setSearchResults([])
      } else {
        setSearchResults(data || [])
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const generateBio = (profile: AlumniProfile): string => {
    const primaryRole = profile.experience_1_role || profile.experiences?.[0]?.role || 'Professional'
    const primaryCompany = profile.experience_1_company || profile.experiences?.[0]?.company || 'Company'
    const primaryDegree = profile.college_1_degree || profile.education?.[0]?.degree || 'Degree'
    const primarySchool = profile.college_1_name || profile.education?.[0]?.school || 'School'
    
    return `${primaryRole} at ${primaryCompany} in ${profile.location}. Studied ${primaryDegree} at ${primarySchool}`
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Home Button */}
      <div className="absolute top-6 left-6">
        <LiquidButton asChild size="lg">
          <a href="/" className="inline-flex items-center font-medium rounded-full">
            <Home className="w-5 h-5 mr-2" />
            Home
          </a>
        </LiquidButton>
      </div>

      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full text-center">
          {/* DVHS Logo */}
          <div className="mb-6 flex justify-center">
            <img 
              src="/dvhs-logo.png" 
              alt="DVHS Logo" 
              className="w-20 h-20 sm:w-24 sm:h-24 opacity-80 hover:opacity-100 transition-opacity duration-300"
            />
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-2 flex items-center justify-center">
            <img 
              src="/dv-logo.png" 
              alt="DV" 
              className="h-16 sm:h-20 w-auto -mr-1"
            />
            <span className="text-[#5BA3D4] italic">HS</span>
            <span className="ml-2">Alumni Network</span>
          </h1>
          <p className="text-sm text-gray-400 mb-8">
            limited to CS Majors
          </p>
          
          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar onSearch={handleSearch} />
          </div>
          
          <p className="text-xl text-gray-300 mb-10">
            Find people the fun way!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 max-w-sm sm:max-w-none mx-auto">
            <LiquidButton asChild size="xl" variant="primary">
              <a href="/vote" className="inline-flex items-center justify-center text-base sm:text-lg font-semibold">
                <Trophy className="w-5 h-5 mr-2" />
                Start Voting
              </a>
            </LiquidButton>
            <LiquidButton asChild size="xl" variant="outline">
              <a href="/leaderboard" className="inline-flex items-center justify-center text-base sm:text-lg font-semibold">
                <TrendingUp className="w-5 h-5 mr-2" />
                View Leaderboard
              </a>
            </LiquidButton>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="px-4 sm:px-6 lg:px-8 pb-12 max-w-4xl mx-auto w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">
              Search Results
            </h2>
            {isSearching && (
              <div className="flex items-center text-gray-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-linkedin-blue mr-2"></div>
                Searching...
              </div>
            )}
          </div>

          {searchResults.length === 0 && !isSearching ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No alumni found matching your search.</p>
              <p className="text-gray-500 text-sm mt-2">Try searching by name, company, school, or role.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {searchResults.map((profile) => (
                <LiquidGlassCard key={profile.id} className="p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start space-x-4">
                    <ProfilePicture profile={profile} size="lg" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-xl font-semibold text-white">
                          {profile.name}
                        </h3>
                        {profile.linkedin_url && (
                          <ExternalLink className="w-4 h-4 text-white flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-gray-300 mb-3">
                        {generateBio(profile)}
                      </p>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-400">
                          ELO: <span className="font-semibold text-white">{profile.elo}</span>
                        </span>
                        {profile.linkedin_url && (
                          <a
                            href={profile.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-gray-300 text-sm font-medium"
                          >
                            View LinkedIn →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </LiquidGlassCard>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
