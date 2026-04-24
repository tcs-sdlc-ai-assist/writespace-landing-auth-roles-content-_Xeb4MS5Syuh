# WriteSpace

A modern, full-featured blogging platform built with React 18+, Vite, and Tailwind CSS. WriteSpace provides a clean and intuitive interface for writing, publishing, and managing blog posts with role-based access control and a powerful admin dashboard.

## Features

- **Public Landing Page** — Hero section, features overview, and latest posts preview visible to all visitors
- **Authentication & Session Management** — Login and registration with session persistence via `localStorage`
- **Role-Based Access Control** — Two roles supported: `admin` and `user`, with protected routes and admin-only pages
- **Blog CRUD with Ownership Checks** — Create, read, edit, and delete blog posts with author and admin permissions
- **Admin Dashboard** — Personalized welcome banner, stat cards, quick actions, and recent posts management
- **User Management** — Admin-only page to create, view, and delete users with role selection
- **Avatar System** — Role-based avatar icons (👑 for admins, 📖 for regular users) displayed across the platform
- **Responsive UI** — Mobile-first design with sticky navbar, hamburger menu, grid layouts, and dual table/card views
- **Data Persistence** — All data stored in `localStorage` (posts, users, sessions) with graceful error handling
- **Vercel SPA Deployment** — Pre-configured `vercel.json` with catch-all rewrite for client-side routing

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **React** | 18.2+ | UI library |
| **Vite** | 5.0+ | Build tool and dev server |
| **Tailwind CSS** | 3.3+ | Utility-first CSS framework |
| **React Router** | 6.20+ | Client-side routing |
| **uuid** | 9.0+ | Unique ID generation |
| **localStorage** | — | Client-side data persistence |

## Folder Structure

```
writespace-blog/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
├── CHANGELOG.md
├── README.md
└── src/
    ├── main.jsx                  # Application entry point
    ├── App.jsx                   # Root component with route definitions
    ├── index.css                 # Tailwind CSS directives
    ├── components/
    │   ├── Avatar.jsx            # Avatar icons and AvatarChip component
    │   ├── BlogCard.jsx          # Blog post card for grid layouts
    │   ├── Navbar.jsx            # Authenticated navigation bar
    │   ├── ProtectedRoute.jsx    # Route guard for auth and admin access
    │   ├── PublicNavbar.jsx      # Navigation bar for public pages
    │   ├── StatCard.jsx          # Gradient stat card for dashboard
    │   └── UserRow.jsx           # User row for table and mobile card views
    ├── pages/
    │   ├── AdminDashboard.jsx    # Admin dashboard with stats and recent posts
    │   ├── Home.jsx              # All blog posts grid view
    │   ├── LandingPage.jsx       # Public landing page
    │   ├── LoginPage.jsx         # Login form
    │   ├── ReadBlog.jsx          # Single blog post view
    │   ├── RegisterPage.jsx      # Registration form
    │   ├── UserManagement.jsx    # Admin user management page
    │   └── WriteBlog.jsx         # Create and edit blog post form
    └── utils/
        ├── auth.js               # Session management and login logic
        └── storage.js            # localStorage CRUD for posts and users
```

## Setup Instructions

### Prerequisites

- **Node.js** 16+ installed
- **npm** 7+ installed

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd writespace-blog
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173` by default.

4. Build for production:

   ```bash
   npm run build
   ```

   The optimized output will be generated in the `dist/` directory.

5. Preview the production build locally:

   ```bash
   npm run preview
   ```

## Environment Notes

- **No environment variables are required.** The application runs entirely on the client side using `localStorage` for data persistence.
- **No backend or database is needed.** All data (posts, users, sessions) is stored in the browser's `localStorage`.
- A **default admin account** is hardcoded and always available:
  - **Username:** `admin`
  - **Password:** `adminpass`
- Data is scoped to the browser. Clearing `localStorage` will reset all posts, users, and session data.

### localStorage Keys

| Key | Description |
|---|---|
| `writespace_posts` | Array of blog post objects |
| `writespace_users` | Array of registered user objects |
| `writespace_session` | Current authenticated user session |

## Route Map

| Path | Access | Description |
|---|---|---|
| `/` | Public | Landing page with hero, features, and latest posts |
| `/login` | Public | Login form (redirects if already authenticated) |
| `/register` | Public | Registration form (redirects if already authenticated) |
| `/blogs` | Authenticated | All blog posts grid view |
| `/blog/:id` | Authenticated | Single blog post read view |
| `/write` | Authenticated | Create a new blog post |
| `/edit/:id` | Authenticated | Edit an existing blog post (owner or admin only) |
| `/admin` | Admin only | Admin dashboard with stats and management tools |
| `/users` | Admin only | User management — create and delete users |

## Role Descriptions

### Admin (`admin`)

- Full access to all routes including `/admin` and `/users`
- Can create, read, edit, and delete **any** blog post
- Can create and delete users (except the default admin account and themselves)
- Displayed with a crown avatar (👑)
- Redirected to `/admin` after login

### User (`user`)

- Access to `/blogs`, `/blog/:id`, `/write`, and `/edit/:id`
- Can create new blog posts
- Can edit and delete **only their own** blog posts
- Cannot access `/admin` or `/users` (redirected to `/blogs`)
- Displayed with a book avatar (📖)
- Redirected to `/blogs` after login

## Deployment

### Vercel

The project includes a `vercel.json` configuration file that handles SPA routing by rewriting all requests to `/index.html`.

1. Install the [Vercel CLI](https://vercel.com/docs/cli) or connect your repository to Vercel via the dashboard.

2. Deploy using the CLI:

   ```bash
   npx vercel
   ```

   Or for production:

   ```bash
   npx vercel --prod
   ```

3. Vercel will automatically detect the Vite framework and use the following settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

No additional configuration is needed. The `vercel.json` rewrite rule ensures all client-side routes are handled correctly:

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

## License

This project is private and proprietary.