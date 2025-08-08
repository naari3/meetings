import { useCallback, useEffect, useRef, useState } from "react";
import type { CalendarEvent } from "../types";

export interface NotificationSettings {
	enabled: boolean;
	minutes: number;
	enableStartTime: boolean;
}

export const useNotifications = (events: CalendarEvent[]) => {
	const [settings, setSettings] = useState<NotificationSettings>({
		enabled: false,
		minutes: 10,
		enableStartTime: false,
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
