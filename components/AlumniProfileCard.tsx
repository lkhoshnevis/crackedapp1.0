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
      <div className="flex items-start space-x-4">
        <div className={blurred ? 'blur-content' : ''}>
          <ProfilePicture profile={profile} size="xl" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={`text-xl font-semibold text-gray-900 truncate ${blurred ? 'blur-content' : ''}`}>
              {profile.name}
            </h3>
            {showElo && (
              <div className={`flex items-center space-x-2 ${blurred ? 'blur-content' : ''}`}>
                <span className="text-lg font-bold text-linkedin-blue">
                  {profile.elo}
                </span>
                {eloChange !== undefined && eloChange !== 0 && (
                  <span className={`text-sm ${eloChange > 0 ? 'elo-change-positive' : 'elo-change-negative'}`}>
                    {eloChange > 0 ? '+' : ''}{eloChange}
                  </span>
                )}
              </div>
            )}
          </div>

          {primaryExperience && (
            <div className="mt-2 flex items-center text-gray-600">
              <Building className="w-4 h-4 mr-1" />
              <span className="text-sm">
                {primaryExperience.role} at {primaryExperience.company}
              </span>
            </div>
          )}

          {profile.location && (
            <div className="mt-1 flex items-center text-gray-500">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{profile.location}</span>
            </div>
          )}

          {profile.dvhs_class_of && (
            <div className="mt-1 flex items-center text-linkedin-blue">
              <span className="text-sm font-medium">DVHS Class of {profile.dvhs_class_of}</span>
            </div>
          )}

          {primaryEducation && (
            <div className="mt-2 flex items-center text-gray-600">
              <GraduationCap className="w-4 h-4 mr-1" />
              <span className="text-sm">
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
                className="inline-flex items-center text-linkedin-blue hover:text-linkedin-dark text-sm font-medium"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                View LinkedIn Profile
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Experience Section */}
      {(profile.experiences && profile.experiences.length > 0) || profile.experience_1_role ? (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Experience</h4>
          <div className="space-y-3">
            {/* Show structured experience data first */}
            {[
              { role: profile.experience_1_role, company: profile.experience_1_company, logo: profile.experience_1_logo },
              { role: profile.experience_2_role, company: profile.experience_2_company, logo: profile.experience_2_logo },
              { role: profile.experience_3_role, company: profile.experience_3_company, logo: profile.experience_3_logo },
              { role: profile.experience_4_role, company: profile.experience_4_company, logo: profile.experience_4_logo }
            ].filter(exp => exp.role && exp.company).map((exp, index) => (
              <div key={index} className="flex items-start space-x-3">
                {exp.logo ? (
                  <img src={exp.logo} alt={exp.company} className="w-8 h-8 rounded object-cover flex-shrink-0" />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                    <Building className="w-4 h-4 text-gray-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{exp.role}</p>
                  <p className="text-sm text-gray-600">{exp.company}</p>
                </div>
              </div>
            ))}
            {/* Fallback to experiences array if no structured data */}
            {!profile.experience_1_role && profile.experiences && profile.experiences.map((exp, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                  <Building className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{exp.role}</p>
                  <p className="text-sm text-gray-600">{exp.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Education Section */}
      {(profile.education && profile.education.length > 0) || profile.college_1_name ? (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Education</h4>
          <div className="space-y-3">
            {/* Show structured education data first */}
            {[
              { school: profile.college_1_name, degree: profile.college_1_degree, logo: profile.college_1_logo },
              { school: profile.college_2_name, degree: profile.college_2_degree, logo: profile.college_2_logo },
              { school: profile.college_3_name, degree: profile.college_3_degree, logo: profile.college_3_logo }
            ].filter(edu => edu.school && edu.degree).map((edu, index) => (
              <div key={index} className="flex items-start space-x-3">
                {edu.logo ? (
                  <img src={edu.logo} alt={edu.school} className="w-8 h-8 rounded object-cover flex-shrink-0" />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-4 h-4 text-gray-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{edu.school}</p>
                  <p className="text-sm text-gray-600">{edu.degree}</p>
                </div>
              </div>
            ))}
            {/* Fallback to education array if no structured data */}
            {!profile.college_1_name && profile.education && profile.education.map((edu, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{edu.school}</p>
                  <p className="text-sm text-gray-600">{edu.degree}</p>
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
