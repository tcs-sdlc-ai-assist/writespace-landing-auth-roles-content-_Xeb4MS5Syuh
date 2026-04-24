# Deployment Guide

This document covers deployment, hosting configuration, CI/CD, troubleshooting, and rollback procedures for the WriteSpace blogging platform.

---

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Build Configuration](#build-configuration)
- [Vercel Deployment](#vercel-deployment)
  - [Option 1: Deploy via Vercel Dashboard (Git Integration)](#option-1-deploy-via-vercel-dashboard-git-integration)
  - [Option 2: Deploy via Vercel CLI](#option-2-deploy-via-vercel-cli)
- [SPA Rewrite Configuration](#spa-rewrite-configuration)
- [Environment Variables](#environment-variables)
- [CI/CD Notes](#cicd-notes)
- [Troubleshooting](#troubleshooting)
  - [Direct URL Access Returns 404](#direct-url-access-returns-404)
  - [Blank Page After Deployment](#blank-page-after-deployment)
  - [Styles Missing in Production](#styles-missing-in-production)
  - [localStorage Not Persisting](#localstorage-not-persisting)
- [Rollback Procedures](#rollback-procedures)
  - [Rollback via Vercel Dashboard](#rollback-via-vercel-dashboard)
  - [Rollback via Vercel CLI](#rollback-via-vercel-cli)
  - [Manual Rollback via Git](#manual-rollback-via-git)
- [Production Checklist](#production-checklist)

---

## Overview

WriteSpace is a fully client-side single-page application (SPA) built with **React 18+**, **Vite 5**, and **Tailwind CSS 3**. It requires no backend server, no database, and no environment variables. All data is persisted in the browser's `localStorage`.

The recommended hosting platform is **Vercel**, which provides automatic builds, instant deployments, and a global CDN. The project includes a pre-configured `vercel.json` file that handles SPA routing out of the box.

---

## Prerequisites

Before deploying, ensure you have the following:

- **Node.js** 16 or higher installed locally
- **npm** 7 or higher installed locally
- A **Vercel account** (free tier is sufficient) — [Sign up at vercel.com](https://vercel.com)
- (Optional) **Vercel CLI** installed globally:

  ```bash
  npm install -g vercel
  ```

- The project builds successfully on your local machine:

  ```bash
  npm install
  npm run build
  ```

  Verify that the `dist/` directory is created and contains `index.html` along with the bundled assets.

---

## Build Configuration

WriteSpace uses Vite as its build tool. The relevant build settings are:

| Setting | Value |
|---|---|
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |
| **Dev Command** | `npm run dev` |
| **Framework** | Vite |
| **Node.js Version** | 16+ |

These values are defined in `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

To preview the production build locally before deploying:

```bash
npm run build
npm run preview
```

The preview server will start at `http://localhost:4173` by default.

---

## Vercel Deployment

### Option 1: Deploy via Vercel Dashboard (Git Integration)

This is the recommended approach for teams and ongoing projects. Vercel will automatically deploy every push to your main branch.

1. **Push your code** to a Git repository (GitHub, GitLab, or Bitbucket).

2. **Log in** to the [Vercel Dashboard](https://vercel.com/dashboard).

3. Click **"Add New…"** → **"Project"**.

4. **Import** your Git repository from the list. If it doesn't appear, click "Adjust GitHub App Permissions" to grant Vercel access.

5. **Configure the project settings.** Vercel should auto-detect the Vite framework. Verify the following:

   | Setting | Value |
   |---|---|
   | Framework Preset | Vite |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |
   | Install Command | `npm install` |

6. Click **"Deploy"**. Vercel will install dependencies, run the build, and deploy the output to its global CDN.

7. Once complete, you'll receive a production URL (e.g., `https://your-project.vercel.app`). Your site is live.

### Option 2: Deploy via Vercel CLI

For quick one-off deployments or when you prefer working from the terminal:

1. **Install the Vercel CLI** (if not already installed):

   ```bash
   npm install -g vercel
   ```

2. **Authenticate** with your Vercel account:

   ```bash
   vercel login
   ```

3. **Deploy a preview** (staging) build:

   ```bash
   vercel
   ```

   The CLI will prompt you to link the project to your Vercel account. Accept the defaults or configure as needed. This creates a unique preview URL for testing.

4. **Deploy to production**:

   ```bash
   vercel --prod
   ```

   This publishes the build to your production domain.

5. **Verify** the deployment by visiting the URL printed in the terminal output.

---

## SPA Rewrite Configuration

WriteSpace uses React Router's `BrowserRouter` for client-side routing. This means routes like `/blogs`, `/admin`, and `/blog/:id` are handled entirely in the browser — they don't correspond to actual files on the server.

Without proper server configuration, directly navigating to any route other than `/` (e.g., refreshing the page on `/blogs`) would return a 404 error because the server looks for a file at that path and finds nothing.

The `vercel.json` file at the project root solves this by rewriting all requests to `index.html`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**How it works:**

1. A user navigates to `https://your-app.vercel.app/admin`.
2. Vercel receives the request for `/admin`.
3. The rewrite rule matches `/(.*)`and serves `/index.html` instead.
4. The browser loads the React application.
5. React Router reads the URL (`/admin`) and renders the correct component (`AdminDashboard`).

**Important:** This file must remain in the project root. Do not remove or rename it. If you move to a different hosting provider, you will need to configure equivalent rewrite rules for that platform.

### Rewrite Rules for Other Hosting Providers

If you deploy to a platform other than Vercel, here are equivalent configurations:

**Netlify** — Create a `public/_redirects` file:

```
/*    /index.html   200
```

**Nginx** — Add to your server block:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

**Apache** — Create a `.htaccess` file in the build output directory:

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

---

## Environment Variables

**No environment variables are required.**

WriteSpace is a fully client-side application. All data (posts, users, sessions) is stored in the browser's `localStorage`. There is no backend API, no database connection string, and no secret keys to configure.

The following `localStorage` keys are used at runtime:

| Key | Description |
|---|---|
| `writespace_posts` | Array of blog post objects |
| `writespace_users` | Array of registered user objects |
| `writespace_session` | Current authenticated user session |

A default admin account is hardcoded in the application source (`src/utils/auth.js`) and is always available:

| Field | Value |
|---|---|
| **Username** | `admin` |
| **Password** | `adminpass` |

If you need to change the default admin credentials, update the `ADMIN_CREDENTIALS` object in `src/utils/auth.js` and redeploy.

---

## CI/CD Notes

### Automatic Deployments from Git

When your repository is connected to Vercel via the dashboard (Option 1), Vercel automatically sets up CI/CD:

- **Production deployments** are triggered on every push to the **main** branch (or whichever branch you designate as the production branch in Vercel project settings).
- **Preview deployments** are triggered on every push to any other branch and on every pull request. Each preview deployment gets a unique URL for testing.
- **Build logs** are available in the Vercel dashboard under your project's "Deployments" tab.

### Build Process

On each deployment, Vercel runs the following steps:

1. `npm install` — Installs all dependencies from `package.json`.
2. `npm run build` — Runs `vite build`, which:
   - Compiles all JSX files via `@vitejs/plugin-react`.
   - Processes Tailwind CSS via PostCSS (configured in `postcss.config.js`).
   - Bundles and minifies all assets into the `dist/` directory.
3. The contents of `dist/` are deployed to Vercel's global CDN.

### Branch Protection Recommendations

For team workflows, consider the following:

- Protect the `main` branch and require pull request reviews before merging.
- Use preview deployments to test changes before they reach production.
- Review the Vercel build logs if a deployment fails — the error output will indicate whether the issue is in dependency installation or the build step.

### Build Caching

Vercel caches `node_modules` between deployments to speed up builds. If you encounter stale dependency issues, you can clear the build cache:

1. Go to your project in the Vercel dashboard.
2. Navigate to **Settings** → **General**.
3. Scroll to **Build & Development Settings**.
4. Click **"Clear Build Cache and Redeploy"** (available under the latest deployment's options menu).

---

## Troubleshooting

### Direct URL Access Returns 404

**Symptom:** Navigating directly to a route like `/blogs` or `/admin` (or refreshing the page on one of these routes) returns a 404 page.

**Cause:** The server is looking for a file at that path instead of serving `index.html`.

**Solution:**

1. Verify that `vercel.json` exists in the project root with the correct rewrite rule:

   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

2. Ensure `vercel.json` is committed to your repository and not listed in `.gitignore`.

3. Redeploy the project. If using the CLI:

   ```bash
   vercel --prod
   ```

4. If deploying to a non-Vercel platform, configure the equivalent rewrite rules as described in the [SPA Rewrite Configuration](#spa-rewrite-configuration) section.

### Blank Page After Deployment

**Symptom:** The deployed site loads but shows a blank white page with no content.

**Cause:** This is typically caused by incorrect asset paths or a build error.

**Solution:**

1. Open the browser's developer console (F12 → Console tab) and check for JavaScript errors.

2. Verify the build completes without errors locally:

   ```bash
   npm run build
   ```

3. Check that `index.html` in the `dist/` directory references the correct script path. Vite should output something like:

   ```html
   <script type="module" src="/assets/index-XXXXXXXX.js"></script>
   ```

4. Ensure `vite.config.js` does not have a custom `base` path set. The default (`/`) is correct for Vercel root deployments:

   ```js
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
   })
   ```

5. If deploying to a subdirectory (e.g., `https://example.com/blog/`), you would need to set `base: '/blog/'` in `vite.config.js`. This is **not** needed for standard Vercel deployments.

### Styles Missing in Production

**Symptom:** The application loads and functions correctly, but Tailwind CSS styles are missing or incomplete.

**Cause:** Tailwind's content purging may not be scanning all source files.

**Solution:**

1. Verify that `tailwind.config.js` includes all source file paths in the `content` array:

   ```js
   content: [
     "./index.html",
     "./src/**/*.{js,jsx}",
   ],
   ```

2. Ensure `postcss.config.js` is present and correctly configured:

   ```js
   export default {
     plugins: {
       tailwindcss: {},
       autoprefixer: {},
     },
   }
   ```

3. Verify that `src/index.css` contains the Tailwind directives:

   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

4. Rebuild and redeploy:

   ```bash
   npm run build
   vercel --prod
   ```

### localStorage Not Persisting

**Symptom:** Data (posts, users, sessions) is lost between page loads or after closing the browser.

**Cause:** This is a browser-level issue, not a deployment issue.

**Possible reasons:**

- The browser is in **private/incognito mode**, which clears `localStorage` when the window is closed.
- The user has **disabled localStorage** in browser settings.
- A browser extension is clearing storage data.
- The user manually cleared site data via browser settings.

**Solution:**

- Inform users that WriteSpace requires `localStorage` to be enabled and that private browsing mode may cause data loss.
- This is an inherent limitation of client-side-only storage. For persistent data across devices and browsers, a backend database would be required (out of scope for this project).

---

## Rollback Procedures

If a deployment introduces a bug or breaking change, you can quickly roll back to a previous working version.

### Rollback via Vercel Dashboard

This is the fastest and recommended approach:

1. Log in to the [Vercel Dashboard](https://vercel.com/dashboard).
2. Select your WriteSpace project.
3. Navigate to the **"Deployments"** tab.
4. Find the last known working deployment in the list. Each deployment shows the commit message, branch, and timestamp.
5. Click the **three-dot menu (⋯)** on the right side of that deployment.
6. Select **"Promote to Production"**.
7. Confirm the action. The selected deployment will immediately become the live production version.

No rebuild is required — Vercel serves the previously built artifacts directly.

### Rollback via Vercel CLI

1. List recent deployments:

   ```bash
   vercel ls
   ```

   This displays a list of deployments with their URLs and timestamps.

2. Identify the deployment URL of the last working version (e.g., `https://writespace-abc123.vercel.app`).

3. Promote that deployment to production:

   ```bash
   vercel promote <deployment-url>
   ```

   Replace `<deployment-url>` with the full URL from step 2.

### Manual Rollback via Git

If you need to revert the source code itself:

1. Identify the last working commit:

   ```bash
   git log --oneline
   ```

2. Revert to that commit:

   ```bash
   git revert HEAD
   ```

   Or, to revert multiple commits back to a specific commit:

   ```bash
   git revert --no-commit HEAD~3..HEAD
   git commit -m "Revert to last stable version"
   ```

3. Push the revert to the main branch:

   ```bash
   git push origin main
   ```

4. Vercel will automatically detect the push and trigger a new production deployment with the reverted code.

**Note:** Using `git revert` (instead of `git reset --hard`) preserves the full commit history, which is safer for team workflows.

---

## Production Checklist

Before deploying to production, verify the following:

- [ ] `npm install` completes without errors
- [ ] `npm run build` completes without errors and produces a `dist/` directory
- [ ] `npm run preview` serves the application correctly at `http://localhost:4173`
- [ ] All routes work when accessed directly (not just via in-app navigation)
- [ ] `vercel.json` is present in the project root with the SPA rewrite rule
- [ ] `tailwind.config.js` content paths include all source files
- [ ] `postcss.config.js` is present with Tailwind CSS and Autoprefixer plugins
- [ ] The default admin account (`admin` / `adminpass`) can log in successfully
- [ ] Blog CRUD operations (create, read, edit, delete) work as expected
- [ ] Role-based access control is enforced (non-admin users cannot access `/admin` or `/users`)
- [ ] The application is responsive on mobile, tablet, and desktop viewports
- [ ] No console errors appear in the browser developer tools