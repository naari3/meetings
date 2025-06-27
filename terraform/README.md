# Google Cloud Terraform Configuration

このTerraform設定は、GitHub ActionsからDirect Workload Identity Federationを使用してGoogle Calendar APIにアクセスするために必要なGoogle Cloudリソースを作成します。

## 前提条件

1. Google Cloudプロジェクトが作成済み
2. Terraformがインストール済み
3. `gcloud` CLIがインストール・認証済み

## セットアップ

**Terraformの実行**
```bash
terraform init
terraform plan
terraform apply
```

設定値はすべてハードコーディングされているため、terraform.tfvarsファイルは不要です。

## 作成されるリソース

- **Workload Identity Pool**: GitHub Actions用の認証プール
- **Workload Identity Provider**: GitHubのOIDCプロバイダー設定
- **IAM Bindings**: GitHub repositoryに直接Calendar APIアクセス権限を付与
- **API有効化**: 必要なGoogle Cloud APIの有効化

## GitHub Actions設定

Terraform適用後、以下の設定でDirect Workload Identity Federationを使用します：

```yaml
- name: Authenticate to Google Cloud
  uses: google-github-actions/auth@v2
  with:
    workload_identity_provider: ${{ secrets.WIF_PROVIDER }}
```

必要なGitHub Secrets:
- `WIF_PROVIDER`: terraform outputの`workload_identity_provider`の値

## Direct Workload Identity Federationについて

Direct WIFの特徴：
- サービスアカウントを経由せず、GitHub repositoryに直接リソースアクセス権を付与
- principalSetを使用してWorkload Identity Pool経由でIAMロールを付与
- より直接的で安全な認証方式

## 出力値の確認

```bash
terraform output
```