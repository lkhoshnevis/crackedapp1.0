# DVHS Alumni Ranking

## Overview
A Next.js application for ranking DVHS alumni profiles using an ELO rating system. Users can vote between randomly selected alumni profiles to determine who's more "cracked", with live rankings updated in real-time.

## Recent Changes
**October 15, 2025** - Premium Black & Gradient Design Update
- Changed background from beige to pure black (#000000) for modern, premium look
- Implemented dynamic gradient wave lines transitioning from blue → purple → pink
- Updated all text colors to white/light shades for optimal contrast on black background
- Rounded all button edges (rounded-full) for softer, more modern appearance
- Applied liquid glass frosted effect to all UI components with enhanced shadow depth
- Changed main site font to Space Grotesk for modern typography (vote profiles keep Inter)
- Made vote profile cards highly transparent with blur effect for elegant presentation
- Changed all button text from blue to white for better readability
- Increased navigation button rounding for sleeker appearance

**October 14, 2025** - Migrated from Vercel to Replit
- Configured Next.js to run on port 5000 with host 0.0.0.0 for Replit compatibility
- Set up Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY)
- Configured development workflow to run Next.js dev server
- Set up deployment configuration for production (autoscale)

## Project Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Package Manager**: npm

### Key Features
- ELO-based ranking system for alumni profiles
- Real-time updates using Supabase subscriptions
- Alumni search functionality using Fuse.js
- Admin panel for data management
- CSV import for bulk alumni data

### Design System
- **Color Scheme**: Black background (#000000) with gradient accents
- **Gradient Flow**: Blue (#3B82F6) → Purple (#A855F7) → Pink (#EC4899)
- **UI Components**: Liquid glass/frosted glass aesthetic with backdrop blur effects
- **Typography**: 
  - Main font: Space Grotesk (modern, geometric sans-serif)
  - Vote profile font: Inter (clean, readable for profile data)
  - All text in white/light colors for maximum contrast
- **Interactive Elements**: Fully rounded buttons and inputs with smooth transitions
- **Vote Cards**: Transparent with 5% white background and medium blur for elegant presentation

### Directory Structure
- `/app` - Next.js App Router pages
  - `/admin` - Admin panel
  - `/leaderboard` - Rankings display
  - `/vote` - Voting interface
- `/components` - React components
- `/hooks` - Custom React hooks
- `/lib` - Utility functions and API logic
  - Database operations
  - ELO calculations
  - CSV parsing
  - Supabase client

## Environment Configuration
The application requires three Supabase environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public API key
- `SUPABASE_SERVICE_ROLE_KEY` - Admin API key (server-side only)

## Development
- **Dev Server**: Runs on port 5000 with `npm run dev`
- **Build**: `npm run build`
- **Production**: `npm run start` (port 5000)

## Deployment
Configured for Replit autoscale deployment:
- Build command: `npm run build`
- Start command: `npm run start`
