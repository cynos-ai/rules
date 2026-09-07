# Security Rules

## Secrets and Sensitive Data

- Supply passwords, tokens, private keys, cookies, connection credentials, and other secrets only through project-approved secret stores, deployment secrets, or environment variables.
- Do not put secrets in source code, Git, ordinary configuration, sample data, test snapshots, URLs, logs, errors, reports, or API responses.
- Commit only variable names and nonfunctional placeholder values in sample configuration; before committing, check that `.env`, credential files, and generated artifacts have not entered Git.
- Keep only the information needed to diagnose issues in logs and errors; redact account information, personal data, request headers, and tool arguments.

## Input, Permissions, and Data

- Revalidate all external input inside the trusted boundary; do not rely solely on the frontend or AI prompts.
- Use parameterized interfaces for database and command calls; do not concatenate untrusted input.
- Verify identity and permissions on the server for sensitive operations, following least privilege.
- Guard file paths, archives, redirect URLs, webhooks, and uploads against out-of-bounds access and unintended execution.
- Do not use production data, real user data, or production credentials for ordinary development, testing, or evaluation.

## Errors and External Systems

- Authentication or authorization failures, data validation failures, and dependency failures must explicitly return failure, not fall back to success.
- Set reasonable timeouts and error handling for external calls; retries must avoid duplicate charges, duplicate creation, or data corruption.
- Provide confirmation, backup, or rollback paths for data deletion, migration, or irreversible external side effects.
- Enforce security boundaries through permissions, isolation, validation, and encryption; do not treat "the AI will follow the prompt" as a security control.

## When Risks Are Found

- Do not paste real credentials or private data into public issues, PRs, or chats.
- If a leak is suspected, first stop further propagation, revoke or rotate the credentials, then report through the project's designated private channel.
- Obtain explicit user confirmation before broadening permissions or disabling validation to fix a security issue.
