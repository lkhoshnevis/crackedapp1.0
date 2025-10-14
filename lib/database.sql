-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create alumni_profiles table
CREATE TABLE alumni_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    profile_picture_url TEXT,
    high_school TEXT,
    dvhs_class_of TEXT,
    college_1_name TEXT,
    college_1_degree TEXT,
    college_1_logo TEXT,
    college_2_name TEXT,
    college_2_degree TEXT,
    college_2_logo TEXT,
    college_3_name TEXT,
    college_3_degree TEXT,
    college_3_logo TEXT,
    experience_1_company TEXT,
    experience_1_role TEXT,
    experience_1_logo TEXT,
    experience_2_company TEXT,
    experience_2_role TEXT,
    experience_2_logo TEXT,
    experience_3_company TEXT,
    experience_3_role TEXT,
    experience_3_logo TEXT,
    experience_4_company TEXT,
    experience_4_role TEXT,
    experience_4_logo TEXT,
    linkedin_url TEXT,
    elo INTEGER DEFAULT 2000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create experiences table
CREATE TABLE experiences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    alumni_id UUID REFERENCES alumni_profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    company_logo TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create education table
CREATE TABLE education (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    alumni_id UUID REFERENCES alumni_profiles(id) ON DELETE CASCADE,
    school TEXT NOT NULL,
    degree TEXT NOT NULL,
    school_logo TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vote_sessions table
CREATE TABLE vote_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    alumni_1_id UUID REFERENCES alumni_profiles(id),
    alumni_2_id UUID REFERENCES alumni_profiles(id),
    winner_id UUID REFERENCES alumni_profiles(id),
    voted_equal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create elo_history table
CREATE TABLE elo_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    alumni_id UUID REFERENCES alumni_profiles(id) ON DELETE CASCADE,
    old_elo INTEGER NOT NULL,
    new_elo INTEGER NOT NULL,
    change_amount INTEGER NOT NULL,
    vote_session_id UUID REFERENCES vote_sessions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create search analytics table
CREATE TABLE search_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    search_query TEXT NOT NULL,
    results_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_alumni_elo ON alumni_profiles(elo DESC);
CREATE INDEX idx_alumni_name ON alumni_profiles(name);
CREATE INDEX idx_experiences_alumni ON experiences(alumni_id);
CREATE INDEX idx_education_alumni ON education(alumni_id);
CREATE INDEX idx_vote_sessions_session ON vote_sessions(session_id);
CREATE INDEX idx_elo_history_alumni ON elo_history(alumni_id);
CREATE INDEX idx_elo_history_created ON elo_history(created_at);

-- Enable Row Level Security
ALTER TABLE alumni_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE vote_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE elo_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for alumni_profiles" ON alumni_profiles FOR SELECT USING (true);
CREATE POLICY "Public read access for experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "Public read access for education" ON education FOR SELECT USING (true);
CREATE POLICY "Public read access for vote_sessions" ON vote_sessions FOR SELECT USING (true);
CREATE POLICY "Public read access for elo_history" ON elo_history FOR SELECT USING (true);

-- Create policies for public write access
CREATE POLICY "Public insert access for vote_sessions" ON vote_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access for elo_history" ON elo_history FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access for search_analytics" ON search_analytics FOR INSERT WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for alumni_profiles
CREATE TRIGGER update_alumni_profiles_updated_at BEFORE UPDATE ON alumni_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
