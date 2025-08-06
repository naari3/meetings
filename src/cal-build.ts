#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import ical from "ical-generator";
import { fetchCalendarEvents } from "./calendar-fetch";
import { CALENDAR_CONFIG } from "./constants";

async function buildCalendarResources() {
	console.log("🔄 Fetching Google Calendar events...");

	try {
		// Fetch events from Google Calendar
		const events = await fetchCalendarEvents();

		// Create directories if they don't exist
		await mkdir("public", { recursive: true });
		await mkdir("dist", { recursive: true });

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

		// Write ICS file
		const icsPath = join("dist", "naari3-meetings.ics");
		await writeFile(icsPath, calendar.toString());

		// Generate events.json for the web app
		const eventsData = {
			events: events.map((event) => ({
				summary: event.summary,
				start: event.start.toISOString(),
				end: event.end.toISOString(),
				description: event.description,
			})),
			generatedAt: new Date().toISOString(),
		};

		// Write events.json file
		const eventsPath = join("public", "events.json");
		await writeFile(eventsPath, JSON.stringify(eventsData, null, 2));

		console.log(
			`✅ Generated ICS and prepared ${events.length} events for web app`,
		);
		console.log(`📝 Files created:`);
		console.log(`   - ${icsPath}`);
		console.log(`   - ${eventsPath}`);
	} catch (error) {
		console.error("❌ Failed to fetch calendar events:", error);
		process.exit(1);
	}
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
	buildCalendarResources();
}

export { buildCalendarResources };
