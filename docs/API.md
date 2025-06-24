# API仕様書

## Google Calendar API統合

### 認証設定

#### サービスアカウント認証
```typescript
// calendar-fetch.ts での認証設定
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/calendar.readonly']
});
```

#### 必要な権限
- `https://www.googleapis.com/auth/calendar.readonly` - カレンダー読み取り専用

### APIエンドポイント

#### カレンダーイベント取得
```
GET https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events
```

**パラメータ:**
- `calendarId`: カレンダーID（'primary' でメインカレンダー）
- `timeMin`: 取得開始日時（ISO 8601）
- `timeMax`: 取得終了日時（ISO 8601）
- `singleEvents`: true（繰り返しイベントを展開）
- `orderBy`: 'startTime'（開始時刻順でソート）

**レスポンス例:**
```json
{
  "items": [
    {
      "summary": "予定あり",
      "start": {
        "dateTime": "2025-06-24T07:30:00.000Z"
      },
      "end": {
        "dateTime": "2025-06-24T08:00:00.000Z"
      },
      "description": "ミーティング中"
    }
  ]
}
```

## 内部API

### CalendarEvent インターフェース

```typescript
interface CalendarEvent {
  summary: string;        // イベントタイトル
  start: string;         // 開始日時（ISO 8601形式）
  end: string;           // 終了日時（ISO 8601形式）
  description?: string;  // イベント詳細（オプション）
}
```

### データ変換処理

#### Google Calendar → 内部形式
```typescript
function transformEvent(gEvent: calendar_v3.Schema$Event): CalendarEvent {
  return {
    summary: gEvent.summary || '予定あり',
    start: gEvent.start?.dateTime || gEvent.start?.date || '',
    end: gEvent.end?.dateTime || gEvent.end?.date || '',
    description: gEvent.description
  };
}
```

## 生成ファイル仕様

### events.json
**場所**: `/dist/events.json`  
**形式**: JSON  
**用途**: Webアプリケーションでの読み込み

```json
{
  "events": [
    {
      "summary": "予定あり",
      "start": "2025-06-24T07:30:00.000Z",
      "end": "2025-06-24T08:00:00.000Z",
      "description": "ミーティング中"
    }
  ],
  "generatedAt": "2025-06-24T06:49:46.984Z"
}
```

### availability.ics
**場所**: `/dist/availability.ics`  
**形式**: iCalendar (RFC 5545)  
**用途**: 標準カレンダーアプリケーションでのインポート

```ics
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//sebbo.net//ical-generator//EN
NAME:なありしごと
X-WR-CALNAME:なありしごと
X-WR-CALDESC:なありがミーティングしてる時間
TIMEZONE-ID:Asia/Tokyo
X-WR-TIMEZONE:Asia/Tokyo
REFRESH-INTERVAL;VALUE=DURATION:PT1H
X-PUBLISHED-TTL:PT1H
BEGIN:VEVENT
UID:unique-event-id
SEQUENCE:0
DTSTAMP:20250624T154946
DTSTART:20250624T163000
DTEND:20250624T170000
SUMMARY:予定あり
DESCRIPTION:ミーティング中
END:VEVENT
END:VCALENDAR
```

## エラーハンドリング

### Google Calendar API エラー
```typescript
try {
  const response = await calendar.events.list(params);
  return response.data.items || [];
} catch (error) {
  console.error('Google Calendar API Error:', error);
  throw new Error(`Failed to fetch calendar events: ${error.message}`);
}
```

### 一般的なエラーコード
- `401 Unauthorized`: 認証情報が無効
- `403 Forbidden`: API使用量制限に達している
- `404 Not Found`: 指定されたカレンダーが見つからない
- `429 Too Many Requests`: レート制限に達している

## レート制限

### Google Calendar API制限
- **クエリ制限**: 1秒あたり100リクエスト
- **日次制限**: 1日あたり1,000,000リクエスト
- **使用量制限**: プロジェクトごとの制限あり

### 制限対策
- ビルド時の一括取得によりリアルタイム制限を回避
- 必要最小限のデータ取得
- エラー時の適切なリトライ処理

## セキュリティ考慮事項

### 認証情報の管理
- サービスアカウントキーの適切な保管
- 環境変数での機密情報管理
- 最小権限の原則適用

### データの扱い
- 個人情報の最小化
- ログでの機密情報出力防止
- クライアントサイドでの機密情報排除