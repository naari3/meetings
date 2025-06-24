# UI・UX設計書

## デザインシステム

### カラーパレット

#### プライマリーカラー
```css
/* ブルー系グラデーション */
--primary-50: #eff6ff;
--primary-100: #dbeafe;
--primary-200: #bfdbfe;
--primary-300: #93c5fd;
--primary-400: #60a5fa;
--primary-500: #3b82f6;  /* メインカラー */
--primary-600: #2563eb;
--primary-700: #1d4ed8;
--primary-800: #1e40af;
--primary-900: #1e3a8a;
```

#### セカンダリーカラー
```css
/* インディゴ系 */
--secondary-50: #eef2ff;
--secondary-100: #e0e7ff;
--secondary-200: #c7d2fe;
--secondary-300: #a5b4fc;
--secondary-400: #818cf8;
--secondary-500: #6366f1;
--secondary-600: #4f46e5;  /* アクセントカラー */
--secondary-700: #4338ca;
--secondary-800: #3730a3;
--secondary-900: #312e81;
```

#### 機能的カラー
```css
/* 成功 */
--success-500: #10b981;
--success-100: #d1fae5;

/* 警告 */
--warning-500: #f59e0b;
--warning-100: #fef3c7;

/* エラー */
--error-500: #ef4444;
--error-100: #fee2e2;

/* グレースケール */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
```

### タイポグラフィ

#### フォントファミリー
```css
/* メインフォント */
font-family: 'Inter', 'Noto Sans JP', system-ui, -apple-system, sans-serif;

/* 特徴的な設定 */
font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
text-rendering: optimizeLegibility;
```

#### フォントサイズ
```css
/* タイトル */
--text-4xl: 2.25rem;    /* 36px - メインタイトル */
--text-3xl: 1.875rem;   /* 30px - セクションタイトル */
--text-2xl: 1.5rem;     /* 24px - サブタイトル */
--text-xl: 1.25rem;     /* 20px - 大きいテキスト */

/* 本文 */
--text-lg: 1.125rem;    /* 18px - 大きい本文 */
--text-base: 1rem;      /* 16px - 標準本文 */
--text-sm: 0.875rem;    /* 14px - 小さい本文 */
--text-xs: 0.75rem;     /* 12px - キャプション */
```

#### フォントウェイト
```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
--font-black: 900;
```

### スペーシング

#### グリッドシステム
```css
/* 基本単位: 0.25rem (4px) */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

#### コンテナ幅
```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;
--container-max: 7xl; /* 80rem = 1280px */
```

### エレベーション（影）

```css
/* カードの影 */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
```

### ボーダー半径

```css
--radius-sm: 0.125rem;   /* 2px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-2xl: 1rem;      /* 16px */
--radius-3xl: 1.5rem;    /* 24px */
--radius-full: 9999px;   /* 完全な円 */
```

## レスポンシブデザイン

### ブレークポイント

```css
/* Tailwind CSS ブレークポイント */
/* sm */ @media (min-width: 640px)
/* md */ @media (min-width: 768px)
/* lg */ @media (min-width: 1024px)
/* xl */ @media (min-width: 1280px)
/* 2xl */ @media (min-width: 1536px)
```

### デバイス別レイアウト

#### モバイル (〜767px)
```css
/* 特徴 */
- 単一カラムレイアウト
- タッチ操作対応
- 縦スクロール中心
- 簡略化された情報表示

/* カレンダーグリッド */
.calendar-cell {
  min-height: 80px;
  padding: 0.25rem;
}

/* 統計カード */
.stats-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
```

#### タブレット (768px〜1023px)
```css
/* 特徴 */
- ハイブリッドレイアウト
- 適応的グリッド
- タッチとマウス両対応

/* カレンダーグリッド */
.calendar-cell {
  min-height: 100px;
  padding: 0.5rem;
}

