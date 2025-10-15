'use client'

import { useState, useEffect } from 'react'
import { AlumniProfile } from '@/lib/supabase'
import SearchBar from '@/components/SearchBar'
import AlumniProfileCard from '@/components/AlumniProfileCard'
import ProfilePicture from '@/components/ProfilePicture'
import { Trophy, Users, TrendingUp, ExternalLink } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'

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
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img 
            src="/dvhs-logo.png" 
            alt="DVHS Wildcats Logo" 
            className="w-48 h-48 object-contain"
          />
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4">
          DVHS Alumni Ranking
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Vote between alumni profiles to determine who&apos;s more &quot;cracked&quot; and see live ELO rankings!
        </p>
        
        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 flex-wrap">
          <a href="/vote">
            <HoverBorderGradient
              containerClassName="rounded-full"
              className="bg-black text-white flex items-center space-x-2"
            >
              <Trophy className="w-5 h-5" />
              <span>Start Voting</span>
            </HoverBorderGradient>
          </a>
          <a href="/leaderboard">
            <HoverBorderGradient
              containerClassName="rounded-full"
              className="bg-black text-white flex items-center space-x-2"
            >
              <TrendingUp className="w-5 h-5" />
              <span>View Leaderboard</span>
            </HoverBorderGradient>
          </a>
        </div>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">
              Search Results
            </h2>
            {isSearching && (
              <div className="flex items-center text-gray-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                Searching...
              </div>
            )}
          </div>

          {searchResults.length === 0 && !isSearching ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-300 text-lg">No alumni found matching your search.</p>
              <p className="text-gray-500 text-sm mt-2">Try searching by name, company, school, or role.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {searchResults.map((profile) => (
                <div key={profile.id} className="bg-white/5 backdrop-blur-sm rounded-lg border border-gray-700 p-6 hover:bg-white/10 transition-all duration-200">
                  <div className="flex items-start space-x-4">
                    <ProfilePicture profile={profile} size="lg" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-xl font-semibold text-white">
                          {profile.name}
                        </h3>
                        {profile.linkedin_url && (
                          <ExternalLink className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-gray-300 mb-3">
                        {generateBio(profile)}
                      </p>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-400">
                          ELO: <span className="font-semibold text-blue-400">{profile.elo}</span>
                        </span>
                        {profile.linkedin_url && (
                          <a
                            href={profile.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
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

      {/* How It Works Section */}
      {!hasSearched && (
        <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-gray-700 p-8">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">1. Vote</h3>
              <p className="text-gray-300">
                Compare two randomly selected DVHS alumni profiles and vote for who you think is more &quot;cracked&quot;
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">2. Rank</h3>
              <p className="text-gray-300">
                Each vote affects ELO ratings in real-time. Winners gain points, losers lose points.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">3. Compete</h3>
              <p className="text-gray-300">
                Check the leaderboard to see who&apos;s currently at the top of the DVHS alumni rankings!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
