# DVHS Alumni Ranking

## Overview
A Next.js application for ranking DVHS alumni profiles using an ELO rating system. Users can vote between randomly selected alumni profiles to determine who's more "cracked", with live rankings updated in real-time.

## Recent Changes
**October 15, 2025** - Complete UI Design Overhaul
- Implemented modern dark theme (#060606 background) with animated components
- Added three new UI components:
  - `squares-background`: Animated grid background with moving squares
  - `hover-border-gradient`: Gradient border buttons with hover animations
  - `tubelight-navbar`: Glowing navigation bar with animated gradient effects
- Added DVHS Wildcats logo to home page
- Updated all pages (home, leaderboard, vote, admin) with consistent dark theme
- Removed admin navigation link (admin page accessible only via /admin URL)
- Installed framer-motion for animations and created cn() utility for className merging

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

### Directory Structure
- `/app` - Next.js App Router pages
  - `/admin` - Admin panel (accessible via /admin URL only)
  - `/leaderboard` - Rankings display
  - `/vote` - Voting interface
- `/components` - React components
  - `/ui` - UI components (squares-background, hover-border-gradient, tubelight-navbar)
  - `ClientNav.tsx` - Client-side navigation wrapper
- `/hooks` - Custom React hooks
- `/lib` - Utility functions and API logic
  - Database operations
  - ELO calculations
  - CSV parsing
  - Supabase client
  - `utils.ts` - Utility functions (cn for className merging)
- `/public` - Static assets
  - `dvhs-logo.png` - DVHS Wildcats logo

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
