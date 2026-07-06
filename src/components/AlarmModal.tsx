import type { CalendarEvent } from "../types";

interface AlarmModalProps {
	alarm: { event: CalendarEvent; minutesBefore: number };
	onDismiss: () => void;
}

export default function AlarmModal({ alarm, onDismiss }: AlarmModalProps) {
	const startTime = new Date(alarm.event.start).toLocaleTimeString("ja-JP", {
		hour: "2-digit",
		minute: "2-digit",
	});

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
			role="dialog"
			aria-modal="true"
			aria-labelledby="alarm-modal-title"
		>
			<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-4 border-red-500 max-w-md w-full p-8">
				<div className="flex flex-col items-center text-center space-y-4">
					<div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
						<svg
							aria-hidden="true"
							className="w-10 h-10 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 17h5l-5 5v-5zM4.19 4.19A9 9 0 0119.81 19.81M4.19 4.19L2 2m2.19 2.19A9 9 0 0119.81 19.81m0 0L22 22M9 5.291A6 6 0 0018 11v3.159c0 .538.214 1.055.595 1.436L20 17H4l1.405-1.405A2.032 2.032 0 006 14.159V11a6 6 0 013-5.709"
							/>
						</svg>
					</div>
					<h2
						id="alarm-modal-title"
						className="text-2xl font-bold text-gray-900 dark:text-white"
					>
						本日最初の予定
					</h2>
					<div className="w-full bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4">
						<p className="text-lg font-semibold text-gray-900 dark:text-white break-words">
							{alarm.event.summary}
						</p>
						<p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
							{startTime} 開始（{alarm.minutesBefore}分前）
						</p>
					</div>
					<button
						type="button"
						onClick={onDismiss}
						className="w-full px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-lg rounded-xl shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
					>
						アラームを止める
					</button>
				</div>
			</div>
		</div>
	);
}
