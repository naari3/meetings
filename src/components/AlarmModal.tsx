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
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
			role="dialog"
			aria-modal="true"
			aria-labelledby="alarm-modal-title"
		>
			<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-blue-200 dark:border-blue-700 max-w-md w-full p-8">
				<div className="flex flex-col items-center text-center space-y-4">
					<div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
						<svg
							aria-hidden="true"
							className="w-8 h-8 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<h2
						id="alarm-modal-title"
						className="text-xl font-semibold text-gray-900 dark:text-white"
					>
						本日最初の予定
					</h2>
					<div className="w-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-lg p-4">
						<p className="text-lg font-medium text-gray-900 dark:text-white break-words">
							{alarm.event.summary}
						</p>
						<p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
							{startTime} 開始（{alarm.minutesBefore}分前）
						</p>
					</div>
					<button
						type="button"
						onClick={onDismiss}
						className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium text-base rounded-xl shadow transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300"
					>
						アラームを止める
					</button>
				</div>
			</div>
		</div>
	);
}
