export interface CalendarEvent {
	summary: string;
	start: string; // ISO date string
	end: string; // ISO date string
	description?: string;
}
