# Security Policy

Report vulnerabilities privately to the repository owner. Do not open a public issue containing credentials, exploit details, private URLs, or personal data.

## Production controls

- Generated content must pass type checking and a full production build before promotion.
- Scheduled generation must not deploy production directly.
- Secrets must remain in GitHub Actions or deployment-provider secret stores.
- Workflow changes and content-pipeline changes require owner review.
- A test harness should be added before the project is promoted beyond release-candidate status.
