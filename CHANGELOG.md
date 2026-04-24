# Changelog

All notable changes to the WriteSpace project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-01

### Added

- **Public Landing Page**
  - Hero section with gradient background and call-to-action buttons
  - Features overview section highlighting Write & Publish, User Management, and Dashboard & Analytics
  - Latest posts preview section visible to all visitors
  - Responsive footer with navigation links
  - Context-aware navigation that adapts based on authentication state

- **Authentication & Session Management**
  - Login page with username and password validation
  - Registration page with display name, username, password, and confirm password fields
  - Hardcoded default admin account (`admin` / `adminpass`)
  - Session persistence via `localStorage` under `writespace_session` key
  - Automatic redirect for authenticated users away from login and register pages
  - Logout functionality accessible from the navbar dropdown

- **Role-Based Access Control**
  - Two roles supported: `admin` and `user`
  - `ProtectedRoute` component guarding authenticated routes
  - Admin-only route protection for dashboard and user management pages
  - Non-admin users redirected to `/blogs` when attempting to access admin routes

- **Blog CRUD with Ownership Checks**
  - Create new blog posts with title and content fields via `/write`
  - Read individual blog posts with full content display via `/blog/:id`
  - Edit existing blog posts via `/edit/:id` with pre-populated form fields
  - Delete blog posts with confirmation dialog
  - Ownership enforcement: only post authors and admins can edit or delete posts
  - Character count display in the content editor
  - Automatic timestamps for `createdAt` and `updatedAt` fields
  - UUID-based unique post identifiers

- **Admin Dashboard**
  - Personalized welcome banner with gradient background
  - Stat cards displaying total posts, total users, total admins, and regular users
  - Quick action buttons for writing new posts and managing users
  - Recent posts table with edit and delete actions
  - Responsive layout with desktop table and mobile card views

- **User Management**
  - Admin-only user management page at `/users`
  - Create new users with display name, username, password, and role selection
  - Delete users with confirmation dialog
  - Protection against deleting the default admin account
  - Protection against deleting the currently logged-in user
  - User list displaying avatar, display name, username, role badge, and join date
  - Duplicate username validation during user creation

- **Avatar System**
  - Role-based avatar icons: crown emoji (👑) for admins, book emoji (📖) for regular users
  - `AvatarChip` component combining avatar icon with display name
  - Consistent avatar usage across blog cards, navbar, read view, and user management

- **Responsive Tailwind CSS UI**
  - Mobile-first responsive design using Tailwind CSS utility classes
  - Sticky navigation bar with desktop links and mobile hamburger menu
  - User dropdown menu on desktop with logout option
  - Blog post grid layout: single column on mobile, two columns on tablet, three columns on desktop
  - Color-coded blog card top borders cycling through eight accent colors
  - Gradient banners on admin dashboard, user management, and write/edit pages
  - Desktop table and mobile card dual-view pattern for data lists
  - Form validation with inline error messages and red border highlights

- **Data Persistence**
  - All posts stored in `localStorage` under `writespace_posts` key
  - All users stored in `localStorage` under `writespace_users` key
  - Session data stored in `localStorage` under `writespace_session` key
  - Graceful error handling for `localStorage` unavailability

- **Vercel SPA Deployment**
  - `vercel.json` configured with catch-all rewrite rule for client-side routing
  - All routes rewrite to `/index.html` to support React Router `BrowserRouter`

- **Build Tooling**
  - Vite 5 with React plugin for fast development and optimized builds
  - PostCSS configured with Tailwind CSS and Autoprefixer
  - Tailwind CSS 3 with custom badge color theme extensions
  - Content paths configured for all JSX files and `index.html`