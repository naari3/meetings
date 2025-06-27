output "workload_identity_provider" {
  description = "The full provider name to be used in GitHub Actions"
  value       = google_iam_workload_identity_pool_provider.github_provider.name
}

output "project_number" {
  description = "Google Cloud project number"
  value       = data.google_project.project.number
}

output "project_id" {
  description = "Google Cloud project ID"
  value       = "naari3-calendar"
}

output "github_repository" {
  description = "GitHub repository configured for Direct WIF"
  value       = "naari3/naari3-meetings"
}

output "pool_name" {
  description = "Workload Identity Pool name"
  value       = google_iam_workload_identity_pool.github_actions_pool.name
}