# アーキテクチャ設計書

## システム全体構成

```
┌─────────────────────────────────────────────────────────────┐
│                    Google Calendar Sync                     │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Frontend    │    │   Build      │    │   Output     │  │
│  │   (React)     │◄───┤   Process    │◄───┤   Google     │  │
│  │               │    │   (Vite)     │    │   Calendar   │  │
│  └───────────────┘    └──────────────┘    └──────────────┘  │
│         │                     │                             │
│         │              ┌──────────────┐                     │
│         └──────────────►│   Static     │                     │
│                        │   Files      │                     │
│                        │ (JSON/ICS)   │                     │
│                        └──────────────┘                     │
└─────────────────────────────────────────────────────────────┘
```

## レイヤー構造

### 1. プレゼンテーション層 (Presentation Layer)
**場所**: `src/components/`, `src/App.tsx`

```typescript
// コンポーネント階層
App.tsx
├── StatsCard.tsx          // 統計情報表示
├── ViewToggle             // 表示切り替え
├── CalendarGrid.tsx       // カレンダー表示
│   └── CalendarCell       // 個別日付セル
│       └── EventBadge     // イベントバッジ
└── EventList              // リスト表示
    └── EventCard.tsx      // 個別イベントカード
```

**責務**:
- ユーザーインターフェース
- ユーザーインタラクション処理
- 状態管理（ローカル状態）
- レスポンシブデザイン

### 2. ビジネスロジック層 (Business Logic Layer)
**場所**: `src/calendar-fetch.ts`, `src/vite-plugin-gcal.ts`

```typescript
// データ処理フロー
Google Calendar API → Transform → Validate → Format → Output
```

**責務**:
- Google Calendar APIとの連携
- データ変換・正規化
- ビジネスルールの適用
- エラーハンドリング

### 3. データアクセス層 (Data Access Layer)
**場所**: `dist/events.json`, `dist/availability.ics`

**責務**:
- 静的ファイルとしてのデータ永続化
- 複数形式でのデータ提供
- キャッシュ機能

## コンポーネント設計

### React コンポーネント構造

```typescript
// 基本コンポーネント型
interface ComponentProps {
  events: CalendarEvent[];
  // その他のprops
}

// 状態管理パターン
const [state, setState] = useState<StateType>(initialState);
```

### 状態管理設計

```typescript
// アプリケーション状態
interface AppState {
  events: CalendarEvent[];
  loading: boolean;
  view: 'list' | 'calendar';
  generatedAt: string;
}

// ローカル状態（各コンポーネント）
interface LocalState {
  selectedDate?: Date;
  hoveredEvent?: CalendarEvent;
  // etc.
}
```

## データフロー設計

### 1. ビルド時データフロー

```
┌─────────────────────┐
│   npm run build     │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│   Vite Build        │
│   Plugin Execution  │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│   Google Calendar   │
│   API Call          │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│   Data Transform    │
│   & Validation      │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│   Generate Files    │
│   (JSON + ICS)      │
└─────────────────────┘
```

### 2. ランタイムデータフロー

```
┌─────────────────────┐
│   User Access       │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│   Load Static JSON  │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│   React State       │
│   Management        │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│   Component Render  │
└─────────────────────┘
```

## 設計原則

### 1. 単一責任原則 (Single Responsibility Principle)
- 各コンポーネントは単一の責務を持つ
- データ取得とUI表示を分離
- ビジネスロジックとプレゼンテーションを分離

### 2. 開放閉鎖原則 (Open-Closed Principle)
- 新しい表示形式の追加が容易
- 既存コードの変更なしに機能拡張可能
- プラグインアーキテクチャの採用

### 3. 依存性逆転原則 (Dependency Inversion Principle)
- 抽象に依存し、具象に依存しない
- インターフェースベースの設計
- 疎結合な設計

## パフォーマンス設計

### 1. ビルド時最適化

```typescript
// Tree Shaking
import { specificFunction } from 'library';

// Code Splitting
const LazyComponent = lazy(() => import('./LazyComponent'));

// Bundle Analysis
// npm run build --analyze
```

### 2. ランタイム最適化

```typescript
// メモ化
const MemoizedComponent = memo(ExpensiveComponent);

// 条件付きレンダリング
{shouldRender && <ExpensiveComponent />}

// Virtual Scrolling（大量データ時）
// 必要に応じて実装
```

