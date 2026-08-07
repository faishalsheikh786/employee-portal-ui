# employee-portal-ui

React + TypeScript corporate employee portal.

## Why this repo exists

The frontend is independently deployable. It does not contain backend code, Terraform, AWS credentials, database passwords, or API secrets.

## Local setup

```bash
npm install
cp .env.example .env
npm run dev
```

Local backend defaults:
- Directory API: http://localhost:8001
- Workflow API: http://localhost:8002
- WebSocket: ws://localhost:8002

## Production deployment

GitHub Actions:
1. builds the Vite bundle,
2. authenticates to AWS using OIDC,
3. syncs `dist/` to a private S3 bucket,
4. invalidates CloudFront HTML.

Create these GitHub repository variables from Terraform outputs:
- `AWS_ROLE_ARN`
- `FRONTEND_BUCKET`
- `CLOUDFRONT_DISTRIBUTION_ID`

No secrets belong in Vite environment variables. Anything prefixed `VITE_` is shipped to the browser.

## Dependency-lock best practice

This starter does not include a generated `package-lock.json`. Run `npm install` once locally and commit the generated lock file. After that, change the GitHub workflow from `npm install` to `npm ci` for deterministic CI installs.
