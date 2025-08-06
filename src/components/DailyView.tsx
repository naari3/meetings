import { useCurrentTime } from "../hooks/useCurrentTime";
import type { CalendarEvent } from "../types";
import Button from "./Button";
import ViewToggle from "./ViewToggle";

interface DailyViewProps {
	events: CalendarEvent[];
	currentDayOffset: number;
	setCurrentDayOffset: (callback: (prev: number) => number) => void;
	view: "weekly" | "daily";
	setView: (view: "weekly" | "daily") => void;
}

export default function DailyView({
	events,
	currentDayOffset,
	setCurrentDayOffset,
	view,
	setView,
}: DailyViewProps) {
	const baseDate = new Date();
	const currentDate = new Date(baseDate);
	currentDate.setDate(baseDate.getDate() + currentDayOffset);
	const { currentHour, currentMinutes } = useCurrentTime();

	const isAllDayEvent = (event: CalendarEvent) => {
		const start = new Date(event.start);
		const end = new Date(event.end);

		// Check if times are at midnight (00:00) in UTC
		const startUTCHours = start.getUTCHours();
		const startUTCMinutes = start.getUTCMinutes();
		const startUTCSeconds = start.getUTCSeconds();
		const endUTCHours = end.getUTCHours();
		const endUTCMinutes = end.getUTCMinutes();
		const endUTCSeconds = end.getUTCSeconds();

		// Event is all-day if both start and end are at midnight UTC
		return (
			startUTCHours === 0 &&
			startUTCMinutes === 0 &&
			startUTCSeconds === 0 &&
			endUTCHours === 0 &&
			endUTCMinutes === 0 &&
			endUTCSeconds === 0
		);
	};

	const getEventsForToday = () => {
		return events.filter((event) => {
			const eventStart = new Date(event.start);
			const eventEnd = new Date(event.end);

			// For all-day events, the end date is exclusive (Google Calendar convention)
			if (isAllDayEvent(event)) {
				// Use local date strings for comparison to avoid timezone issues
				const year = currentDate.getFullYear();
				const month = String(currentDate.getMonth() + 1).padStart(2, "0");
				const day = String(currentDate.getDate()).padStart(2, "0");
				const dateStr = `${year}-${month}-${day}`;

				const startStr = eventStart.toISOString().split("T")[0];
				const endStr = eventEnd.toISOString().split("T")[0];

				// Check if date is between start (inclusive) and end (exclusive)
				return dateStr >= startStr && dateStr < endStr;
			} else {
				// For timed events, use the original logic
				const eventDate = new Date(event.start);
				return eventDate.toDateString() === currentDate.toDateString();
			}
		});
	};

	const allEvents = getEventsForToday();
	const allDayEvents = allEvents.filter(isAllDayEvent);
	const timedEvents = allEvents
		.filter((event) => !isAllDayEvent(event))
		.sort((a, b) => {
			const aStart = new Date(a.start).getTime();
			const bStart = new Date(b.start).getTime();
			if (aStart !== bStart) return aStart - bStart;
			// If start times are equal, sort by end time
			return new Date(a.end).getTime() - new Date(b.end).getTime();
		});
	const timeSlots = Array.from({ length: 13 }, (_, i) => i + 10); // 10AM to 10PM

	const getEventColor = (index: number) => {
		const colors = [
			{
				bg: "bg-purple-50",
				border: "border-purple-600",
				text: "text-purple-600",
			},
			{ bg: "bg-green-50", border: "border-green-600", text: "text-green-600" },
			{ bg: "bg-blue-50", border: "border-blue-600", text: "text-blue-600" },
			{
				bg: "bg-yellow-50",
				border: "border-yellow-600",
				text: "text-yellow-600",
			},
		];
		return colors[index % colors.length];
	};

	return (
		<section className="relative bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 py-8">
			<div className="w-full max-w-7xl mx-auto px-6 lg:px-8 overflow-x-auto">
				<div className="flex flex-col md:flex-row max-md:gap-3 items-center justify-between mb-5">
					<div className="flex items-center gap-4">
						<svg
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
						>
							<path
								d="M17 4.50001L17 5.15001L17 4.50001ZM6.99999 4.50002L6.99999 3.85002L6.99999 4.50002ZM8.05078 14.65C8.40977 14.65 8.70078 14.359 8.70078 14C8.70078 13.641 8.40977 13.35 8.05078 13.35V14.65ZM8.00078 13.35C7.6418 13.35 7.35078 13.641 7.35078 14C7.35078 14.359 7.6418 14.65 8.00078 14.65V13.35ZM8.05078 17.65C8.40977 17.65 8.70078 17.359 8.70078 17C8.70078 16.641 8.40977 16.35 8.05078 16.35V17.65ZM8.00078 16.35C7.6418 16.35 7.35078 16.641 7.35078 17C7.35078 17.359 7.6418 17.65 8.00078 17.65V16.35ZM12.0508 14.65C12.4098 14.65 12.7008 14.359 12.7008 14C12.7008 13.641 12.4098 13.35 12.0508 13.35V14.65ZM12.0008 13.35C11.6418 13.35 11.3508 13.641 11.3508 14C11.3508 14.359 11.6418 14.65 12.0008 14.65V13.35ZM12.0508 17.65C12.4098 17.65 12.7008 17.359 12.7008 17C12.7008 16.641 12.4098 16.35 12.0508 16.35V17.65ZM12.0008 16.35C11.6418 16.35 11.3508 16.641 11.3508 17C11.3508 17.359 11.6418 17.65 12.0008 17.65V16.35ZM16.0508 14.65C16.4098 14.65 16.7008 14.359 16.7008 14C16.7008 13.641 16.4098 13.35 16.0508 13.35V14.65ZM16.0008 13.35C15.6418 13.35 15.3508 13.641 15.3508 14C15.3508 14.359 15.6418 14.65 16.0008 14.65V13.35ZM16.0508 17.65C16.4098 17.65 16.7008 17.359 16.7008 17C16.7008 16.641 16.4098 16.35 16.0508 16.35V17.65ZM16.0008 16.35C15.6418 16.35 15.3508 16.641 15.3508 17C15.3508 17.359 15.6418 17.65 16.0008 17.65V16.35ZM8.65 3C8.65 2.64101 8.35898 2.35 8 2.35C7.64102 2.35 7.35 2.64101 7.35 3H8.65ZM7.35 6C7.35 6.35899 7.64102 6.65 8 6.65C8.35898 6.65 8.65 6.35899 8.65 6H7.35ZM16.65 3C16.65 2.64101 16.359 2.35 16 2.35C15.641 2.35 15.35 2.64101 15.35 3H16.65ZM15.35 6C15.35 6.35899 15.641 6.65 16 6.65C16.359 6.65 16.65 6.35899 16.65 6H15.35ZM6.99999 5.15002L17 5.15001L17 3.85001L6.99999 3.85002L6.99999 5.15002ZM20.35 8.50001V17H21.65V8.50001H20.35ZM17 20.35H7V21.65H17V20.35ZM3.65 17V8.50002H2.35V17H3.65ZM7 20.35C6.03882 20.35 5.38332 20.3486 4.89207 20.2826C4.41952 20.2191 4.1974 20.1066 4.04541 19.9546L3.12617 20.8739C3.55996 21.3077 4.10214 21.4881 4.71885 21.571C5.31685 21.6514 6.07557 21.65 7 21.65V20.35ZM2.35 17C2.35 17.9245 2.34862 18.6832 2.42902 19.2812C2.51193 19.8979 2.69237 20.4401 3.12617 20.8739L4.04541 19.9546C3.89341 19.8026 3.78096 19.5805 3.71743 19.108C3.65138 18.6167 3.65 17.9612 3.65 17H2.35ZM20.35 17C20.35 17.9612 20.3486 18.6167 20.2826 19.108C20.219 19.5805 20.1066 19.8026 19.9546 19.9546L20.8738 20.8739C21.3076 20.4401 21.4881 19.8979 21.571 19.2812C21.6514 18.6832 21.65 17.9245 21.65 17H20.35ZM17 21.65C17.9244 21.65 18.6831 21.6514 19.2812 21.571C19.8979 21.4881 20.44 21.3077 20.8738 20.8739L19.9546 19.9546C19.8026 20.1066 19.5805 20.2191 19.1079 20.2826C18.6167 20.3486 17.9612 20.35 17 20.35V21.65ZM17 5.15001C17.9612 5.15 18.6167 5.15138 19.1079 5.21743C19.5805 5.28096 19.8026 5.39341 19.9546 5.54541L20.8738 4.62617C20.44 4.19238 19.8979 4.01194 19.2812 3.92902C18.6831 3.84862 17.9244 3.85001 17 3.85001L17 5.15001ZM21.65 8.50001C21.65 7.57557 21.6514 6.81686 21.571 6.21885C21.4881 5.60214 21.3076 5.05996 20.8738 4.62617L19.9546 5.54541C20.1066 5.6974 20.219 5.91952 20.2826 6.39207C20.3486 6.88332 20.35 7.53882 20.35 8.50001H21.65ZM6.99999 3.85002C6.07556 3.85002 5.31685 3.84865 4.71884 3.92905C4.10214 4.01196 3.55996 4.1924 3.12617 4.62619L4.04541 5.54543C4.1974 5.39344 4.41952 5.28099 4.89207 5.21745C5.38331 5.15141 6.03881 5.15002 6.99999 5.15002L6.99999 3.85002ZM3.65 8.50002C3.65 7.53884 3.65138 6.88334 3.71743 6.39209C3.78096 5.91954 3.89341 5.69743 4.04541 5.54543L3.12617 4.62619C2.69237 5.05999 2.51193 5.60217 2.42902 6.21887C2.34862 6.81688 2.35 7.57559 2.35 8.50002H3.65ZM3 10.65H21V9.35H3V10.65ZM8.05078 13.35H8.00078V14.65H8.05078V13.35ZM8.05078 16.35H8.00078V17.65H8.05078V16.35ZM12.0508 13.35H12.0008V14.65H12.0508V13.35ZM12.0508 16.35H12.0008V17.65H12.0508V16.35ZM16.0508 13.35H16.0008V14.65H16.0508V13.35ZM16.0508 16.35H16.0008V17.65H16.0508V16.35ZM7.35 3V6H8.65V3H7.35ZM15.35 3V6H16.65V3H15.35Z"
								fill="#111827"
							/>
						</svg>
						<h6 className="text-xl leading-8 font-semibold text-gray-900">
							{currentDate.toLocaleDateString("ja-JP", {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</h6>
					</div>
					<div className="flex items-center gap-4">
						<div className="hidden sm:block">
							<ViewToggle view={view} setView={setView} />
						</div>

						<div className="flex items-center gap-2">
							<Button
								variant="navigation"
								onClick={() => setCurrentDayOffset((prev) => prev - 1)}
							>
								<svg
									aria-hidden="true"
									className="w-5 h-5 text-gray-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 19l-7-7 7-7"
									/>
								</svg>
							</Button>
							<Button
								variant="navigation"
								onClick={() => setCurrentDayOffset(() => 0)}
							>
								<svg
									aria-hidden="true"
									className="w-5 h-5 text-gray-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
									/>
								</svg>
							</Button>
							<Button
								variant="navigation"
								onClick={() => setCurrentDayOffset((prev) => prev + 1)}
							>
								<svg
									aria-hidden="true"
									className="w-5 h-5 text-gray-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</Button>
						</div>
					</div>
				</div>

				{/* All-day events section */}
				{allDayEvents.length > 0 && (
					<div className="mb-4">
						<div className="flex items-center gap-2 mb-2">
							<span className="text-sm font-medium text-gray-700">終日</span>
						</div>
						<div className="space-y-1">
							{allDayEvents.map((event, index) => {
								const color = getEventColor(index);
								return (
									<div
										key={index}
										className={`rounded px-3 py-2 text-sm font-medium ${color.bg} ${color.text} border ${color.border}`}
									>
										{event.summary}
									</div>
								);
							})}
						</div>
					</div>
				)}

				<div className="relative">
					<div className="flex border-t border-gray-200 w-full relative ml-12 mt-6">
						<div className="flex flex-col w-0 relative overflow-visible">
							{timeSlots.map((hour) => (
								<div
									key={hour}
									className="h-16 lg:h-14 border-b border-r border-gray-200 relative"
								>
									<span className="absolute -left-12 top-0 -mt-2 text-xs font-medium text-gray-500 whitespace-nowrap z-10">
										{`${String(hour).padStart(2, "0")}:00`}
									</span>
								</div>
							))}
						</div>
						{/* Main day column with absolute positioned events */}
						<div className="flex-1 relative">
							{/* Background grid */}
							<div className="flex flex-col">
								{timeSlots.map((hour) => (
									<div
										key={hour}
										className="w-full h-16 lg:h-14 border-b border-gray-200"
									/>
								))}
							</div>

							{/* Current time line */}
							{(() => {
								const currentTimeHour = currentHour + currentMinutes / 60;
								const dayStartTime = timeSlots[0]; // 10
								const dayEndTime = timeSlots[timeSlots.length - 1] + 1; // 23
								const currentTimePercent =
									((currentTimeHour - dayStartTime) /
										(dayEndTime - dayStartTime)) *
									100;
								const showCurrentTimeLine =
									currentHour >= 10 && currentHour <= 22;

								return (
									showCurrentTimeLine && (
										<div
											className="absolute left-0 right-0 z-30 flex items-center px-1.5"
											style={{
												top: `${Math.max(0, Math.min(100, currentTimePercent))}%`,
											}}
										>
											<div className="w-2 h-2 bg-blue-500 rounded-full -ml-1"></div>
											<div className="flex-1 border-t-2 border-blue-500"></div>
										</div>
									)
								);
							})()}

							{/* Events for today */}
							{(() => {
								// Pre-process events to assign column positions
								const eventsWithColumns = timedEvents.map(
									(event, eventIndex) => {
										const eventStart = new Date(event.start);
										const eventEnd = new Date(event.end);
										const eventStartTime =
											eventStart.getHours() + eventStart.getMinutes() / 60;
										const eventEndTime =
											eventEnd.getHours() + eventEnd.getMinutes() / 60;

										return {
											...event,
											eventIndex,
											eventStart,
											eventEnd,
											eventStartTime,
											eventEndTime,
											column: -1, // Will be assigned later
										};
									},
								);

								// Assign columns to overlapping events
								const dayStartTime = timeSlots[0];
								const dayEndTime = timeSlots[timeSlots.length - 1] + 1;

								eventsWithColumns.forEach((event) => {
									if (
										event.eventEndTime <= dayStartTime ||
										event.eventStartTime >= dayEndTime
									) {
										return; // Skip events outside visible range
									}

									// Find all events that overlap with this event
									const overlappingEvents = eventsWithColumns.filter(
										(otherEvent) => {
											if (otherEvent === event) return false;
											return (
												event.eventStartTime < otherEvent.eventEndTime &&
												event.eventEndTime > otherEvent.eventStartTime
											);
										},
									);

									// Find the first available column
									const usedColumns = overlappingEvents
										.map((e) => e.column)
										.filter((col) => col >= 0);
									let column = 0;
									while (usedColumns.includes(column)) {
										column++;
									}
									event.column = column;
								});

								return eventsWithColumns.map((event) => {
									const {
										eventStart,
										eventEnd,
										eventStartTime,
										eventEndTime,
										eventIndex,
										column,
									} = event;

									// Skip events outside the visible time range
									if (
										eventEndTime <= dayStartTime ||
										eventStartTime >= dayEndTime
									) {
										return null;
									}

									// Calculate position and height as percentage of the full day
									const visibleStart = Math.max(eventStartTime, dayStartTime);
									const visibleEnd = Math.min(eventEndTime, dayEndTime);
									const topPercent =
										((visibleStart - dayStartTime) /
											(dayEndTime - dayStartTime)) *
										100;
									const heightPercent =
										((visibleEnd - visibleStart) /
											(dayEndTime - dayStartTime)) *
										100;

									const color = getEventColor(eventIndex);

									// Calculate margins with column offset
									const leftMargin = column * 20;
									const rightMargin = 6 + column * 10;

									return (
										<div
											key={eventIndex}
											className={`absolute rounded pl-1.5 py-1.5 pr-0 border-l-2 ${color.bg} ${color.border} z-20`}
											style={{
												top: `${topPercent}%`,
												height: `${Math.max(heightPercent, 5)}%`,
												left: `${leftMargin}px`,
												right: `${rightMargin}px`,
											}}
											data-debug-index={eventIndex}
											data-debug-column={column}
											data-debug-left-margin={leftMargin}
											data-debug-event-start={event.start}
											data-debug-event-summary={event.summary}
										>
											{(() => {
												const durationMinutes =
													(eventEnd.getTime() - eventStart.getTime()) /
													(1000 * 60);
												const timeString = `${eventStart.toLocaleTimeString(
													"ja-JP",
													{
														hour: "2-digit",
														minute: "2-digit",
													},
												)} - ${eventEnd.toLocaleTimeString("ja-JP", {
													hour: "2-digit",
													minute: "2-digit",
												})}`;

												if (durationMinutes <= 30) {
													return (
														<p className="text-xs font-normal text-gray-900 whitespace-nowrap overflow-hidden">
															{event.summary}{" "}
															<span className={`font-semibold ${color.text}`}>
																{timeString}
															</span>
														</p>
													);
												} else {
													return (
														<>
															<p className="text-xs font-normal text-gray-900 mb-px whitespace-nowrap overflow-hidden">
																{event.summary}
															</p>
															<p
																className={`text-xs font-semibold ${color.text} whitespace-nowrap overflow-hidden`}
															>
																{timeString}
															</p>
														</>
													);
												}
											})()}
										</div>
									);
								});
							})()}
						</div>
					</div>

					{allEvents.length === 0 && (
						<div className="text-center py-8">
							<p className="text-gray-500">今日の予定はありません</p>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
