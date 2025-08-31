import type { CalendarEvent } from "../types";

interface CalendarGridProps {
	events: CalendarEvent[];
}

interface CalendarDay {
	date: Date;
	events: CalendarEvent[];
	isCurrentMonth: boolean;
	isToday: boolean;
}

export default function CalendarGrid({ events }: CalendarGridProps) {
	const today = new Date();
	const currentMonth = today.getMonth();
	const currentYear = today.getFullYear();

	// Get the first day of the month and how many days are in the month
	const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
	const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
	const daysInMonth = lastDayOfMonth.getDate();
	const startingDayOfWeek = firstDayOfMonth.getDay();

	// Generate calendar days
	const calendarDays: CalendarDay[] = [];

	// Add days from previous month to fill the first week
	const prevMonth = new Date(currentYear, currentMonth - 1, 0);
	for (let i = startingDayOfWeek - 1; i >= 0; i--) {
		const date = new Date(
			currentYear,
			currentMonth - 1,
			prevMonth.getDate() - i,
		);
		calendarDays.push({
			date,
			events: getEventsForDate(events, date),
			isCurrentMonth: false,
			isToday: false,
		});
	}

	// Add days of current month
	for (let day = 1; day <= daysInMonth; day++) {
		const date = new Date(currentYear, currentMonth, day);
		calendarDays.push({
			date,
			events: getEventsForDate(events, date),
			isCurrentMonth: true,
			isToday: isSameDate(date, today),
		});
	}

	// Add days from next month to fill the last week
	const remainingDays = 42 - calendarDays.length; // 6 weeks × 7 days
	for (let day = 1; day <= remainingDays; day++) {
		const date = new Date(currentYear, currentMonth + 1, day);
		calendarDays.push({
			date,
			events: getEventsForDate(events, date),
			isCurrentMonth: false,
			isToday: false,
		});
	}

	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	return (
		<section className="relative bg-stone-50 dark:bg-gray-900 py-24">
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
						<h6 className="text-xl leading-8 font-semibold text-gray-900 dark:text-white">
							{monthNames[currentMonth]} {currentYear}
						</h6>
					</div>
				</div>
				<div className="border border-gray-200 dark:border-gray-700">
					<div className="grid grid-cols-7 divide-gray-200 dark:divide-gray-700 border-b border-gray-200 dark:border-gray-700">
						<div className="p-3.5 flex flex-col sm:flex-row items-center justify-between border-r border-gray-200 dark:border-gray-700">
							<span className="text-sm font-medium text-gray-500 dark:text-gray-400">
								Sun
							</span>
							<span className="text-sm font-medium text-gray-900 dark:text-gray-100">
								09
							</span>
						</div>
						<div className="p-3.5 flex flex-col sm:flex-row items-center justify-between border-r border-gray-200 dark:border-gray-700">
							<span className="text-sm font-medium text-gray-500 dark:text-gray-400">
								Mon
							</span>
							<span className="text-sm font-medium text-gray-900 dark:text-gray-100">
								10
							</span>
						</div>
						<div className="p-3.5 flex flex-col sm:flex-row items-center justify-between border-r border-gray-200 dark:border-gray-700">
							<span className="text-sm font-medium text-gray-500 dark:text-gray-400">
								Tue
							</span>
							<span className="text-sm font-medium text-gray-900 dark:text-gray-100">
								11
							</span>
						</div>
						<div className="p-3.5 flex flex-col sm:flex-row items-center justify-between border-r border-gray-200 dark:border-gray-700">
							<span className="text-sm font-medium text-gray-500 dark:text-gray-400">
								Wed
							</span>
							<span className="text-sm font-medium text-gray-900 dark:text-gray-100">
								12
							</span>
						</div>
						<div className="p-3.5 flex flex-col sm:flex-row items-center justify-between border-r border-gray-200 dark:border-gray-700">
							<span className="text-sm font-medium text-gray-500 dark:text-gray-400">
								Thu
							</span>
							<span className="text-sm font-medium text-gray-900 dark:text-gray-100">
								13
							</span>
						</div>
						<div className="p-3.5 flex flex-col sm:flex-row items-center justify-between border-r border-gray-200 dark:border-gray-700">
							<span className="text-sm font-medium text-gray-500 dark:text-gray-400">
								Fri
							</span>
							<span className="text-sm font-medium text-gray-900 dark:text-gray-100">
								14
							</span>
						</div>
						<div className="p-3.5 flex flex-col sm:flex-row items-center justify-between">
							<span className="text-sm font-medium text-gray-500 dark:text-gray-400">
								Sat
							</span>
							<span className="text-sm font-medium text-gray-900 dark:text-gray-100">
								15
							</span>
						</div>
					</div>
					<div className="grid grid-cols-7 divide-gray-200 dark:divide-gray-700">
						{calendarDays.map((day, index) => (
							<CalendarCell key={index} day={day} events={events} />
						))}
					</div>
				</div>
				<div className="w-full lg:hidden py-8 px-2.5">
					<div className="bg-gray-50 dark:bg-gray-800 w-full rounded-xl">
						{events.slice(0, 3).map((event, index) => (
							<div
								key={index}
								className="p-3 w-full flex items-center justify-between group transition-all duration-300"
							>
								<div className="flex flex-col gap-2">
									<span className="text-sm font-medium text-gray-900 dark:text-gray-100">
										{event.summary}
									</span>
									<div className="flex items-center gap-2.5">
										<svg
											aria-hidden="true"
											xmlns="http://www.w3.org/2000/svg"
											width="18"
											height="18"
											viewBox="0 0 24 24"
											fill="none"
										>
											<path
												d="M12 8.99998V13L15 16M3 5.12132L5.10714 3M20.998 5.12657L18.8909 3.00525M20 13C20 17.4183 16.4183 21 12 21C7.58172 21 4 17.4183 4 13C4 8.5817 7.58172 4.99998 12 4.99998C16.4183 4.99998 20 8.5817 20 13Z"
												stroke="black"
												strokeWidth="1.6"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
										<span className="text-xs font-medium text-gray-600 dark:text-gray-400">
											{new Date(event.start).toLocaleTimeString("ja-JP", {
												hour: "numeric",
												minute: "2-digit",
											})}
										</span>
									</div>
								</div>
								<button className="py-1 px-2 rounded border border-gray-400 dark:border-gray-600 text-xs font-medium text-gray-900 dark:text-gray-100 dark:bg-gray-700 opacity-0 transition-all duration-500 group-hover:opacity-100">
									Edit
								</button>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

interface CalendarCellProps {
	day: CalendarDay;
	events: CalendarEvent[];
}

function CalendarCell({ day, events }: CalendarCellProps) {
	const hasEvent = day.events.length > 0;

	return (
		<div
			className={`p-3.5 xl:aspect-auto lg:h-28 border-b border-r border-gray-200 dark:border-gray-700 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-stone-100 dark:hover:bg-gray-800 ${
				!day.isCurrentMonth ? "bg-gray-50 dark:bg-gray-800" : ""
			}`}
		>
			<span
				className={`text-xs font-semibold flex items-center justify-center w-7 h-7 rounded-full ${
					day.isToday
						? "text-white bg-indigo-600"
						: !day.isCurrentMonth
							? "text-gray-500 dark:text-gray-400"
							: "text-gray-900 dark:text-gray-100"
				}`}
			>
				{day.date.getDate()}
			</span>
			{hasEvent && (
				<>
					<span className="hidden lg:block text-xs font-medium text-gray-500 dark:text-gray-400">
						{day.events[0].summary}
					</span>
					<span className="lg:hidden w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"></span>
				</>
			)}
		</div>
	);
}

interface EventBadgeProps {
	event: CalendarEvent;
}

function _EventBadge({ event }: EventBadgeProps) {
	const startDate = new Date(event.start);
	const endDate = new Date(event.end);
	const isAllDay =
		startDate.getHours() === 0 &&
		startDate.getMinutes() === 0 &&
		endDate.getHours() === 0 &&
		endDate.getMinutes() === 0;

	return (
		<div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs p-1 rounded truncate">
			<div className="font-medium truncate">{event.summary}</div>
			{!isAllDay && (
				<div className="text-blue-600 dark:text-blue-300 hidden sm:block">
					{startDate.toLocaleTimeString("ja-JP", {
						hour: "2-digit",
						minute: "2-digit",
					})}
				</div>
			)}
		</div>
	);
}

function getEventsForDate(
	events: CalendarEvent[],
	date: Date,
): CalendarEvent[] {
	return events.filter((event) => {
		const eventStart = new Date(event.start);
		const eventEnd = new Date(event.end);

		// Check if the event occurs on this date
		const dateStart = new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
		);
		const dateEnd = new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
			23,
			59,
			59,
		);

		return eventStart <= dateEnd && eventEnd >= dateStart;
	});
}

function isSameDate(date1: Date, date2: Date): boolean {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	);
}
