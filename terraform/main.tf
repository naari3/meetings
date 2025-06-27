terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = "naari3-calendar"
  region  = "asia-northeast1"
}

provider "google-beta" {
  project = "naari3-calendar"
  region  = "asia-northeast1"
}

# Enable required APIs
resource "google_project_service" "iam_credentials" {
  project = "naari3-calendar"
  service = "iamcredentials.googleapis.com"
}

resource "google_project_service" "calendar" {
  project = "naari3-calendar"
  service = "calendar-json.googleapis.com"
}

resource "google_project_service" "sts" {
  project = "naari3-calendar"
  service = "sts.googleapis.com"
}

# Create Workload Identity Pool
resource "google_iam_workload_identity_pool" "github_actions_pool" {
  provider                  = google-beta
  project                   = "naari3-calendar"
  workload_identity_pool_id = "github-actions-pool"
  display_name              = "GitHub Actions Pool"
  description               = "Identity pool for GitHub Actions Direct WIF"
  
  depends_on = [google_project_service.iam_credentials]
}

# Create Workload Identity Provider for GitHub Actions
resource "google_iam_workload_identity_pool_provider" "github_provider" {
  provider                           = google-beta
  project                            = "naari3-calendar"
  workload_identity_pool_id          = google_iam_workload_identity_pool.github_actions_pool.workload_identity_pool_id
  workload_identity_pool_provider_id = "github-actions-provider"
  display_name                       = "GitHub Actions Provider"
  description                        = "OIDC identity pool provider for GitHub Actions Direct WIF"

  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.actor"      = "assertion.actor"
    "attribute.repository" = "assertion.repository"
    "attribute.ref"        = "assertion.ref"
  }

  attribute_condition = "attribute.repository == \"naari3/naari3-meetings\""

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}

# Create Service Account for Calendar Access
resource "google_service_account" "calendar_sa" {
  account_id   = "calendar-access-sa"
  display_name = "Calendar Access Service Account"
  description  = "Service account for Google Calendar API access from GitHub Actions"
}

# Grant Calendar API access to the service account
resource "google_project_iam_member" "calendar_sa_viewer" {
  project = "naari3-calendar"
  role    = "roles/viewer"
  member  = "serviceAccount:${google_service_account.calendar_sa.email}"
}

# Allow the GitHub repository to impersonate the service account
resource "google_service_account_iam_member" "github_sa_impersonation" {
  service_account_id = google_service_account.calendar_sa.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github_actions_pool.name}/attribute.repository/naari3/naari3-meetings"
}

data "google_project" "project" {
  project_id = "naari3-calendar"
}