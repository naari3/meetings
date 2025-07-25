# Google Calendar API 認証設定ガイド

このプロジェクトでは3つの認証方法をサポートしています：

## 1. サービスアカウント認証（推奨）

プロジェクト専用の認証で、ADCに影響を与えません。

### セットアップ手順：

1. Google Cloud Consoleでサービスアカウントを作成：
   ```bash
   gcloud iam service-accounts create gcal-sync-sa \
     --display-name="GCal Sync Service Account"
   ```

2. サービスアカウントキーを生成：
   ```bash
   gcloud iam service-accounts keys create service-account-key.json \
     --iam-account=gcal-sync-sa@YOUR-PROJECT-ID.iam.gserviceaccount.com
   ```

3. カレンダーへのアクセス権を付与：
   - Google Calendarの設定で、サービスアカウントのメールアドレスに対して「閲覧権限」を付与

4. 環境変数を設定：
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="./service-account-key.json"
   ```

## 2. OAuth2 認証

個人のGoogleアカウントで認証する場合に使用。

### セットアップ手順：

1. Google Cloud ConsoleでOAuth2クライアントIDを作成
2. 認証フローを実行してリフレッシュトークンを取得
3. `.env`ファイルに設定：
   ```
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   GOOGLE_REFRESH_TOKEN=your-refresh-token
   ```

## 3. Application Default Credentials (ADC)

環境変数を設定しない場合、自動的にADCが使用されます。

```bash
gcloud auth application-default login --scopes="https://www.googleapis.com/auth/calendar.readonly,https://www.googleapis.com/auth/cloud-platform"
```

## 認証の優先順位

1. `GOOGLE_APPLICATION_CREDENTIALS`（サービスアカウント）
2. OAuth2環境変数（`GOOGLE_CLIENT_ID`等）
3. Application Default Credentials

## セキュリティに関する注意

- `.env`ファイルと認証キーファイルは絶対にGitにコミットしないでください
- `.gitignore`に追加されていることを確認してください：
  ```
  .env
  service-account-key.json
  *.json
  ```