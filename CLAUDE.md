# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Production build (fetches Google Calendar data and generates static assets)
- `pnpm preview` - Preview the built application
- `pnpm serve` - Start preview server and auto-open in browser

**Build Process**: The build command runs a custom Vite plugin that fetches Google Calendar data and generates both `events.json` and `availability.ics` files. Development mode uses cached data to avoid unnecessary API calls.

## Architecture Overview

This is a **Build-Time Data Processing** React application that integrates with Google Calendar API in a privacy-conscious manner.

### Key Architectural Pattern

- **Build-time Processing**: Google Calendar data is fetched during build (not at runtime)
- **Privacy-First**: All event details are anonymized as "予定あり" (Busy) to protect privacy
- **Static Asset Generation**: Calendar data is pre-processed into static JSON files
- **Multi-format Output**: Generates both web interface and iCalendar (.ics) export

### Tech Stack

- React 19.1.0 + TypeScript + Vite 6.3.5
- Tailwind CSS 4.1.10 for styling
- googleapis 126.0.1 for Google Calendar API
- Custom Vite plugin for build-time calendar integration

## Data Flow

### Build-time Flow

```
Google Calendar API → calendar-fetch.ts → vite-plugin-gcal.ts → {events.json, availability.ics}
```

### Runtime Flow

```
/events.json → App.tsx → {WeeklyView, DailyView, StatsCard}
```

## Core Components

### Build System

- **`src/vite-plugin-gcal.ts`**: Custom Vite plugin that orchestrates Google Calendar integration during build
- **`src/calendar-fetch.ts`**: Handles Google Calendar API calls, authentication, and data anonymization

### Frontend Components

- **`src/App.tsx`**: Main application with view switching (Weekly/Daily) and state management
- **`src/components/WeeklyView.tsx`**: 7-day calendar grid with time slots (10 AM - 6 PM)
- **`src/components/DailyView.tsx`**: Single day detailed view with hourly breakdown
- **`src/components/StatsCard.tsx`**: Analytics dashboard showing schedule statistics

### Configuration

- **`src/constants.ts`**: Contains `CALENDAR_CONFIG` with calendar name, timezone (Asia/Tokyo), and anonymization settings
- **`src/types.ts`**: TypeScript type definitions for calendar events and application state

## Important Implementation Details

### Google Calendar Integration

- Uses Application Default Credentials for authentication
- Configured for "なありしごと" calendar in Asia/Tokyo timezone
- Fetches 1 month ahead with 2500 event limit
- All events are anonymized for privacy protection

### Development vs Production

- **Development**: Uses cached calendar data to avoid API rate limits
- **Production**: Fresh API calls during each build to generate updated static assets

### View Navigation

- Week navigation starts from the first week containing events (not current week)
- Daily view focuses on today's schedule with chronological event ordering
- Statistics provide comprehensive analytics including total hours and weekly averages

## File Structure Notes

The application follows a clean separation between build-time processing (`calendar-fetch.ts`, `vite-plugin-gcal.ts`) and runtime components (`App.tsx`, `components/`). The custom Vite plugin extends the build process to handle Google Calendar integration seamlessly.

## Development Tools

- Use Playweight MCP to check your code modifications