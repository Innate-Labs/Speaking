# Vercel Initial Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the current `Innate-Labs/Speaking` Next.js application to a public Vercel production URL and verify the deployed website.

**Architecture:** Vercel builds the repository root as a Next.js 16 application and hosts its pages, static assets, middleware, and Route Handlers. The standalone `ws-proxy.mjs` process is excluded, so the initial deployment intentionally does not provide speech transcription.

**Tech Stack:** Next.js 16.2.10, Node.js, npm, Vercel CLI 54.10.2, Vercel Hosting

## Global Constraints

- Deploy the current `main` branch without changing application behavior.
- Use the Vercel-generated production domain; do not configure a custom domain.
- Do not add `DASHSCOPE_API_KEY` or `DEEPSEEK_API_KEY` during this deployment.
- Do not treat login or speech transcription as acceptance criteria for this initial release.
- Do not expose credentials in command output, files, commits, or chat.

---

### Task 1: Authenticate and verify the deployable source

**Files:**
- Verify: `package.json`
- Verify: `package-lock.json`
- Generated locally and ignored by Git: `.vercel/`

**Interfaces:**
- Consumes: the repository root at `/Users/yishu/Speaking` and the approved deployment design.
- Produces: an authenticated Vercel CLI session and a fresh successful production build.

- [ ] **Step 1: Confirm the repository state**

Run:

```bash
git status --short --branch
git log -1 --oneline
```

Expected: `main` has no unstaged or uncommitted changes; the latest commit is the deployment documentation commit.

- [ ] **Step 2: Authenticate Vercel**

Run:

```bash
vercel login
vercel whoami
```

Expected: the device authorization page is approved by the user and `vercel whoami` prints the authenticated Vercel username.

- [ ] **Step 3: Rebuild the exact source being deployed**

Run:

```bash
npm run build
```

Expected: exit code `0`, `Compiled successfully`, and all application routes are listed.

### Task 2: Create and verify the production deployment

**Files:**
- Generated locally and ignored by Git: `.vercel/project.json`
- No application source files are modified.

**Interfaces:**
- Consumes: the authenticated CLI session and successful build from Task 1.
- Produces: a Vercel project, immutable deployment ID, and public production URL.

- [ ] **Step 1: Deploy to the production target**

Run:

```bash
PRODUCTION_URL="$(vercel deploy --prod --yes)"
test -n "$PRODUCTION_URL"
printf '%s\n' "$PRODUCTION_URL"
```

Expected: Vercel links or creates a project, builds successfully, marks the deployment Ready, and `PRODUCTION_URL` contains an HTTPS URL ending in `.vercel.app`. Keep this variable in the same execution shell for the remaining steps.

- [ ] **Step 2: Connect the Vercel project to the GitHub repository**

Run:

```bash
vercel git connect https://github.com/Innate-Labs/Speaking.git
```

Expected: the linked Vercel project reports that it is connected to `Innate-Labs/Speaking`; if the Vercel account lacks organization access, record that as a non-blocking limitation without changing GitHub permissions.

- [ ] **Step 3: Inspect deployment readiness**

Run:

```bash
vercel inspect "$PRODUCTION_URL" --wait --timeout 3m
```

Expected: deployment status is `Ready` and target is `production`.

- [ ] **Step 4: Smoke-test public pages**

Run:

```bash
curl --fail --silent --show-error --location --output /dev/null --write-out 'home=%{http_code}\n' "$PRODUCTION_URL/"
curl --fail --silent --show-error --location --output /dev/null --write-out 'login=%{http_code}\n' "$PRODUCTION_URL/login"
```

Expected: both commands print HTTP `200`.

- [ ] **Step 5: Smoke-test a deployed Route Handler**

Run:

```bash
curl --silent --show-error --request POST \
  --header 'content-type: application/json' \
  --data '{"phone":"invalid"}' \
  --write-out '\nstatus=%{http_code}\n' \
  "$PRODUCTION_URL/api/auth/send-otp"
```

Expected: JSON contains `手机号格式不正确` and the status is `400`, proving that the production API route is running without creating an OTP.

- [ ] **Step 6: Record the release state**

Run:

```bash
git status --short --branch
vercel inspect "$PRODUCTION_URL"
```

Expected: only ignored `.vercel/` metadata exists locally; the final handoff records the URL, deployment status, Git connection result, and the known login and speech limitations.
