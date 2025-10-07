import { useCallback, useEffect, useRef, useState } from "react";
import type { CalendarEvent } from "../types";

export interface NotificationSettings {
	enabled: boolean;
	minutes: number;
	enableStartTime: boolean;
	soundEnabled: boolean;
	soundVolume: number; // 0.0 ~ 1.0
}

// 通知音を再生する関数（ピーピーピー、ピーピーピーのパターン）
const playNotificationSound = (volume = 0.3) => {
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
		oscillator.frequency.value = 800; // 周波数 (Hz)
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

export const useNotifications = (events: CalendarEvent[]) => {
	const [settings, setSettings] = useState<NotificationSettings>({
		enabled: false,
		minutes: 10,
		enableStartTime: false,
		soundEnabled: true,
		soundVolume: 0.3,
	});
	const [permission, setPermission] = useState<NotificationPermission>(
		typeof Notification !== "undefined" ? Notification.permission : "default",
	);
	const scheduledTimers = useRef<NodeJS.Timeout[]>([]);

	useEffect(() => {
		const savedSettings = localStorage.getItem("notificationSettings");
		if (savedSettings) {
			const parsed = JSON.parse(savedSettings);
			// マイグレーション: enableStartTimeが存在しない場合はデフォルト値を設定
			setSettings({
				enabled: parsed.enabled || false,
				minutes: parsed.minutes || 10,
				enableStartTime: parsed.enableStartTime || false,
				soundEnabled: parsed.soundEnabled !== undefined ? parsed.soundEnabled : true,
				soundVolume: parsed.soundVolume !== undefined ? parsed.soundVolume : 0.3,
			});
		}
	}, []);

	const saveSettings = useCallback((newSettings: NotificationSettings) => {
		setSettings(newSettings);
		localStorage.setItem("notificationSettings", JSON.stringify(newSettings));
	}, []);

	const requestPermission = useCallback(async () => {
		if (typeof Notification === "undefined") {
			console.error("このブラウザは通知をサポートしていません");
			return false;
		}

		const result = await Notification.requestPermission();
		setPermission(result);
		return result === "granted";
	}, []);

	const scheduleNotifications = useCallback(() => {
		// 既存のタイマーをすべてクリア
		scheduledTimers.current.forEach((timer) => clearTimeout(timer));
		scheduledTimers.current = [];

		if (!settings.enabled || permission !== "granted") return;

		const now = new Date();
		const upcomingEvents = events.filter((event) => {
			const eventStart = new Date(event.start);
			const notificationTime = new Date(
				eventStart.getTime() - settings.minutes * 60 * 1000,
			);
			return notificationTime > now && eventStart > now;
		});

		upcomingEvents.forEach((event) => {
			const eventStart = new Date(event.start);

			// 事前通知
			const notificationTime = new Date(
				eventStart.getTime() - settings.minutes * 60 * 1000,
			);
			const timeUntilNotification = notificationTime.getTime() - now.getTime();

			if (
				timeUntilNotification > 0 &&
				timeUntilNotification <= 24 * 60 * 60 * 1000
			) {
				const timerId = setTimeout(() => {
					new Notification("予定のお知らせ", {
						body: `${settings.minutes}分後に「${event.summary}」が始まります`,
						icon: "/favicon.ico",
						tag: `event-before-${event.start}`,
						requireInteraction: false,
					});
				}, timeUntilNotification);
				scheduledTimers.current.push(timerId);
			}

			// 開始時刻通知
			if (settings.enableStartTime) {
				const timeUntilStart = eventStart.getTime() - now.getTime();
				if (timeUntilStart > 0 && timeUntilStart <= 24 * 60 * 60 * 1000) {
					const timerId = setTimeout(() => {
						// 通知音を再生
						if (settings.soundEnabled) {
							playNotificationSound(settings.soundVolume);
						}

						new Notification("予定開始のお知らせ", {
							body: `「${event.summary}」が始まりました`,
							icon: "/favicon.ico",
							tag: `event-start-${event.start}`,
							requireInteraction: false,
						});
					}, timeUntilStart);
					scheduledTimers.current.push(timerId);
				}
			}
		});
	}, [events, settings, permission]);

	useEffect(() => {
		if (settings.enabled && permission === "granted") {
			scheduleNotifications();
		}

		// クリーンアップ: コンポーネントのアンマウント時にタイマーをクリア
		return () => {
			scheduledTimers.current.forEach((timer) => clearTimeout(timer));
			scheduledTimers.current = [];
		};
	}, [settings, permission, scheduleNotifications]);

	return {
		settings,
		permission,
		saveSettings,
		requestPermission,
		scheduleNotifications,
	};
};