### 3. ネットワーク最適化

```typescript
// 静的ファイル配信
// CDN利用推奨
// Gzip圧縮
// キャッシュヘッダー設定
```

## セキュリティ設計

### 1. 認証・認可

```typescript
// サービスアカウント認証
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/calendar.readonly']
});
```

### 2. データ保護

```typescript
// 最小権限データ取得
const minimalEventData = {
  summary: event.summary || '予定あり',
  start: event.start?.dateTime || event.start?.date,
  end: event.end?.dateTime || event.end?.date,
  // 機密情報は除外
};
```

### 3. 入力検証

```typescript
// 型安全性
interface CalendarEvent {
  summary: string;
  start: string;
  end: string;
  description?: string;
}

// バリデーション
function validateEvent(event: unknown): CalendarEvent {
  // 型ガードによる検証
  if (!isValidEvent(event)) {
    throw new Error('Invalid event data');
  }
  return event;
}
```

## 拡張性設計

### 1. 新しい表示形式の追加

```typescript
// 新しいビューコンポーネント
interface ViewComponent {
  name: string;
  component: React.ComponentType<ViewProps>;
  icon: React.ComponentType;
}

const views: ViewComponent[] = [
  { name: 'calendar', component: CalendarGrid, icon: CalendarIcon },
  { name: 'list', component: EventList, icon: ListIcon },
  // 新しいビューを追加
  { name: 'timeline', component: Timeline, icon: TimelineIcon }
];
```

### 2. 新しいデータソースの追加

```typescript
// データプロバイダーインターフェース
interface DataProvider {
  fetchEvents(): Promise<CalendarEvent[]>;
  name: string;
}

// Google Calendar プロバイダー
class GoogleCalendarProvider implements DataProvider {
  async fetchEvents(): Promise<CalendarEvent[]> {
    // Google Calendar API実装
  }
}

// 他のプロバイダーも同様に実装可能
```

### 3. プラグインシステム

```typescript
// Viteプラグインインターフェース
interface CalendarPlugin {
  name: string;
  setup(config: PluginConfig): void;
  transform?(data: CalendarEvent[]): CalendarEvent[];
}
```

## 開発・デプロイ設計

### 1. 開発環境

```bash
# 開発サーバー
npm run dev     # Hot reload + TypeScript check

# ビルド
npm run build   # Production build + API fetch

# プレビュー
npm run preview # Local preview server
```

### 2. CI/CD パイプライン

```yaml
# GitHub Actions例
name: Build and Deploy
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Build application
        run: npm run build
        env:
          GOOGLE_APPLICATION_CREDENTIALS: ${{ secrets.GOOGLE_CREDENTIALS }}
      - name: Deploy to hosting
        # デプロイ処理
```

### 3. モニタリング

```typescript
// エラートラッキング
window.addEventListener('error', (error) => {
  // エラーログ送信
  console.error('Application Error:', error);
});

// パフォーマンス監視
performance.mark('app-start');
// アプリケーション処理
performance.mark('app-end');
performance.measure('app-load', 'app-start', 'app-end');
```

## テスト設計

### 1. 単体テスト

```typescript
// コンポーネントテスト
describe('EventCard', () => {
  it('should render event information correctly', () => {
    const mockEvent = {
      summary: 'Test Event',
      start: '2025-06-24T10:00:00.000Z',
      end: '2025-06-24T11:00:00.000Z'
    };
    render(<EventCard event={mockEvent} />);
    // アサーション
  });
});
```

### 2. 統合テスト

```typescript
// API統合テスト
describe('Calendar API Integration', () => {
  it('should fetch and transform events correctly', async () => {
    const events = await fetchCalendarEvents();
    expect(events).toHaveLength(greaterThan(0));
    expect(events[0]).toMatchObject({
      summary: expect.any(String),
      start: expect.any(String),
      end: expect.any(String)
    });
  });
});
```

### 3. E2Eテスト

```typescript
// Playwright/Cypress例
describe('Calendar Application', () => {
  it('should load and display events', () => {
    cy.visit('/');
    cy.get('[data-testid="calendar-grid"]').should('be.visible');
    cy.get('[data-testid="event-card"]').should('have.length.at.least', 1);
  });
});
```