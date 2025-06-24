import { google } from 'googleapis';
import { CALENDAR_CONFIG } from './constants';

export interface CalendarEvent {
  summary: string;
  start: Date;
  end: Date;
  description?: string;
}

async function getAuthClient() {
  const auth = new google.auth.GoogleAuth({
    scopes: CALENDAR_CONFIG.SCOPES,
  });
  return auth;
}

export async function fetchCalendarEvents(): Promise<CalendarEvent[]> {
  try {
    console.log(`[${new Date().toISOString()}] Fetching Google Calendar events...`);
    
    const authClient = await getAuthClient();
    const calendar = google.calendar({ version: 'v3', auth: authClient });

    // Get events from primary calendar for the configured time range
    const now = new Date();
    const futureDate = new Date();
    futureDate.setMonth(now.getMonth() + CALENDAR_CONFIG.FUTURE_MONTHS);

    const events = await calendar.events.list({
      calendarId: CALENDAR_CONFIG.PRIMARY_CALENDAR_ID,
      timeMin: now.toISOString(),
      timeMax: futureDate.toISOString(),
      maxResults: CALENDAR_CONFIG.MAX_EVENTS,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const calendarEvents: CalendarEvent[] = [];
    for (const event of events.data.items || []) {
      if (event.start && event.end) {
        const startDate = event.start.dateTime ? new Date(event.start.dateTime) : new Date(event.start.date!);
        const endDate = event.end.dateTime ? new Date(event.end.dateTime) : new Date(event.end.date!);
        
        calendarEvents.push({
          summary: CALENDAR_CONFIG.EVENT_SUMMARY,
          start: startDate,
          end: endDate,
          description: CALENDAR_CONFIG.EVENT_DESCRIPTION
        });
      }
    }

    console.log(`[${new Date().toISOString()}] ✅ Fetched ${calendarEvents.length} events`);
    return calendarEvents;

  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Error fetching calendar:`, error);
    throw error;
  }
}