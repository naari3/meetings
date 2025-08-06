import type { CalendarEvent } from "../types";

interface StatsCardProps {
	events: CalendarEvent[];
}

export default function StatsCard({ events }: StatsCardProps) {
	const _totalEvents = events.length;

	const totalDuration = events.reduce((acc, event) => {
		const start = new Date(event.start);
		const end = new Date(event.end);
		return acc + (end.getTime() - start.getTime());
	}, 0);

	const _totalHours = Math.round((totalDuration / (1000 * 60 * 60)) * 10) / 10;

	const today = new Date();
	const todayJST = new Date(today.getTime() + 9 * 60 * 60 * 1000); // JST
	const todayDateString = todayJST.toISOString().split("T")[0]; // YYYY-MM-DD

	const todayEvents = events.filter((event) => {
		const eventStart = new Date(event.start);
		const eventEnd = new Date(event.end);
		const eventDateString = eventStart.toISOString().split("T")[0];

		// 全日イベント（24時間以上）を除外し、今日の日付のイベントのみ
		const durationHours =
			(eventEnd.getTime() - eventStart.getTime()) / (1000 * 60 * 60);
		return eventDateString === todayDateString && durationHours < 24;
	});

	const todayDuration = todayEvents.reduce((acc, event) => {
		const start = new Date(event.start);
		const end = new Date(event.end);
		const duration = end.getTime() - start.getTime();
		// 24時間以上のイベントは除外
		if (duration >= 24 * 60 * 60 * 1000) return acc;
		return acc + duration;
	}, 0);

	const todayHours = Math.round((todayDuration / (1000 * 60 * 60)) * 10) / 10;

	const thisWeekEvents = events.filter((event) => {
		const eventStart = new Date(event.start);
		const eventEnd = new Date(event.end);
		const eventDateString = eventStart.toISOString().split("T")[0];

		// 今週の範囲を計算（JST基準）
		const weekStart = new Date(todayJST);
		weekStart.setDate(todayJST.getDate() - todayJST.getDay());
		const weekEnd = new Date(weekStart);
		weekEnd.setDate(weekStart.getDate() + 6);

		const weekStartString = weekStart.toISOString().split("T")[0];
		const weekEndString = weekEnd.toISOString().split("T")[0];

		// 全日イベント（24時間以上）を除外し、今週のイベントのみ
		const durationHours =
			(eventEnd.getTime() - eventStart.getTime()) / (1000 * 60 * 60);
		return (
			eventDateString >= weekStartString &&
			eventDateString <= weekEndString &&
			durationHours < 24
		);
	});

	const thisWeekDuration = thisWeekEvents.reduce((acc, event) => {
		const start = new Date(event.start);
		const end = new Date(event.end);
		const duration = end.getTime() - start.getTime();
		// 24時間以上のイベントは除外
		if (duration >= 24 * 60 * 60 * 1000) return acc;
		return acc + duration;
	}, 0);

	const weeklyAverage =
		Math.round((thisWeekDuration / (1000 * 60 * 60)) * 10) / 10;

	const stats = [
		{
			id: "today-count",
			label: "今日の予定数",
			value: todayEvents.length,
			suffix: "件",
			icon: "star",
			color: "orange",
			bgGradient: "from-orange-500 to-orange-600",
		},
		{
			id: "today-hours",
			label: "今日のミーティング時間",
			value: todayHours,
			suffix: "時間",
			icon: "clock",
			color: "blue",
			bgGradient: "from-blue-500 to-blue-600",
		},
		{
			id: "weekly-events",
			label: "今週の予定数",
			value: thisWeekEvents.length,
			suffix: "件",
			icon: "chart",
			color: "purple",
			bgGradient: "from-purple-500 to-purple-600",
		},
		{
			id: "weekly-average",
			label: "今週のミーティング時間",
			value: weeklyAverage,
			suffix: "時間",
			icon: "calendar",
			color: "green",
			bgGradient: "from-green-500 to-green-600",
		},
	];

	const iconMap = {
		calendar: (
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
			/>
		),
		clock: (
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		),
		star: (
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
			/>
		),
		chart: (
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
			/>
		),
	};

	return (
		<div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 p-8 mb-8">
			<div className="text-center mb-8">
				<h2 className="text-2xl font-bold text-gray-900 mb-2">
					ダッシュボード
				</h2>
				<p className="text-gray-600">なありのスケジュールの概要</p>
			</div>

			<div className="flex flex-wrap justify-center gap-6 mb-8">
				{stats.map((stat) => (
					<div
						key={stat.id}
						className="relative overflow-hidden bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group w-full sm:w-auto sm:min-w-[200px] sm:flex-1 sm:max-w-[240px]"
					>
						<div className="flex items-center justify-between mb-4">
							<div
								className={`w-12 h-12 bg-gradient-to-r ${stat.bgGradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
							>
								<svg
									aria-hidden="true"
									className="w-6 h-6 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									{iconMap[stat.icon]}
								</svg>
							</div>
						</div>

						<div className="space-y-1">
							<div className="flex items-baseline space-x-1">
								<span
									className={`text-3xl font-bold ${
										stat.id === "today-count"
											? "text-orange-600"
											: stat.id === "today-hours"
												? "text-blue-600"
												: stat.id === "weekly-events"
													? "text-purple-600"
													: stat.id === "weekly-average"
														? "text-green-600"
														: "text-purple-600"
									}`}
								>
									{stat.value}
								</span>
								<span
									className={`text-sm font-medium ${
										stat.id === "today-count"
											? "text-orange-500"
											: stat.id === "today-hours"
												? "text-blue-500"
												: stat.id === "weekly-events"
													? "text-purple-500"
													: stat.id === "weekly-average"
														? "text-green-500"
														: "text-purple-500"
									}`}
								>
									{stat.suffix}
								</span>
							</div>
							<p className="text-sm text-gray-600 font-medium">{stat.label}</p>
						</div>

						{/* Background decoration */}
						<div
							className={`absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r ${stat.bgGradient} opacity-5 rounded-full group-hover:opacity-10 transition-opacity duration-200`}
						></div>
					</div>
				))}
			</div>

			{/* Today's Schedule */}
			<div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6">
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					今日の予定一覧
				</h3>
				{todayEvents.length > 0 ? (
					<div className="space-y-3">
						{todayEvents.map((event, index) => {
							const startTime = new Date(event.start).toLocaleTimeString(
								"ja-JP",
								{
									hour: "2-digit",
									minute: "2-digit",
								},
							);
							const endTime = new Date(event.end).toLocaleTimeString("ja-JP", {
								hour: "2-digit",
								minute: "2-digit",
							});
							const duration = Math.round(
								(new Date(event.end).getTime() -
									new Date(event.start).getTime()) /
									(1000 * 60),
							);

							return (
								<div
									key={index}
									className="bg-white rounded-lg p-4 border border-gray-200"
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-3">
											<div className="w-3 h-3 bg-blue-500 rounded-full"></div>
											<span className="font-medium text-gray-900">
												{event.title}
											</span>
										</div>
										<div className="text-sm text-gray-600">
											{startTime} - {endTime} ({duration}分)
										</div>
									</div>
								</div>
							);
						})}
					</div>
				) : (
					<div className="text-center py-8">
						<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg
								aria-hidden="true"
								className="w-8 h-8 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
						</div>
						<p className="text-gray-500">今日は予定がありません</p>
					</div>
				)}
			</div>
		</div>
	);
}
