# Employee Portal UI

Responsive React corporate employee portal with Amazon Cognito authentication and role-aware Employee, Manager and Admin workspaces.

## Authentication model

- Users register/sign in with email + password through Amazon Cognito.
- Email confirmation is required.
- Signup asks for a **requested role**: `EMPLOYEE`, `MANAGER`, or `ADMIN`.
- `custom:requested_role` records the request. It does **not** grant permissions.
- Effective privileged roles come from Cognito groups in the JWT `cognito:groups` claim.
- Users without a privileged group receive Employee access.
- Add approved managers/admins to Cognito groups `MANAGER` or `ADMIN`.

This avoids the security problem of allowing a browser to self-assign Admin rights.

## Local setup

1. Add Cognito resources to the Terraform repo using the supplied `cognito.tf` upgrade.
2. Run Terraform and get:

```bash
terraform output -raw cognito_user_pool_id
terraform output -raw cognito_user_pool_client_id
```

3. Copy `.env.example` to `.env` and fill those two values.
4. Ensure the FastAPI services run on ports 8001 and 8002.
5. Install and run:

```bash
npm install
npm run dev
```

Open `http://localhost:5173/login`.

## Link Cognito user to employee data

The UI matches the signed-in Cognito email to `employee_directory.employees.email`. Create an employee record with the same email so profile, leave and manager information can be resolved.

## Approve requested roles

A Manager/Admin request stays on Employee access until an administrator adds the Cognito user to the matching group.

Example:

```bash
aws cognito-idp admin-add-user-to-group \
  --user-pool-id YOUR_POOL_ID \
  --username user@company.com \
  --group-name MANAGER
```

or use `ADMIN` for approved administrators. The user should sign out and back in to receive the new group claim in their JWT.

## GitHub repository variables

Configure:

- `AWS_ROLE_ARN`
- `FRONTEND_BUCKET`
- `CLOUDFRONT_DISTRIBUTION_ID`
- `COGNITO_USER_POOL_ID`
- `COGNITO_USER_POOL_CLIENT_ID`

The pipeline injects the Cognito IDs at build time. These identifiers are not passwords/secrets.

## Security note

The frontend now sends the Cognito access token as `Authorization: Bearer <token>` on REST API requests. For complete production authorization, both FastAPI backends must validate the Cognito JWT and enforce roles on protected API operations. UI route protection alone is not a security boundary.
