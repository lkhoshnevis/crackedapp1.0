import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface AlumniProfile {
  id: string
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
  elo: number
  experiences: Experience[]
  education: Education[]
  created_at: string
  updated_at: string
}

export interface Experience {
  id: string
  alumni_id: string
  role: string
  company: string
  company_logo?: string
  order: number
}

export interface Education {
  id: string
  alumni_id: string
  school: string
  degree: string
  school_logo?: string
  order: number
}

export interface VoteSession {
  id: string
  session_id: string
  alumni_1_id: string
  alumni_2_id: string
  winner_id?: string
  voted_equal: boolean
  created_at: string
}

export interface EloHistory {
  id: string
  alumni_id: string
  old_elo: number
  new_elo: number
  change: number
  vote_session_id: string
  created_at: string
}
