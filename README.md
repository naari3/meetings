# Google Calendar Sync - 空き時間カレンダー

Google Calendar APIを使用して予定を取得し、美しいWebアプリケーションとICSファイルで表示するモダンなカレンダー同期システムです。

## 🚀 概要

このプロジェクトは、Google Calendarから予定データを取得し、以下の機能を提供します：

- **モダンなWebアプリケーション**: React + TypeScript + Tailwind CSSで構築された美しいUI
- **レスポンシブデザイン**: デスクトップ、タブレット、モバイルに対応
- **デュアルビューシステム**: カレンダーグリッドビューとリストビューの切り替え
- **ICSファイル出力**: 標準的なカレンダーアプリケーションで読み込み可能なICSファイル生成
- **リアルタイムデータ同期**: Google Calendar APIからの最新データ取得

## 📋 機能一覧

### ✨ Webアプリケーション機能
- **ダッシュボード**: 予定統計の表示（総予定数、総時間、今日の予定、今後の予定）
- **カレンダー表示**: 月間カレンダーグリッドで予定を視覚的に表示
- **リスト表示**: 詳細な予定情報をリスト形式で表示
- **レスポンシブUI**: 全デバイス対応の美しいユーザーインターフェース
- **プログレッシブローディング**: 段階的なデータ読み込みとローディング状態

### 📅 カレンダー機能
- **Google Calendar API統合**: 認証済みアカウントからの予定データ取得
- **ICS形式エクスポート**: 標準カレンダー形式での出力
- **日本語対応**: 完全な日本語ローカライゼーション
- **タイムゾーン対応**: Asia/Tokyo対応

## 🛠 技術スタック

### フロントエンド
- **React 19.1.0**: モダンなUIライブラリ
- **TypeScript 5.0+**: 型安全な開発環境
- **Tailwind CSS 4.1+**: ユーティリティファーストCSS
- **Vite 6.3+**: 高速な開発サーバーとビルドツール

### バックエンド・API
- **Google APIs 126.0+**: Google Calendar API v3統合
- **ical-generator 9.0+**: ICSファイル生成

### 開発・ビルド
- **Node.js 18+**: 実行環境
- **PostCSS**: CSS前処理
- **Autoprefixer**: ブラウザー互換性

## 📁 プロジェクト構成

```
gcal-sync/
├── src/
│   ├── components/           # Reactコンポーネント
│   │   ├── CalendarGrid.tsx  # カレンダーグリッド表示
│   │   ├── EventCard.tsx     # 個別イベントカード
│   │   └── StatsCard.tsx     # 統計情報カード
│   ├── App.tsx              # メインアプリケーション
│   ├── calendar-fetch.ts    # Google Calendar API処理
│   ├── constants.ts         # 定数定義
│   ├── types.ts            # TypeScript型定義
│   ├── index.css           # グローバルスタイル
│   ├── main.tsx            # アプリケーションエントリーポイント
│   └── vite-plugin-gcal.ts # Viteプラグイン（カレンダーデータ取得）
├── dist/                   # ビルド成果物
│   ├── events.json         # 予定データ（JSON）
│   └── availability.ics    # カレンダーデータ（ICS）
├── public/                 # 静的ファイル
├── docs/                   # ドキュメント（必要に応じて作成）
└── 設定ファイル
    ├── package.json        # NPM設定
    ├── vite.config.ts      # Vite設定
    ├── tailwind.config.cjs # Tailwind設定
    ├── tsconfig.json       # TypeScript設定
    └── postcss.config.cjs  # PostCSS設定
```

## 🔧 セットアップ

### 1. 環境要件
- Node.js 18以上
- Google Cloud Consoleでのプロジェクト設定
- Google Calendar API有効化
- サービスアカウント認証情報

### 2. インストール
```bash
npm install
```

### 3. Google Calendar API設定
1. Google Cloud Consoleで新しいプロジェクトを作成
2. Google Calendar APIを有効化
3. サービスアカウントを作成し、JSON認証情報をダウンロード
4. 環境変数または認証情報ファイルを設定

### 4. 開発サーバー起動
```bash
npm run dev
```

### 5. プロダクションビルド
```bash
npm run build
```

### 6. プレビューサーバー
```bash
npm run preview
```

## 📊 データ形式

### CalendarEvent型定義
```typescript
interface CalendarEvent {
  summary: string;        // 予定タイトル
  start: string;         // 開始日時（ISO 8601形式）
  end: string;           // 終了日時（ISO 8601形式）
  description?: string;  // 予定詳細（オプション）
}
```

### 出力ファイル
- **events.json**: Web アプリケーション用JSON形式データ
- **availability.ics**: 標準カレンダーアプリケーション用ICS形式ファイル

## 🎨 UI・UX特徴

### デザインシステム
- **カラーパレット**: ブルー系グラデーション中心
- **タイポグラフィ**: Inter + Noto Sans JP フォント
- **アニメーション**: スムーズなトランジションとホバーエフェクト
- **グラスモーフィズム**: 半透明背景とブラー効果

### レスポンシブデザイン
- **モバイル**: 320px-768px（単一カラム、簡略表示）
- **タブレット**: 768px-1024px（適応的レイアウト）
- **デスクトップ**: 1024px+（最大幅制限、中央配置）

### アクセシビリティ
- セマンティックHTML構造
- キーボードナビゲーション対応
- 適切なコントラスト比
- スクリーンリーダー対応

## 🔄 データフロー

1. **ビルド時**: Viteプラグインが Google Calendar API を呼び出し
2. **データ取得**: 認証済みアカウントから予定データを取得
3. **変換処理**: 内部形式への変換とフィルタリング
4. **ファイル生成**: JSON とICS形式での出力
5. **Webアプリ**: ビルド済みJSONデータの読み込みと表示

## 🚀 デプロイメント

### 静的サイトデプロイ
```bash
npm run build
# dist/ フォルダを静的ホスティングサービスにデプロイ
```

### 対応プラットフォーム
- Vercel
- Netlify  
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

## 📈 パフォーマンス

### 最適化施策
- **コード分割**: 自動的なチャンク分割
- **Tree Shaking**: 未使用コードの除去
- **画像最適化**: 自動WebP変換とレスポンシブ画像
- **CSS最適化**: PurgeCSS による未使用スタイル除去
- **Gzip圧縮**: 自動的な圧縮最適化

### 現在のバンドルサイズ
- **CSS**: ~4.5KB (gzipped: ~1.6KB)
- **JavaScript**: ~203KB (gzipped: ~63KB)
- **JSON データ**: ~22KB (gzipped: ~1.1KB)

## 🧪 開発

### 開発コマンド
```bash
npm run dev      # 開発サーバー起動
npm run build    # プロダクションビルド
npm run preview  # ビルド結果プレビュー
npm run serve    # プレビューサーバー（ブラウザ自動起動）
```

### 開発時の注意点
- Google Calendar API のレート制限に注意
- ビルド時にカレンダーデータを取得するため、認証情報が必要
- 開発環境では静的JSONファイルを使用

## 🔒 セキュリティ

### 認証・認可
- サービスアカウント認証使用
- API キーの環境変数管理
- 最小権限の原則適用

### データ保護
- 個人情報の最小化
- ビルド時のデータ変換
- クライアントサイドでの機密情報なし

## 📝 ライセンス

このプロジェクトは MIT ライセンスの下で提供されています。

## 🤝 コントリビューション

1. フォークを作成
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📞 サポート

問題や質問がある場合は、GitHubのIssuesページでお知らせください。

---

**最終更新**: 2025年6月24日  
**バージョン**: 1.0.0