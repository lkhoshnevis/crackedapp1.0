export interface AlumniData {
  Profile_Name: string
  addressWithoutCountry: string
  Profile_Picture_URL: string
  High_School: string
  DVHS_class_of: string
  College_1_Name: string
  College_1_Degree: string
  College_1_Logo: string
  College_2_Name: string
  College_2_Degree: string
  College_2_Logo: string
  College_3_Name: string
  College_3_Degree: string
  College_3_Logo: string
  Experience_1_Company: string
  Experience_1_Role: string
  Experience_1_Logo: string
  Experience_2_Company: string
  Experience_2_Role: string
  Experience_2_Logo: string
  Experience_3_Company: string
  Experience_3_Role: string
  Experience_3_Logo: string
  Experience_4_Company: string
  Experience_4_Role: string
  Experience_4_Logo: string
  linkedinUrl: string
}

export interface ParsedAlumniProfile {
  name: string
  location: string
  profile_picture_url?: string
  high_school?: string
  dvhs_class_of?: string
  college_1_name?: string
  college_1_degree?: string
  college_1_logo?: string
  college_2_name?: string
  college_2_degree?: string
  college_2_logo?: string
  college_3_name?: string
  college_3_degree?: string
  college_3_logo?: string
  experience_1_company?: string
  experience_1_role?: string
  experience_1_logo?: string
  experience_2_company?: string
  experience_2_role?: string
  experience_2_logo?: string
  experience_3_company?: string
  experience_3_role?: string
  experience_3_logo?: string
  experience_4_company?: string
  experience_4_role?: string
  experience_4_logo?: string
  linkedin_url?: string
  experiences: {
    role: string
    company: string
    logo?: string
  }[]
  education: {
    school: string
    degree: string
    logo?: string
  }[]
}

export interface VoteResult {
  winner?: string
  equal: boolean
  sessionId: string
}

export interface LeaderboardEntry {
  rank: number
  id: string
  name: string
  elo: number
  change: number
  profile_picture_url?: string
  linkedin_url?: string
}