/* 統計カード */
.stats-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
}
```

#### デスクトップ (1024px〜)
```css
/* 特徴 */
- マルチカラムレイアウト
- ホバーエフェクト
- 最大幅制限

/* カレンダーグリッド */
.calendar-cell {
  min-height: 120px;
  padding: 0.5rem;
}

/* 統計カード */
.stats-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  max-width: 1280px;
  margin: 0 auto;
}
```

## コンポーネント設計

### 1. ヘッダーコンポーネント

#### 構造
```tsx
<header className="text-center mb-10">
  <div className="icon-container">
    {/* アイコン */}
  </div>
  <h1 className="main-title">
    空き時間カレンダー
  </h1>
  <p className="subtitle">
    あなたの予定を美しいカレンダー形式で表示
  </p>
</header>
```

#### スタイル
```css
.icon-container {
  @apply inline-flex items-center justify-center 
         w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 
         rounded-2xl mb-4 shadow-lg;
}

.main-title {
  @apply text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 
         bg-clip-text text-transparent mb-3;
}

.subtitle {
  @apply text-gray-600 text-lg max-w-2xl mx-auto;
}
```

### 2. StatsCard コンポーネント

#### 構造
```tsx
<div className="stats-container">
  <div className="stats-header">
    <h2>ダッシュボード</h2>
    <p>あなたのスケジュールの概要</p>
  </div>
  <div className="stats-grid">
    {stats.map(stat => (
      <StatItem key={stat.id} {...stat} />
    ))}
  </div>
</div>
```

#### レスポンシブレイアウト
```css
.stats-container {
  @apply bg-white/80 backdrop-blur-sm rounded-2xl 
         shadow-xl border border-gray-100 p-8 mb-8;
}

.stats-grid {
  @apply flex flex-wrap justify-center gap-6 mb-8;
}

.stat-item {
  @apply relative overflow-hidden bg-white rounded-xl 
         border border-gray-200 p-6 hover:shadow-lg 
         transition-all duration-200 group
         w-full sm:w-auto sm:min-w-[200px] 
         sm:flex-1 sm:max-w-[240px];
}
```

### 3. CalendarGrid コンポーネント

#### 構造
```tsx
<div className="calendar-container">
  <div className="calendar-header">
    <h2>{currentYear}年 {monthNames[currentMonth]}</h2>
  </div>
  <div className="day-names-header">
    {dayNames.map(day => <div key={day}>{day}</div>)}
  </div>
  <div className="calendar-grid">
    {calendarDays.map(day => (
      <CalendarCell key={day.date} day={day} />
    ))}
  </div>
</div>
```

#### レスポンシブセル
```css
.calendar-cell {
  @apply min-h-[80px] sm:min-h-[120px] 
         border-r border-b border-gray-200 
         p-1 sm:p-2 bg-white hover:bg-gray-50 
         transition-colors;
}

/* 今日の日付 */
.calendar-cell.today {
  @apply bg-blue-50;
}

/* 他の月の日付 */
.calendar-cell.other-month {
  @apply bg-gray-50;
}
```

### 4. EventCard コンポーネント

#### 構造
```tsx
<div className="event-card">
  <div className="event-status">
    {/* ステータスバッジ */}
  </div>
  <div className="event-content">
    <div className="event-title">
      <div className="event-indicator" />
      <h3>{event.summary}</h3>
    </div>
    <div className="event-details">
      <div className="event-date">
        <Icon />
        <span>{formatDate(startDate)}</span>
      </div>
      <div className="event-time">
        <Icon />
        <span>{formatTime(startDate)} - {formatTime(endDate)}</span>
      </div>
    </div>
  </div>
</div>
```

#### ホバーエフェクト
```css
.event-card {
  @apply group relative bg-white border border-gray-200 
         rounded-xl p-4 sm:p-6 hover:shadow-lg 
         hover:border-blue-300 transition-all duration-200;
}

