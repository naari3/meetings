# デプロイメントガイド

## 概要

このアプリケーションは静的サイトとしてデプロイされ、ビルド時にGoogle Calendar APIからデータを取得します。

## 前提条件

### 必要な環境
- Node.js 18以上
- Google Cloud Console アカウント
- Google Calendar API の有効化
- サービスアカウント認証情報

### Google Calendar API セットアップ

#### 1. Google Cloud Console設定
```bash
# 1. Google Cloud Console にアクセス
https://console.cloud.google.com/

# 2. 新しいプロジェクトを作成または既存プロジェクトを選択

# 3. Google Calendar API を有効化
APIs & Services > Library > Google Calendar API > Enable
```

#### 2. サービスアカウント作成
```bash
# 1. サービスアカウント作成
IAM & Admin > Service Accounts > Create Service Account

# 2. 権限設定
# 必要最小限の権限を付与

# 3. JSONキーをダウンロード
Actions > Create Key > JSON
```

#### 3. カレンダー共有設定
```bash
# Google Calendar で対象カレンダーを開く
# 設定 > 特定のユーザーとの共有
# サービスアカウントのメールアドレスを追加
# 権限: "イベントの詳細を表示"
```

## デプロイ環境別設定

### 1. Vercel デプロイ

#### 設定ファイル
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "functions": {},
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

#### 環境変数設定
```bash
# Vercel Dashboard で設定
GOOGLE_APPLICATION_CREDENTIALS_JSON='{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "...",
  "client_email": "...",
  "client_id": "...",
  "auth_uri": "...",
  "token_uri": "...",
  "auth_provider_x509_cert_url": "...",
  "client_x509_cert_url": "..."
}'
```

#### デプロイコマンド
```bash
# Vercel CLI使用
npm install -g vercel
vercel --prod

# または GitHub連携で自動デプロイ
```

### 2. Netlify デプロイ

#### 設定ファイル
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 環境変数設定
```bash
# Netlify Dashboard で設定
GOOGLE_APPLICATION_CREDENTIALS_JSON=[JSON文字列]
```

#### デプロイコマンド
```bash
# Netlify CLI使用
npm install -g netlify-cli
netlify deploy --prod --dir=dist

# または GitHub連携で自動デプロイ
```

### 3. GitHub Pages デプロイ

#### GitHub Actions設定
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build
        env:
          GOOGLE_APPLICATION_CREDENTIALS_JSON: ${{ secrets.GOOGLE_CREDENTIALS_JSON }}
          
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

#### リポジトリ設定
```bash
# 1. GitHub Repository Settings
Settings > Pages > Source: GitHub Actions

# 2. Secrets 設定
Settings > Secrets and variables > Actions
Secret name: GOOGLE_CREDENTIALS_JSON
Secret value: [JSON文字列]
```

### 4. AWS S3 + CloudFront デプロイ

#### S3バケット設定
```bash
# AWS CLI設定
aws configure

# S3バケット作成
aws s3 mb s3://your-bucket-name

# 静的ウェブサイトホスティング有効化
aws s3 website s3://your-bucket-name \
  --index-document index.html \
  --error-document index.html
```

#### CloudFront設定
```bash
# CloudFront Distribution作成
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

#### デプロイスクリプト
```bash
#!/bin/bash
# deploy-aws.sh

# ビルド
npm run build

# S3にアップロード
aws s3 sync dist/ s3://your-bucket-name --delete

# CloudFront キャッシュ無効化
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### 5. Firebase Hosting デプロイ

#### Firebase設定
```json
// firebase.json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

#### デプロイコマンド
```bash
# Firebase CLI インストール
npm install -g firebase-tools

# Firebase初期化
firebase init hosting

# デプロイ
npm run build
firebase deploy
```

## CI/CD パイプライン例

### GitHub Actions フルパイプライン
```yaml
name: Build, Test, and Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Run linting
        run: npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build application
        run: npm run build
        env:
          GOOGLE_APPLICATION_CREDENTIALS_JSON: ${{ secrets.GOOGLE_CREDENTIALS_JSON }}
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: dist/
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 環境変数管理

### 開発環境
```bash
# .env.local (ローカル開発用)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
```

### 本番環境
```bash
# 各プラットフォームの環境変数設定
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account",...}
```

### 認証情報の安全な管理
```typescript
// vite-plugin-gcal.ts での認証情報読み込み
const getCredentials = () => {
  // 環境変数から JSON 文字列を読み込み
  const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (credentialsJson) {
    return JSON.parse(credentialsJson);
  }
  
  // ローカル開発時はファイルから読み込み
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credentialsPath) {
    return JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
  }
  
  throw new Error('Google credentials not found');
};
```

## デプロイ後の確認事項

### 1. 機能確認
```bash
# アプリケーションの基本動作確認
- ページ読み込み
- イベントデータ表示
- カレンダービューとリストビューの切り替え
- レスポンシブデザイン確認
```

### 2. パフォーマンス確認
```bash
# Lighthouse等でのパフォーマンス測定
- Performance Score
- Accessibility Score
- Best Practices Score
- SEO Score
```

### 3. セキュリティ確認
```bash
# セキュリティチェック
- HTTPS通信確認
- 機密情報の漏洩確認
- CSP設定確認
```

## トラブルシューティング

### よくある問題と解決策

#### 1. Google Calendar API エラー
```bash
# 401 Unauthorized
- サービスアカウント認証情報を確認
- カレンダー共有設定を確認

# 403 Forbidden
- API使用量制限を確認
- 権限設定を確認

# 404 Not Found
- カレンダーIDを確認
- カレンダーの存在を確認
```

#### 2. ビルドエラー
```bash
# 環境変数未設定
export GOOGLE_APPLICATION_CREDENTIALS_JSON='...'

# Node.js バージョン不一致
nvm use 18

# 依存関係の問題
rm -rf node_modules package-lock.json
npm install
```

#### 3. デプロイエラー
```bash
# ビルド成果物確認
npm run build
ls -la dist/

# 権限確認
chmod +x deploy-script.sh

# ログ確認
# 各プラットフォームのログを確認
```

## メンテナンス

### 定期的なタスク
```bash
# 1. 依存関係の更新
npm audit
npm update

# 2. セキュリティ更新
npm audit fix

# 3. パフォーマンス監視
# アナリティクス確認
# エラーログ確認

# 4. API使用量確認
# Google Cloud Console での使用量確認
```

### バックアップ
```bash
# 設定ファイルのバックアップ
# 認証情報の安全な保管
# デプロイスクリプトのバージョン管理
```