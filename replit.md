# DVHS Alumni Ranking

## Overview
A Next.js application for ranking DVHS alumni profiles using an ELO rating system. Users can vote between randomly selected alumni profiles to determine who's more "cracked", with live rankings updated in real-time.

## Recent Changes
**October 16, 2025** - Custom Scrollbar for Leaderboard
- Added visible, draggable scrollbar to leaderboard and search results
- Fixed max-height of 600px for the results list with overflow scrolling
- Custom blue gradient scrollbar design matching the app theme
- Easy to grab and drag for better navigation through long lists
- Works on both desktop and mobile devices

**October 16, 2025** - Bright Blue Gradient Background
- Enhanced animated wave background with vibrant blue gradient
- Gradient flows from dark blue → medium blue → sky blue
- Increased line opacity from 0.15-0.4 to 0.6-0.8 for better visibility
- Creates a modern, energetic visual effect while maintaining elegance

**October 16, 2025** - iOS Mobile Scrolling Fix (Final)
- **Fixed critical iOS scrolling bug** preventing users from scrolling on iPhone
- Root cause: LiquidGlassCard's absolute glass overlay layers were intercepting touch events on iOS Safari before they reached the scrollable container
- Solution implemented:
  - Added `pointer-events-none` to both absolute glass overlay layers in LiquidGlassCard component
  - Added `pointer-events-none` to both glass overlay layers in LiquidGlassInput component (SearchBar was blocking touches after page load)
  - Added `-webkit-overflow-scrolling: touch` to leaderboard scrollable container for iOS momentum scrolling
  - Added `overscroll-behavior: contain` to prevent scroll chaining issues
  - Simplified root layout to use natural body scrolling instead of complex absolute positioning
  - Kept `pointer-events-none` on Waves background to prevent touch event blocking
- **Result**: Users can now scroll leaderboard lists, search results, and all content on iPhone

**October 15, 2025** - Cool Loader & Initial Mobile Scrolling Attempts
- Created custom triple-ring orbital loader with gradient animations (blue→purple→pink)
- Replaced all basic spinners with cool loader across vote, leaderboard, and search pages
- Attempted multiple mobile scrolling fixes (complex positioning, touch overlays)
- Note: Final fix required removing overflow-hidden from UI components (see October 16 update)

**October 15, 2025** - Premium Black & Gradient Design Update
- Changed background from beige to pure black (#000000) for modern, premium look
- Implemented dynamic gradient wave lines transitioning from blue → purple → pink
- Updated all text colors to white/light shades for optimal contrast on black background
- Rounded all button edges (rounded-full) for softer, more modern appearance
- Applied liquid glass frosted effect to all UI components with enhanced shadow depth
- Changed main site font to Outfit (modern, geometric sans-serif similar to Audit Sans)
- Made vote profile cards highly transparent with blur effect for elegant presentation
- Changed all button text from blue to white for better readability
- Integrated DVHS school crest logo and DV logo into homescreen branding

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
  - Main font: Outfit (modern, geometric sans-serif similar to Audit Sans)
  - Vote profile font: Inter (clean, readable for profile data)
  - All text in white/light colors for maximum contrast
- **Interactive Elements**: Fully rounded buttons and inputs with smooth transitions
- **Vote Cards**: Ultra-transparent with 3% white background and medium blur for elegant presentation
- **Branding**: DVHS logo displayed on homescreen with 80% opacity for subtle integration
- **Loading States**: Custom triple-ring orbital loader with counter-rotating animations and gradient colors
- **Mobile Optimization**: Smooth touch scrolling with proper overflow handling for all devices

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
