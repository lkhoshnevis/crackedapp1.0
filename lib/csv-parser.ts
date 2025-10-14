import Papa from 'papaparse'
import { AlumniData, ParsedAlumniProfile } from './types'

export function parseCSV(csvContent: string): AlumniData[] {
  const result = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim()
  })

  return result.data.map((row: any) => ({
    Profile_Name: row['Profile_Name']?.trim() || '',
    addressWithoutCountry: row['addressWithoutCountry']?.trim() || '',
    Profile_Picture_URL: row['Profile_Picture_URL']?.trim() || '',
    High_School: row['High School ']?.trim() || row['High_School']?.trim() || '',
    DVHS_class_of: row['DVHS class of ']?.trim() || row['DVHS_class_of']?.trim() || '',
    College_1_Name: row['College_1_Name']?.trim() || '',
    College_1_Degree: row['College_1_Degree']?.trim() || '',
    College_1_Logo: row['College_1_Logo']?.trim() || '',
    College_2_Name: row['College_2_Name']?.trim() || '',
    College_2_Degree: row['College_2_Degree']?.trim() || '',
    College_2_Logo: row['College_2_Logo']?.trim() || '',
    College_3_Name: row['College_3_Name']?.trim() || '',
    College_3_Degree: row['College_3_Degree']?.trim() || '',
    College_3_Logo: row['College_3_Logo']?.trim() || '',
    Experience_1_Company: row['Experience_1_Company']?.trim() || '',
    Experience_1_Role: row['Experience_1_Role']?.trim() || '',
    Experience_1_Logo: row['Experience_1_Logo']?.trim() || '',
    Experience_2_Company: row['Experience_2_Company']?.trim() || '',
    Experience_2_Role: row['Experience_2_Role']?.trim() || '',
    Experience_2_Logo: row['Experience_2_Logo']?.trim() || '',
    Experience_3_Company: row['Experience_3_Company']?.trim() || '',
    Experience_3_Role: row['Experience_3_Role']?.trim() || '',
    Experience_3_Logo: row['Experience_3_Logo']?.trim() || '',
    Experience_4_Company: row['Experience_4_Company']?.trim() || '',
    Experience_4_Role: row['Experience_4_Role']?.trim() || '',
    Experience_4_Logo: row['Experience_4_Logo']?.trim() || '',
    linkedinUrl: row['linkedinUrl']?.trim() || ''
  })).filter(alumni => alumni.Profile_Name)
}

export function parseExperiencesAndEducation(alumni: AlumniData): ParsedAlumniProfile {
  // Parse experiences from the structured columns
  const experiences = []
  
  if (alumni.Experience_1_Company && alumni.Experience_1_Role) {
    experiences.push({
      role: alumni.Experience_1_Role,
      company: alumni.Experience_1_Company,
      logo: alumni.Experience_1_Logo
    })
  }
  if (alumni.Experience_2_Company && alumni.Experience_2_Role) {
    experiences.push({
      role: alumni.Experience_2_Role,
      company: alumni.Experience_2_Company,
      logo: alumni.Experience_2_Logo
    })
  }
  if (alumni.Experience_3_Company && alumni.Experience_3_Role) {
    experiences.push({
      role: alumni.Experience_3_Role,
      company: alumni.Experience_3_Company,
      logo: alumni.Experience_3_Logo
    })
  }
  if (alumni.Experience_4_Company && alumni.Experience_4_Role) {
    experiences.push({
      role: alumni.Experience_4_Role,
      company: alumni.Experience_4_Company,
      logo: alumni.Experience_4_Logo
    })
  }

  // Parse education from the structured columns
  const education = []
  
  if (alumni.College_1_Name && alumni.College_1_Degree) {
    education.push({
      school: alumni.College_1_Name,
      degree: alumni.College_1_Degree,
      logo: alumni.College_1_Logo
    })
  }
  if (alumni.College_2_Name && alumni.College_2_Degree) {
    education.push({
      school: alumni.College_2_Name,
      degree: alumni.College_2_Degree,
      logo: alumni.College_2_Logo
    })
  }
  if (alumni.College_3_Name && alumni.College_3_Degree) {
    education.push({
      school: alumni.College_3_Name,
      degree: alumni.College_3_Degree,
      logo: alumni.College_3_Logo
    })
  }

  return {
    name: alumni.Profile_Name,
    location: alumni.addressWithoutCountry,
    profile_picture_url: alumni.Profile_Picture_URL,
    high_school: alumni.High_School,
    dvhs_class_of: alumni.DVHS_class_of,
    college_1_name: alumni.College_1_Name,
    college_1_degree: alumni.College_1_Degree,
    college_1_logo: alumni.College_1_Logo,
    college_2_name: alumni.College_2_Name,
    college_2_degree: alumni.College_2_Degree,
    college_2_logo: alumni.College_2_Logo,
    college_3_name: alumni.College_3_Name,
    college_3_degree: alumni.College_3_Degree,
    college_3_logo: alumni.College_3_Logo,
    experience_1_company: alumni.Experience_1_Company,
    experience_1_role: alumni.Experience_1_Role,
    experience_1_logo: alumni.Experience_1_Logo,
    experience_2_company: alumni.Experience_2_Company,
    experience_2_role: alumni.Experience_2_Role,
    experience_2_logo: alumni.Experience_2_Logo,
    experience_3_company: alumni.Experience_3_Company,
    experience_3_role: alumni.Experience_3_Role,
    experience_3_logo: alumni.Experience_3_Logo,
    experience_4_company: alumni.Experience_4_Company,
    experience_4_role: alumni.Experience_4_Role,
    experience_4_logo: alumni.Experience_4_Logo,
    linkedin_url: alumni.linkedinUrl,
    experiences,
    education
  }
}

export function generateProfilePicture(name: string): string {
  // Generate initials for profile picture placeholder
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
  
  // Create a data URL for a simple avatar with initials
  const canvas = document.createElement('canvas')
  canvas.width = 150
  canvas.height = 150
  const ctx = canvas.getContext('2d')!
  
  // Background color based on name hash
  const colors = ['#0077B5', '#004182', '#0066CC', '#0052CC', '#003366']
  const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
  ctx.fillStyle = colors[colorIndex]
  ctx.fillRect(0, 0, 150, 150)
  
  // White text
  ctx.fillStyle = 'white'
  ctx.font = 'bold 48px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(initials, 75, 75)
  
  return canvas.toDataURL()
}

export function generateBio(profile: ParsedAlumniProfile): string {
  const primaryRole = profile.experiences[0]?.role || 'Professional'
  const primaryCompany = profile.experiences[0]?.company || 'Company'
  const primaryDegree = profile.education[0]?.degree || 'Degree'
  const primarySchool = profile.education[0]?.school || 'School'
  
  return `${primaryRole} at ${primaryCompany} in ${profile.location}. Studied ${primaryDegree} at ${primarySchool}`
}
