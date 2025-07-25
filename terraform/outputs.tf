output "workload_identity_provider" {
  description = "Workload Identity Provider resource name"
  value       = google_iam_workload_identity_pool_provider.github_provider.name
}

output "service_account_email" {
  description = "Service Account email"
  value       = google_service_account.github_actions.email
}

output "setup_instructions" {
  description = "Instructions for setting up GitHub Actions"
  value = <<-EOT
    Add the following secrets to your GitHub repository:
    
    - WIF_PROVIDER: ${google_iam_workload_identity_pool_provider.github_provider.name}
    - WIF_SERVICE_ACCOUNT: ${google_service_account.github_actions.email}
    
    No service account keys are needed!
  EOT
}