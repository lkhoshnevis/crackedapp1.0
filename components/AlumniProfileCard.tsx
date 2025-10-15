'use client'

import { AlumniProfile } from '@/lib/supabase'
import ProfilePicture from './ProfilePicture'
import { ExternalLink, MapPin, Building, GraduationCap } from 'lucide-react'

interface AlumniProfileCardProps {
  profile: AlumniProfile
  showElo?: boolean
  showLinkedIn?: boolean
  blurred?: boolean
  eloChange?: number
  className?: string
  hoverLinkedIn?: boolean
}

export default function AlumniProfileCard({ 
  profile, 
  showElo = false, 
  showLinkedIn = true, 
  blurred = false,
  eloChange,
  className = '',
  hoverLinkedIn = false
}: AlumniProfileCardProps) {
  const primaryExperience = profile.experience_1_role && profile.experience_1_company 
    ? { role: profile.experience_1_role, company: profile.experience_1_company }
    : profile.experiences?.[0]
  const primaryEducation = profile.college_1_name && profile.college_1_degree
    ? { school: profile.college_1_name, degree: profile.college_1_degree }
    : profile.education?.[0]

  const cardContent = (
    <div className={`profile-card ${hoverLinkedIn && profile.linkedin_url ? 'cursor-pointer hover:shadow-lg transition-shadow duration-200' : ''} ${className}`}>
      {hoverLinkedIn && profile.linkedin_url && (
        <a
          href={profile.linkedin_url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-10"
          title="View LinkedIn Profile"
        />
      )}
      <div className="flex flex-col sm:flex-row items-start sm:space-x-4 space-y-3 sm:space-y-0">
        <div className={`mx-auto sm:mx-0 ${blurred ? 'blur-content' : ''}`}>
          <ProfilePicture profile={profile} size="xl" />
        </div>
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`text-sm sm:text-xl font-semibold text-gray-900 break-words ${blurred ? 'blur-content' : ''}`}>
              {profile.name}
            </h3>
            {showElo && (
              <div className={`flex items-center space-x-1 flex-shrink-0 ${blurred ? 'blur-content' : ''}`}>
                <span className="text-xs sm:text-lg font-bold text-linkedin-blue">
                  {profile.elo}
                </span>
                {eloChange !== undefined && eloChange !== 0 && (
                  <span className={`text-xs ${eloChange > 0 ? 'elo-change-positive' : 'elo-change-negative'}`}>
                    {eloChange > 0 ? '+' : ''}{eloChange}
                  </span>
                )}
              </div>
            )}
          </div>

          {primaryExperience && (
            <div className="mt-1 sm:mt-2 flex items-start text-gray-600">
              <Building className="w-3 h-3 sm:w-4 sm:h-4 mr-1 mt-0.5 flex-shrink-0" />
              <span className="text-[10px] leading-tight sm:text-sm break-words">
                {primaryExperience.role} at {primaryExperience.company}
              </span>
            </div>
          )}

          {profile.location && (
            <div className="mt-1 flex items-start text-gray-500">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 mt-0.5 flex-shrink-0" />
              <span className="text-[10px] leading-tight sm:text-sm break-words">{profile.location}</span>
            </div>
          )}

          {primaryEducation && (
            <div className="mt-1 sm:mt-2 flex items-start text-gray-600">
              <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 mt-0.5 flex-shrink-0" />
              <span className="text-[10px] leading-tight sm:text-sm break-words">
                {primaryEducation.degree} at {primaryEducation.school}
              </span>
            </div>
          )}

          {showLinkedIn && profile.linkedin_url && !blurred && (
            <div className="mt-3">
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-linkedin-blue hover:text-linkedin-dark text-xs sm:text-sm font-medium"
              >
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                View LinkedIn
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Experience Section */}
      {(profile.experiences && profile.experiences.length > 0) || profile.experience_1_role ? (
        <div className="mt-3 sm:mt-6">
          <h4 className="text-[10px] sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-3">Experience</h4>
          <div className="space-y-2 sm:space-y-3">
            {/* Show structured experience data first */}
            {[
              { role: profile.experience_1_role, company: profile.experience_1_company, logo: profile.experience_1_logo },
              { role: profile.experience_2_role, company: profile.experience_2_company, logo: profile.experience_2_logo },
              { role: profile.experience_3_role, company: profile.experience_3_company, logo: profile.experience_3_logo },
              { role: profile.experience_4_role, company: profile.experience_4_company, logo: profile.experience_4_logo }
            ].filter(exp => exp.role && exp.company).map((exp, index) => (
              <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                {exp.logo ? (
                  <img src={exp.logo} alt={exp.company} className="w-6 h-6 sm:w-8 sm:h-8 rounded object-cover flex-shrink-0" />
                ) : (
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                    <Building className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] leading-tight sm:text-sm font-medium text-gray-900 break-words">{exp.role}</p>
                  <p className="text-[10px] leading-tight sm:text-sm text-gray-600 break-words">{exp.company}</p>
                </div>
              </div>
            ))}
            {/* Fallback to experiences array if no structured data */}
            {!profile.experience_1_role && profile.experiences && profile.experiences.map((exp, index) => (
              <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                  <Building className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] leading-tight sm:text-sm font-medium text-gray-900 break-words">{exp.role}</p>
                  <p className="text-[10px] leading-tight sm:text-sm text-gray-600 break-words">{exp.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Education Section */}
      {(profile.education && profile.education.length > 0) || profile.college_1_name ? (
        <div className="mt-3 sm:mt-6">
          <h4 className="text-[10px] sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-3">Education</h4>
          <div className="space-y-2 sm:space-y-3">
            {/* Show structured education data first */}
            {[
              { school: profile.college_1_name, degree: profile.college_1_degree, logo: profile.college_1_logo },
              { school: profile.college_2_name, degree: profile.college_2_degree, logo: profile.college_2_logo },
              { school: profile.college_3_name, degree: profile.college_3_degree, logo: profile.college_3_logo }
            ].filter(edu => edu.school && edu.degree).map((edu, index) => (
              <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                {edu.logo ? (
                  <img src={edu.logo} alt={edu.school} className="w-6 h-6 sm:w-8 sm:h-8 rounded object-cover flex-shrink-0" />
                ) : (
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] leading-tight sm:text-sm font-medium text-gray-900 break-words">{edu.school}</p>
                  <p className="text-[10px] leading-tight sm:text-sm text-gray-600 break-words">{edu.degree}</p>
                </div>
              </div>
            ))}
            {/* Fallback to education array if no structured data */}
            {!profile.college_1_name && profile.education && profile.education.map((edu, index) => (
              <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] leading-tight sm:text-sm font-medium text-gray-900 break-words">{edu.school}</p>
                  <p className="text-[10px] leading-tight sm:text-sm text-gray-600 break-words">{edu.degree}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )

  return cardContent
}
