# Terraform - Workload Identity Federation Setup

このディレクトリには、GitHub Actions で Google Cloud に安全にアクセスするための Workload Identity Federation (WIF) の設定が含まれています。

## 概要

Workload Identity Federation を使用することで、サービスアカウントキーを GitHub Secrets に保存することなく、GitHub Actions から Google Cloud リソースにアクセスできます。

## セットアップ手順

### 1. 前提条件

- Terraform がインストールされていること
- Google Cloud CLI (`gcloud`) がインストールされていること
- 適切な権限を持つ GCP プロジェクト

### 2. Terraform の初期化と実行

```bash
cd terraform

# terraform.tfvars を作成
cp terraform.tfvars.example terraform.tfvars
# エディタで terraform.tfvars を編集し、実際の値を設定

# 初期化
terraform init

# プランの確認
terraform plan

# 適用
terraform apply
```

### 3. GitHub Secrets の設定

Terraform の出力に表示される値を GitHub リポジトリの Secrets に追加：

- `WIF_PROVIDER`: Workload Identity Provider のリソース名
- `WIF_SERVICE_ACCOUNT`: サービスアカウントのメールアドレス

### 4. カレンダーへのアクセス権限設定

作成されたサービスアカウントのメールアドレスを Google Calendar の設定で「閲覧権限」を付与してください。

## 作成されるリソース

- **Workload Identity Pool**: GitHub Actions 用の ID プール
- **Workload Identity Provider**: GitHub の OIDC トークンを検証するプロバイダー
- **Service Account**: カレンダーにアクセスするためのサービスアカウント
- **IAM Bindings**: 必要な権限の付与

## セキュリティ

- サービスアカウントキーは作成されません
- GitHub Actions の OIDC トークンを使用して認証
- 指定したリポジトリからのアクセスのみ許可

## トラブルシューティング

### 認証エラーが発生する場合

1. GitHub Secrets が正しく設定されているか確認
2. Terraform で作成したリソースが正常に作成されているか確認
3. GitHub Actions のログで詳細なエラーメッセージを確認

### Terraform エラーが発生する場合

1. GCP の認証が正しく設定されているか確認：
   ```bash
   gcloud auth application-default login
   ```
2. プロジェクト ID が正しいか確認
3. 必要な API が有効になっているか確認