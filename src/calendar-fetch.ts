import { google } from "googleapis";
import { CALENDAR_CONFIG } from "./constants";

export interface CalendarEvent {
  summary: string;
  start: Date;
  end: Date;
  description?: string;
}

async function getAuthClient() {
  const authOptions: any = {
    scopes: CALENDAR_CONFIG.SCOPES,
  };

  // サービスアカウントキーファイルがある場合は使用
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    authOptions.keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  }
  // OAuth2クライアント認証情報がある場合
  else if (
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REFRESH_TOKEN
  ) {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      "urn:ietf:wg:oauth:2.0:oob"
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    return oauth2Client;
  }
  // デフォルトはADC

  const auth = new google.auth.GoogleAuth(authOptions);
  return auth;
}

export async function fetchCalendarEvents(): Promise<CalendarEvent[]> {
  try {
    console.log(
      `[${new Date().toISOString()}] Fetching Google Calendar events...`
    );

    const authClient = await getAuthClient();
    const calendar = google.calendar({ version: "v3", auth: authClient });

    // Get events from primary calendar for the configured time range
    const now = new Date();
    const pastDate = new Date();
    pastDate.setDate(now.getDate() - 28); // 4週間前
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + 28); // 4週間後

    const calendarEvents: CalendarEvent[] = [];

    // Combine PUBLIC_GOOGLE_CALENDAR_IDS and GOOGLE_CALENDAR_IDS
    const allCalendarIds = [
      ...CALENDAR_CONFIG.PUBLIC_GOOGLE_CALENDAR_IDS,
      ...CALENDAR_CONFIG.CALENDAR_IDS,
    ];
    console.log(allCalendarIds);

    // Fetch events from all calendar IDs
    for (const calendarId of allCalendarIds) {
      console.log(
        `[${new Date().toISOString()}] Fetching from calendar: ${calendarId}`
      );

      const events = await calendar.events.list({
        calendarId: calendarId,
        timeMin: pastDate.toISOString(),
        timeMax: futureDate.toISOString(),
        maxResults: CALENDAR_CONFIG.MAX_EVENTS,
        singleEvents: true,
        orderBy: "startTime",
      });

      for (const event of events.data.items || []) {
        if (event.start && event.end) {
          // Apply filtering before anonymization
          if (event.summary && (event.summary.includes("休み：") || event.summary.includes("自宅"))) {
            continue; // Skip this event
          }

          const startDate = event.start.dateTime
            ? new Date(event.start.dateTime)
            : new Date(event.start.date!);
          const endDate = event.end.dateTime
            ? new Date(event.end.dateTime)
            : new Date(event.end.date!);

          // Check if this calendar should be anonymized
          const isPublic =
            CALENDAR_CONFIG.PUBLIC_GOOGLE_CALENDAR_IDS.includes(calendarId);

          calendarEvents.push({
            summary:
              isPublic && event.summary
                ? event.summary
                : CALENDAR_CONFIG.EVENT_SUMMARY,
            start: startDate,
            end: endDate,
            description: isPublic
              ? event.description || ""
              : CALENDAR_CONFIG.EVENT_DESCRIPTION,
          });
        }
      }
    }

    console.log(
      `[${new Date().toISOString()}] ✅ Fetched ${calendarEvents.length} events`
    );
    return calendarEvents;
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] ❌ Error fetching calendar:`,
      error
    );
    throw error;
  }
}
