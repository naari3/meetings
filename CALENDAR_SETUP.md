# カレンダー設定ガイド

## カレンダーIDの取得方法

### 1. Google Calendar でカレンダーIDを確認

1. [Google Calendar](https://calendar.google.com) を開く
2. 左サイドバーで対象のカレンダーの「⋮」メニューをクリック
3. 「設定と共有」を選択
4. 「カレンダーの統合」セクションで「カレンダーID」を確認

### 2. カレンダーIDの形式

- **メインカレンダー**: `primary` または `your-email@gmail.com`
- **追加カレンダー**: `xxxxxxxxxxxxxxxxxx@group.calendar.google.com`
- **リソースカレンダー**: `domain.com_xxxxxxxxxx@resource.calendar.google.com`

## 設定方法

### 方法1: 環境変数で指定（ローカル開発）

`.env` ファイルを作成：
```bash
GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
```

### 方法2: GitHub Variables で指定（GitHub Actions）

1. リポジトリの Settings → Secrets and variables → Actions → Variables タブ
2. 「New repository variable」をクリック
3. Name: `GOOGLE_CALENDAR_ID`
4. Value: カレンダーID（例: `your-calendar-id@group.calendar.google.com`）

### 方法3: デフォルト値を使用

環境変数を設定しない場合、自動的に `primary`（メインカレンダー）が使用されます。

## サービスアカウントへの権限付与

どの方法を使用する場合でも、サービスアカウントにカレンダーへのアクセス権限を付与する必要があります：

1. Google Calendar で対象カレンダーの設定を開く
2. 「特定のユーザーとの共有」セクションで「ユーザーを追加」
3. サービスアカウントのメール（`github-actions-calendar@naari3-calendar.iam.gserviceaccount.com`）を追加
4. 権限を「予定の表示（すべての予定の詳細）」に設定

## 複数カレンダーの統合（将来の拡張）

現在は単一カレンダーのみサポートしていますが、将来的に複数カレンダーの統合も可能です。