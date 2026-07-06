import { useCallback, useEffect, useRef, useState } from "react";
import type { CalendarEvent } from "../types";

export interface NotificationSettings {
	enabled: boolean;
	minutes: number;
	enableStartTime: boolean;
	soundEnabled: boolean;
	soundVolume: number; // 0.0 ~ 1.0
	firstEventAlarmEnabled: boolean;
	firstEventAlarmMinutes: number;
}

export interface AlarmController {
	stop: () => void;
}

// 最初の予定用のアラーム音（うるさめ・停止操作があるまでループ）。
// 880Hz/1100Hz の矩形波を交互に鳴らすサイレン風のパターン。
const playLoudAlarmSound = (volume = 0.5): AlarmController => {
	const audioContext = new AudioContext();
	// 音量はベース音量 + 0.2 を上限 0.9 にクランプして "うるささ" を底上げ
	const loudVolume = Math.min(0.9, volume + 0.2);

	// [開始秒(サイクル内), 長さ秒, 周波数Hz] のリスト。1サイクル約2.8秒。
	const cyclePattern: Array<[number, number, number]> = [
		[0.0, 0.35, 880],
		[0.35, 0.35, 1100],
		[0.7, 0.35, 880],
		[1.05, 0.35, 1100],
		[1.4, 0.35, 880],
		[1.75, 0.35, 1100],
		[2.1, 0.35, 880],
		[2.45, 0.35, 1100],
	];
	const cycleDuration = 2.8;

	let stopped = false;
	const activeOscillators: OscillatorNode[] = [];

	const scheduleCycle = (baseTime: number) => {
		for (const [startOffset, duration, freq] of cyclePattern) {
			const oscillator = audioContext.createOscillator();
			const gainNode = audioContext.createGain();

			oscillator.connect(gainNode);
			gainNode.connect(audioContext.destination);

			oscillator.frequency.value = freq;
			oscillator.type = "square";

			const startAt = baseTime + startOffset;
			const fadeIn = 0.005;
			const fadeOut = 0.02;
			gainNode.gain.setValueAtTime(0, startAt);
			gainNode.gain.linearRampToValueAtTime(loudVolume, startAt + fadeIn);
			gainNode.gain.linearRampToValueAtTime(
				loudVolume,
				startAt + duration - fadeOut,
			);
			gainNode.gain.linearRampToValueAtTime(0, startAt + duration);

			oscillator.start(startAt);
			oscillator.stop(startAt + duration);
			activeOscillators.push(oscillator);
		}
	};

	// 最初のサイクルを即時スケジュール
	scheduleCycle(audioContext.currentTime);
	// 以降 cycleDuration ごとに次のサイクルを追加
	const intervalId = setInterval(() => {
		if (stopped) return;
		scheduleCycle(audioContext.currentTime);
	}, cycleDuration * 1000);

	return {
		stop: () => {
			if (stopped) return;
			stopped = true;
			clearInterval(intervalId);
			for (const osc of activeOscillators) {
				try {
					osc.stop();
				} catch {
					// 既に停止済みの場合は無視
				}
			}
			audioContext.close().catch(() => {});
		},
	};
};

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
		firstEventAlarmEnabled: false,
		firstEventAlarmMinutes: 30,
	});
	const [permission, setPermission] = useState<NotificationPermission>(
		typeof Notification !== "undefined" ? Notification.permission : "default",
	);
	const scheduledTimers = useRef<NodeJS.Timeout[]>([]);
	const [activeAlarm, setActiveAlarm] = useState<{
		event: CalendarEvent;
		minutesBefore: number;
	} | null>(null);
	const activeAlarmController = useRef<AlarmController | null>(null);

	const dismissAlarm = useCallback(() => {
		if (activeAlarmController.current) {
			activeAlarmController.current.stop();
			activeAlarmController.current = null;
		}
		setActiveAlarm(null);
	}, []);

	// テスト用: 実際のアラーム挙動（うるさい音のループ + モーダル）を試す
	const triggerTestAlarm = useCallback(() => {
		if (activeAlarmController.current) {
			activeAlarmController.current.stop();
			activeAlarmController.current = null;
		}
		if (settings.soundEnabled) {
			activeAlarmController.current = playLoudAlarmSound(settings.soundVolume);
		}
		setActiveAlarm({
			event: {
				summary: "（テスト）本日最初の予定",
				start: new Date(
					Date.now() + settings.firstEventAlarmMinutes * 60 * 1000,
				).toISOString(),
				end: new Date(
					Date.now() + (settings.firstEventAlarmMinutes + 60) * 60 * 1000,
				).toISOString(),
			},
			minutesBefore: settings.firstEventAlarmMinutes,
		});
	}, [
		settings.soundEnabled,
		settings.soundVolume,
		settings.firstEventAlarmMinutes,
	]);

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
				firstEventAlarmEnabled: parsed.firstEventAlarmEnabled || false,
				firstEventAlarmMinutes: parsed.firstEventAlarmMinutes || 30,
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
			if (eventStart <= now) return false;
			const preNotificationTime = new Date(
				eventStart.getTime() - settings.minutes * 60 * 1000,
			);
			const firstEventAlarmTime = new Date(
				eventStart.getTime() - settings.firstEventAlarmMinutes * 60 * 1000,
			);
			// いずれかの通知タイミングが未来なら対象に含める
			return (
				preNotificationTime > now ||
				firstEventAlarmTime > now ||
				settings.enableStartTime
			);
		});

		// 各日の最初のイベントを抽出（ローカル日付でグルーピング）
		const firstEventOfDay = new Map<string, CalendarEvent>();
		if (settings.firstEventAlarmEnabled) {
			for (const event of events) {
				const eventStart = new Date(event.start);
				const dateKey = `${eventStart.getFullYear()}-${eventStart.getMonth()}-${eventStart.getDate()}`;
				const existing = firstEventOfDay.get(dateKey);
				if (!existing || eventStart < new Date(existing.start)) {
					firstEventOfDay.set(dateKey, event);
				}
			}
		}

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

			// 各日の最初のイベントのアラーム
			if (settings.firstEventAlarmEnabled) {
				const eventStartDate = new Date(event.start);
				const dateKey = `${eventStartDate.getFullYear()}-${eventStartDate.getMonth()}-${eventStartDate.getDate()}`;
				const firstEvent = firstEventOfDay.get(dateKey);
				if (firstEvent && firstEvent.start === event.start) {
					const alarmTime = new Date(
						eventStart.getTime() - settings.firstEventAlarmMinutes * 60 * 1000,
					);
					const timeUntilAlarm = alarmTime.getTime() - now.getTime();
					if (timeUntilAlarm > 0 && timeUntilAlarm <= 24 * 60 * 60 * 1000) {
						const timerId = setTimeout(() => {
							// 既に鳴っているアラームがあれば停止してから新しいものを鳴らす
							if (activeAlarmController.current) {
								activeAlarmController.current.stop();
								activeAlarmController.current = null;
							}
							if (settings.soundEnabled) {
								activeAlarmController.current = playLoudAlarmSound(
									settings.soundVolume,
								);
							}
							setActiveAlarm({
								event,
								minutesBefore: settings.firstEventAlarmMinutes,
							});
							new Notification("本日最初の予定のアラーム", {
								body: `${settings.firstEventAlarmMinutes}分後に本日最初の予定「${event.summary}」が始まります`,
								icon: "/favicon.ico",
								tag: `first-event-alarm-${event.start}`,
								requireInteraction: true,
							});
						}, timeUntilAlarm);
						scheduledTimers.current.push(timerId);
					}
				}
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
			if (activeAlarmController.current) {
				activeAlarmController.current.stop();
				activeAlarmController.current = null;
			}
		};
	}, [settings, permission, scheduleNotifications]);

	return {
		settings,
		permission,
		saveSettings,
		requestPermission,
		scheduleNotifications,
		activeAlarm,
		dismissAlarm,
		triggerTestAlarm,
	};
};

export { playLoudAlarmSound };
