// カレンダー設定定数
export const CALENDAR_CONFIG = {
  // Google Calendar設定
  SCOPES: ["https://www.googleapis.com/auth/calendar"] as const,
  PRIMARY_CALENDAR_ID: "primary",

  // 生成カレンダー設定
  CALENDAR_NAME: "なありしごと",
  CALENDAR_DESCRIPTION: "なありがミーティングしてる時間",
  TIMEZONE: "Asia/Tokyo",
  TTL_HOURS: 1,

  // イベント設定
  EVENT_SUMMARY: "予定あり",
  EVENT_DESCRIPTION: "ミーティング中",

  // 時間範囲設定
  FUTURE_MONTHS: 1,
  MAX_EVENTS: 2500,
} as const;
