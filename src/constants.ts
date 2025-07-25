// カレンダー設定定数
export const CALENDAR_CONFIG = {
  // Google Calendar設定
  SCOPES: ["https://www.googleapis.com/auth/calendar.readonly"] as const,
  CALENDAR_IDS: (process.env.GOOGLE_CALENDAR_IDS || "primary").split(",").map(id => id.trim()),
  
  // 匿名化しないカレンダーのリスト（カンマ区切り）
  PUBLIC_GOOGLE_CALENDAR_IDS: (process.env.PUBLIC_GOOGLE_CALENDAR_IDS || "").split(",").map(id => id.trim()).filter(id => id),

  // 生成カレンダー設定
  CALENDAR_NAME: "なありみーてぃんぐ",
  CALENDAR_DESCRIPTION: "なありがミーティングしてる時間",
  TIMEZONE: "Asia/Tokyo",
  TTL_HOURS: 1,

  // イベント設定（匿名化時）
  EVENT_SUMMARY: "予定あり",
  EVENT_DESCRIPTION: "ミーティング中",

  // 時間範囲設定
  FUTURE_MONTHS: 1,
  MAX_EVENTS: 2500,
} as const;
