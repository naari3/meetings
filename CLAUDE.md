# gcal-sync Project Analysis Report

## Project Overview
- **Name**: gcal-sync  
- **Description**: Google Calendar Integration Web Application
- **Tech Stack**: React + TypeScript + Vite + Tailwind CSS
- **Purpose**: Fetch Google Calendar events and display them as a web calendar

## Architecture

### Frontend
- **React 19.1.0** (Latest version)
- **TypeScript** (Type safety)
- **Tailwind CSS 4.1.10** (Styling)
- **Vite 6.3.5** (Build tool)

### Backend/API
- **Google APIs** (googleapis 126.0.1)
- **Vite Plugin** (Custom build-time processing)
- **iCal Generation** (ical-generator 9.0.0)

## Component Structure

### Main Components
1. **App.tsx** - Main application
   - 3 view mode switching (`monthly`/`weekly`/`daily`)
   - Event data management
   - Loading state management

2. **StatsCard.tsx** - Statistics dashboard
   - Total events, total hours, today's events, etc.
   - Detailed statistics display

3. **CalendarGrid.tsx** - Monthly calendar view
   - 6-week grid display
   - Event display functionality

4. **WeeklyView.tsx** - Weekly calendar view
   - 7-day time slot display
   - Current time line display

5. **DailyView.tsx** - Daily calendar view
   - Single day time slot display
   - Hourly event placement

## Data Flow

### Build-time Processing
1. **vite-plugin-gcal.ts** calls Google Calendar API
2. `calendar-fetch.ts` fetches events
3. Generates `events.json` and `availability.ics` files
4. Serves as `public/events.json`

### Runtime Processing
1. Frontend fetches `/events.json`
2. Managed by React state
3. Rendered by each view component

## Configuration & Constants

### CALENDAR_CONFIG (constants.ts)
- **CALENDAR_NAME**: "なありしごと"
- **TIMEZONE**: "Asia/Tokyo"
- **FUTURE_MONTHS**: 1 month ahead
- **MAX_EVENTS**: 2500 events limit

## Features & Functionality

### Display Features
- **3 View Modes**: Monthly/Weekly/Daily
- **Responsive Design**: Mobile compatible
- **Real-time Display**: Current time line
- **Statistics Dashboard**: Detailed schedule analysis

### Data Processing
- **Privacy Protection**: Anonymizes actual event details as "予定あり"
- **iCal Export**: External calendar application integration
- **Cache Functionality**: Avoids unnecessary API calls during development

## Technical Features

### Modern Technology Adoption
- React 19 latest features
- TypeScript strict mode
- ES2020 target
- Tailwind CSS v4

### Performance
- Fast builds with Vite
- Optimized bundles
- Efficient rendering

## Security
- Google OAuth authentication
- API key management
- Private information anonymization

## Development Commands
- `pnpm dev` - Start development server
- `pnpm build` - Production build
- `pnpm preview` - Preview server
- `pnpm serve` - Post-build preview (auto-open browser)

This project is a Google Calendar integration application utilizing modern web technologies, featuring excellent design and usability.