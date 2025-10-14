# DVHS Alumni Ranking

A gamified website that connects Dougherty Valley High School alumni through competitive voting and ELO-based rankings. Users can vote between randomly paired alumni profiles to determine who's "more cracked" and see live leaderboard updates.

## Features

- **Voting System**: Vote between two randomly selected DVHS alumni profiles
- **ELO Rankings**: Real-time ELO rating system with live updates
- **Search**: Find specific alumni by name, company, school, or role
- **Leaderboard**: Live rankings with daily change indicators
- **Real-time Updates**: Supabase subscriptions for live data synchronization
- **Admin Panel**: CSV upload, analytics, and profile management
- **LinkedIn-style UI**: Professional design matching LinkedIn's interface

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Real-time subscriptions)
- **Data Processing**: Papa Parse for CSV handling
- **Search**: Fuse.js for fuzzy search
- **Deployment**: Vercel-ready

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd /Users/leonkhoshnevis/Crackedapp-1.0
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `lib/database.sql` in your Supabase SQL editor
3. Copy your project URL and anon key

### 3. Environment Configuration

Create a `.env.local` file:

```bash
cp env.example .env.local
```

Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://gwvsuxjoxmsppmzdqaep.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3dnN1eGpveG1zcHBtemRxYWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzOTE4ODIsImV4cCI6MjA3NTk2Nzg4Mn0.1VVXomMm1P66XWKaKiLxPaTtlLQq4ULkKs8T3mLphPo
```

### 4. Upload Initial Data

1. Prepare a CSV file with alumni data in this format:
   ```csv
   name,location,college,degree,role,company,linkedin profile url
   John Doe,San Francisco,Stanford University,Computer Science,Software Engineer,Google,https://linkedin.com/in/johndoe
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Navigate to `/admin` and upload your CSV file

### 5. Deploy to Vercel

```bash
npm run build
vercel --prod
```

## Database Schema

The application uses the following main tables:

- **alumni_profiles**: Core alumni information and ELO ratings
- **experiences**: Work experience records
- **education**: Education records
- **vote_sessions**: Voting session tracking
- **elo_history**: ELO change history for analytics
- **search_analytics**: Search query tracking

## API Endpoints

- **GET /api/profiles**: Get alumni profiles with search
- **POST /api/vote**: Submit a vote and update ELO ratings
- **GET /api/leaderboard**: Get current leaderboard
- **POST /api/admin/upload**: Upload CSV data (admin only)

## Real-time Features

- Live ELO updates across all connected users
- Real-time leaderboard changes
- Live vote notifications
- Real-time search results

## Admin Features

- CSV data upload and processing
- Profile management and ELO adjustment
- Vote analytics and session tracking
- Real-time statistics dashboard

## Performance Optimizations

- Server-side rendering for initial page loads
- Optimistic UI updates for voting
- Efficient database queries with proper indexing
- Real-time subscriptions for live updates
- Image optimization for profile pictures

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues, please open a GitHub issue or contact the development team.