.event-title h3 {
  @apply text-base sm:text-lg font-semibold text-gray-900 
         group-hover:text-blue-600 transition-colors;
}
```

## アニメーション・トランジション

### 基本アニメーション

```css
/* フェードイン */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* スライドアップ */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* スケールイン */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

### トランジション設定

```css
/* ボタンホバー */
.button {
  @apply transition-all duration-200 ease-in-out;
}

/* カード */
.card {
  @apply transition-all duration-200 ease-in-out;
}

.card:hover {
  @apply shadow-lg scale-105;
}

/* アイコン */
.icon {
  @apply transition-transform duration-200 ease-in-out;
}

.group:hover .icon {
  @apply scale-110;
}
```

## インタラクション設計

### ホバーエフェクト

```css
/* カードホバー */
.card:hover {
  @apply shadow-lg border-blue-300;
}

/* ボタンホバー */
.button:hover {
  @apply bg-gray-50 text-gray-900;
}

/* アイコンホバー */
.icon-container:hover .icon {
  @apply scale-110;
}
```

### アクティブ状態

```css
/* 選択されたボタン */
.button.active {
  @apply bg-blue-600 text-white shadow-md;
}

/* フォーカス状態 */
.button:focus {
  @apply outline-none ring-2 ring-blue-500 ring-offset-2;
}
```

### ローディング状態

```css
/* スケルトンローダー */
.skeleton {
  @apply animate-pulse bg-gray-200 rounded;
}

/* スピナー */
.spinner {
  @apply animate-spin rounded-full border-4 
         border-blue-600 border-t-transparent;
}
```

## アクセシビリティ

### カラーコントラスト

```css
/* WCAG AA準拠のコントラスト比 */
/* 最小 4.5:1 (通常テキスト) */
/* 最小 3:1 (大きなテキスト) */

/* テキストカラー */
.text-primary { color: #1f2937; }    /* 15.7:1 */
.text-secondary { color: #4b5563; }  /* 7.6:1 */
.text-muted { color: #6b7280; }      /* 5.4:1 */
```

### フォーカス表示

```css
/* キーボードフォーカス */
.focusable:focus {
  @apply outline-none ring-2 ring-blue-500 ring-offset-2;
}

/* フォーカス時の視覚的フィードバック */
.button:focus-visible {
  @apply ring-2 ring-blue-500 ring-offset-2;
}
```

### セマンティック構造

```tsx
// 適切な見出し階層
<h1>空き時間カレンダー</h1>
<h2>ダッシュボード</h2>
<h3>今後の予定</h3>

// ARIAラベル
<button aria-label="カレンダー表示に切り替え">
  <CalendarIcon />
  カレンダー表示
</button>

// ロール指定
<div role="grid" aria-label="カレンダーグリッド">
  <div role="row">
    <div role="gridcell">1</div>
  </div>
</div>
```

## パフォーマンス最適化

### 画像最適化

```css
/* レスポンシブ画像 */
.responsive-image {
  @apply w-full h-auto;
  max-width: 100%;
  height: auto;
}

/* 遅延読み込み */
.lazy-image {
  loading: lazy;
}
```

### CSSの最適化

```css
/* Critical CSS の分離 */
/* Above-the-fold スタイルを優先読み込み */

/* 非クリティカルスタイルの遅延読み込み */
@media print {
  /* プリント用スタイル */
}
```

### フォント最適化

```css
/* フォント表示の最適化 */
@font-face {
  font-family: 'Inter';
  font-display: swap;
  src: url('/fonts/inter.woff2') format('woff2');
}
```

## ダークモード対応（将来対応）

```css
/* ダークモード変数 */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #111827;
    --bg-secondary: #1f2937;
    --text-primary: #f9fafb;
    --text-secondary: #e5e7eb;
    --border-color: #374151;
  }
}

/* ダークモードスタイル */
.dark {
  @apply bg-gray-900 text-gray-100;
}

.dark .card {
  @apply bg-gray-800 border-gray-700;
}
```