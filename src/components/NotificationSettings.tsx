import { useState } from "react";
import type { NotificationSettings as NotificationSettingsType } from "../hooks/useNotifications";
import Button from "./Button";

interface NotificationSettingsProps {
	settings: NotificationSettingsType;
	permission: NotificationPermission;
	onSettingsChange: (settings: NotificationSettingsType) => void;
	onRequestPermission: () => Promise<boolean>;
}

// テスト用の通知音再生関数（ピーピーピー、ピーピーピーのパターン）
const playTestSound = (volume: number) => {
	const audioContext = new AudioContext();

	// ビープ音のパターン: [開始時刻, 長さ]
	const beepPattern = [
		// 1回目のピーピーピー
		[0, 0.15],
		[0.2, 0.15],
		[0.4, 0.15],
		// 少し間を空けて2回目のピーピーピー
		[0.8, 0.15],
		[1.0, 0.15],
		[1.2, 0.15],
	];

	beepPattern.forEach(([startTime, duration]) => {
		const oscillator = audioContext.createOscillator();
		const gainNode = audioContext.createGain();

		oscillator.connect(gainNode);
		gainNode.connect(audioContext.destination);

		// ビープ音の設定
		oscillator.frequency.value = 800;
		oscillator.type = "sine";

		// 音量のフェードイン・フェードアウト
		const fadeIn = 0.01;
		const fadeOut = 0.05;
		gainNode.gain.setValueAtTime(0, audioContext.currentTime + startTime);
		gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + startTime + fadeIn);
		gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + startTime + duration - fadeOut);
		gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + startTime + duration);

		// 再生
		oscillator.start(audioContext.currentTime + startTime);
		oscillator.stop(audioContext.currentTime + startTime + duration);
	});
};

export default function NotificationSettings({
	settings,
	permission,
	onSettingsChange,
	onRequestPermission,
}: NotificationSettingsProps) {
	const [isOpen, setIsOpen] = useState(false);

	const handleToggle = async () => {
		if (!settings.enabled && permission !== "granted") {
			const granted = await onRequestPermission();
			if (!granted) return;
		}

		onSettingsChange({ ...settings, enabled: !settings.enabled });
	};

	const handleMinutesChange = (minutes: number) => {
		onSettingsChange({ ...settings, minutes });
	};

	const getPermissionStatus = () => {
		switch (permission) {
			case "granted":
				return {
					text: "許可済み",
					color: "text-green-600",
					bg: "bg-green-100",
				};
			case "denied":
				return {
					text: "拒否されています",
					color: "text-red-600",
					bg: "bg-red-100",
				};
			default:
				return {
					text: "未設定",
					color: "text-yellow-600",
					bg: "bg-yellow-100",
				};
		}
	};

	const permissionStatus = getPermissionStatus();

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
			<div className="flex items-center space-x-3">
				<div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
					<svg
						aria-hidden="true"
						className="w-5 h-5 text-white"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 17h5l-5 5v-5z"
						/>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M11 19H6.5a2.5 2.5 0 010-5H11"
						/>
					</svg>
				</div>
				<div className="flex-1">
					<h4 className="font-medium text-gray-900 dark:text-white">
						予定開始前通知
					</h4>
					<div className="flex items-center space-x-2 mt-1">
						<span
							className={`text-xs px-3 py-1 rounded-full font-medium ${permissionStatus.bg} ${permissionStatus.color}`}
						>
							{permissionStatus.text}
						</span>
						{settings.enabled && (
							<span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm">
								{settings.minutes}分前
							</span>
						)}
					</div>
				</div>
				<Button
					variant="primary"
					active={settings.enabled}
					onClick={() => setIsOpen(!isOpen)}
				>
					{isOpen ? "閉じる" : "設定"}
				</Button>
			</div>

			{isOpen && (
				<div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
							通知を有効にする
						</span>
						<button
							type="button"
							aria-label="通知を有効にする"
							onClick={handleToggle}
							className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
								settings.enabled
									? "bg-blue-600"
									: "bg-gray-200 dark:bg-gray-600"
							}`}
						>
							<span
								className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
									settings.enabled ? "translate-x-6" : "translate-x-1"
								}`}
							/>
						</button>
					</div>

					{settings.enabled && (
						<div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 border border-blue-200 dark:border-blue-700 space-y-3">
							<div>
								<label
									htmlFor="notification-timing"
									className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
								>
									通知タイミング
								</label>
								<select
									id="notification-timing"
									value={settings.minutes}
									onChange={(e) => handleMinutesChange(Number(e.target.value))}
									className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
								>
									<option value={5}>5分前</option>
									<option value={10}>10分前</option>
									<option value={15}>15分前</option>
									<option value={30}>30分前</option>
									<option value={60}>1時間前</option>
								</select>
							</div>

							<div className="flex items-center justify-between">
								<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
									予定開始時刻にも通知する
								</span>
								<button
									type="button"
									aria-label="予定開始時刻にも通知する"
									onClick={() =>
										onSettingsChange({
											...settings,
											enableStartTime: !settings.enableStartTime,
										})
									}
									className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
										settings.enableStartTime
											? "bg-blue-600"
											: "bg-gray-200 dark:bg-gray-600"
									}`}
								>
									<span
										className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
											settings.enableStartTime
												? "translate-x-6"
												: "translate-x-1"
										}`}
									/>
								</button>
							</div>

							<div className="flex items-center justify-between">
								<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
									通知音を鳴らす
								</span>
								<button
									type="button"
									aria-label="通知音を鳴らす"
									onClick={() =>
										onSettingsChange({
											...settings,
											soundEnabled: !settings.soundEnabled,
										})
									}
									className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
										settings.soundEnabled
											? "bg-blue-600"
											: "bg-gray-200 dark:bg-gray-600"
									}`}
								>
									<span
										className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
											settings.soundEnabled
												? "translate-x-6"
												: "translate-x-1"
										}`}
									/>
								</button>
							</div>

							{settings.soundEnabled && (
								<div>
									<div className="flex items-center justify-between mb-2">
										<label
											htmlFor="sound-volume"
											className="block text-sm font-medium text-gray-700 dark:text-gray-300"
										>
											音量: {Math.round(settings.soundVolume * 100)}%
										</label>
										<Button
											variant="secondary"
											onClick={() => playTestSound(settings.soundVolume)}
										>
											テスト
										</Button>
									</div>
									<input
										id="sound-volume"
										type="range"
										min="0"
										max="100"
										value={Math.round(settings.soundVolume * 100)}
										onChange={(e) =>
											onSettingsChange({
												...settings,
												soundVolume: Number(e.target.value) / 100,
											})
										}
										className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
									/>
								</div>
							)}
						</div>
					)}

					{permission === "denied" && (
						<div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-md">
							<p className="text-sm text-red-600 dark:text-red-400">
								通知が拒否されています。ブラウザの設定から通知を許可してください。
							</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
