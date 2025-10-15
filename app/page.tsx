'use client'

import { useState, useEffect } from 'react'
import { AlumniProfile } from '@/lib/supabase'
import SearchBar from '@/components/SearchBar'
import AlumniProfileCard from '@/components/AlumniProfileCard'
import ProfilePicture from '@/components/ProfilePicture'
import { Trophy, Users, TrendingUp, ExternalLink } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Waves } from '@/components/ui/waves-background'

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
    <div className="relative max-w-4xl mx-auto">
      <Waves
        lineColor="rgba(0, 119, 181, 0.2)"
        backgroundColor="transparent"
        waveSpeedX={0.02}
        waveSpeedY={0.01}
        waveAmpX={40}
        waveAmpY={20}
        friction={0.9}
        tension={0.01}
        maxCursorMove={120}
        xGap={12}
        yGap={36}
      />
      
      {/* Hero Section */}
      <div className="relative z-10 text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          DVHS Alumni Network
        </h1>
        
        {/* Search Bar */}
        <div className="mb-4">
          <SearchBar onSearch={handleSearch} />
        </div>
        
        <p className="text-xl text-gray-600 mb-8">
          Find people the fun way!
        </p>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <a
            href="/vote"
            className="linkedin-button inline-flex items-center px-8 py-3 text-lg"
          >
            <Trophy className="w-5 h-5 mr-2" />
            Start Voting
          </a>
          <a
            href="/leaderboard"
            className="linkedin-button-outline inline-flex items-center px-8 py-3 text-lg"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            View Leaderboard
          </a>
        </div>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="relative z-10 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Search Results
            </h2>
            {isSearching && (
              <div className="flex items-center text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-linkedin-blue mr-2"></div>
                Searching...
              </div>
            )}
          </div>

          {searchResults.length === 0 && !isSearching ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No alumni found matching your search.</p>
              <p className="text-gray-400 text-sm mt-2">Try searching by name, company, school, or role.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {searchResults.map((profile) => (
                <div key={profile.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start space-x-4">
                    <ProfilePicture profile={profile} size="lg" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {profile.name}
                        </h3>
                        {profile.linkedin_url && (
                          <ExternalLink className="w-4 h-4 text-linkedin-blue flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">
                        {generateBio(profile)}
                      </p>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">
                          ELO: <span className="font-semibold text-linkedin-blue">{profile.elo}</span>
                        </span>
                        {profile.linkedin_url && (
                          <a
                            href={profile.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-linkedin-blue hover:text-linkedin-dark text-sm font-medium"
                          >
                            View LinkedIn →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
