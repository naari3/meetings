import type { Plugin } from 'vite';
import { fetchCalendarEvents } from './calendar-fetch';
import { CALENDAR_CONFIG } from './constants';
import ical from 'ical-generator';

export function gcalPlugin(): Plugin {
  return {
    name: 'vite-plugin-gcal',
    
    async buildStart() {
      console.log('🔄 Fetching Google Calendar events...');
      
      try {
        // Fetch events from Google Calendar
        const events = await fetchCalendarEvents();
        
        // Generate ICS content
        const calendar = ical({
          name: CALENDAR_CONFIG.CALENDAR_NAME,
          description: CALENDAR_CONFIG.CALENDAR_DESCRIPTION,
          timezone: CALENDAR_CONFIG.TIMEZONE,
          ttl: CALENDAR_CONFIG.TTL_HOURS * 3600, // Convert hours to seconds
        });

        for (const event of events) {
          calendar.createEvent({
            start: event.start,
            end: event.end,
            summary: event.summary,
            description: event.description,
          });
        }
        
        // Emit ICS as asset
        this.emitFile({
          type: 'asset',
          fileName: 'availability.ics',
          source: calendar.toString()
        });
        
        // Generate events.json for the web app
        const eventsData = {
          events: events.map(event => ({
            summary: event.summary,
            start: event.start.toISOString(),
            end: event.end.toISOString(),
            description: event.description
          })),
          generatedAt: new Date().toISOString()
        };
        
        // Emit events.json as asset
        this.emitFile({
          type: 'asset',
          fileName: 'events.json',
          source: JSON.stringify(eventsData, null, 2)
        });
        
        console.log(`✅ Generated ICS and prepared ${events.length} events for web app`);
        
      } catch (error) {
        console.error('❌ Failed to fetch calendar events:', error);
        this.error('Google Calendar sync failed');
      }
    }
  };
}