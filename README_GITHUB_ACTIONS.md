# GitHub Actions セットアップガイド

このプロジェクトは GitHub Actions で自動ビルド・デプロイが可能です。

## 必要な設定

### 1. サービスアカウントの作成

1. Google Cloud Console でサービスアカウントを作成
2. カレンダーAPIへの読み取り権限を付与
3. JSONキーファイルを生成

### 2. GitHub Secrets の設定

リポジトリの Settings > Secrets and variables > Actions で以下を追加：

- `GOOGLE_SERVICE_ACCOUNT_KEY`: サービスアカウントのJSONキーファイルの内容全体

### 3. GitHub Pages の有効化

1. Settings > Pages へ移動
2. Source を "GitHub Actions" に設定

## ワークフローの動作

`.github/workflows/build-and-deploy.yml` は以下のタイミングで実行されます：

- `main` ブランチへのプッシュ時
- 毎日午前9時（JST）
- 手動実行（Actions タブから）

## ビルドプロセス

1. サービスアカウント認証でGoogle Calendar APIに接続
2. カレンダーデータを取得して静的ファイルを生成
3. Viteでビルド
4. GitHub Pages にデプロイ

## トラブルシューティング

### 認証エラーが発生する場合

1. サービスアカウントに適切な権限があるか確認
2. Google Calendar でサービスアカウントのメールアドレスに閲覧権限を付与しているか確認
3. Secrets が正しく設定されているか確認

### ビルドが失敗する場合

1. Actions のログを確認
2. ローカルで `pnpm build` が成功するか確認
3. 依存関係のバージョンを確認