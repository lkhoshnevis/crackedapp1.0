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
- **Deployment**: Vercel
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/lkhoshnevis/crackedapp1.0.git
cd crackedapp1.0
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Configure your Supabase credentials in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Set up the database:
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor
   - Run the SQL commands from `lib/database.sql`

6. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Usage

### For Users
1. **Vote**: Go to the Vote page to see two random alumni profiles
2. **Search**: Use the search bar on the home page to find specific alumni
3. **Leaderboard**: Check the leaderboard to see current ELO rankings

### For Admins
1. **Upload Data**: Use the admin panel to upload CSV files with alumni data
2. **Analytics**: View voting statistics and user engagement metrics
3. **Manage Profiles**: Update or add new alumni profiles

## CSV Format

Your CSV should include these columns:
- `Profile_Name`: Full name of the alumni
- `addressWithoutCountry`: Location
- `Profile_Picture_URL`: LinkedIn profile picture URL
- `High School`: High school name
- `DVHS class of`: Graduation year
- `College_1_Name`, `College_1_Degree`, `College_1_Logo`: Primary college info
- `Experience_1_Company`, `Experience_1_Role`, `Experience_1_Logo`: Primary work experience
- `linkedinUrl`: LinkedIn profile URL (optional but recommended)
- Additional college/experience columns (2, 3, 4) as available

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy automatically on every push to main

### Manual Deployment

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or issues, please open a GitHub issue or contact the development team.