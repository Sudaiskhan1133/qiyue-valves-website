# Replit MD

## Overview

This is a B2B industrial business website for **Qingdao Qiyue Technology Equipment Co., Ltd.**, a China-based valve manufacturing and exporting company. The site is a full-stack application with a product catalog, inquiry/quote system, and admin panel. It targets global B2B buyers, distributors, and EPC contractors in the industrial valve sector.

Key pages include: Home, Products (listing + detail), About Us, Contact, Admin panel, and a 404 page. The site features SEO optimization via react-helmet, product categorization, a quote/inquiry form, and a simple session-based admin authentication system for managing products, categories, and inquiries.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend

- **Framework:** React 18 with TypeScript, bundled via Vite
- **Routing:** Wouter (lightweight client-side router) — NOT react-router
- **State/Data Fetching:** TanStack React Query for server state management
- **UI Components:** shadcn/ui (new-york style) built on Radix UI primitives with Tailwind CSS
- **Styling:** Tailwind CSS with CSS custom properties for theming. Industrial B2B color palette (deep blue primary, safety orange accent). Fonts: Inter (body) and Oswald (display headings)
- **Animations:** Framer Motion for hero sections and page transitions
- **SEO:** React Helmet for meta tag management on product pages
- **Forms:** React Hook Form with Zod validation via @hookform/resolvers
- **Path aliases:** `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend

- **Runtime:** Node.js with Express
- **Language:** TypeScript, run via tsx in development
- **API Pattern:** RESTful JSON API under `/api/` prefix. Routes defined in `server/routes.ts` with Zod-validated contracts in `shared/routes.ts`
- **Session Management:** express-session with MemoryStore (memorystore package) for admin auth
- **Admin Auth:** Simple username/password check (hardcoded admin user, password from `ADMIN_PASSWORD` env var or default). Session-based with `requireAdmin` middleware
- **Build:** Custom build script (`script/build.ts`) using Vite for client and esbuild for server. Production output goes to `dist/`

### Shared Layer

- **Schema:** `shared/schema.ts` — Drizzle ORM table definitions and Zod insert schemas (via drizzle-zod)
- **Routes:** `shared/routes.ts` — API contract definitions with Zod schemas for input/output validation, shared between client and server

### Database

- **ORM:** Drizzle ORM with MySQL dialect
- **Database:** MySQL (Hostinger hosted), connected via `MYSQL_DATABASE_URL` environment variable
- **Driver:** mysql2 package with connection pooling
- **Schema Push:** `npm run db:push` uses drizzle-kit to push schema to database
- **Migrations:** Output to `./migrations` directory
- **Tables:**
  - `categories` — id, name, slug (unique), description, imageUrl
  - `products` — id, categoryId (FK to categories), name, slug (unique), shortDescription, description, specifications (JSONB), features (text array), images (text array), metaTitle, metaDescription, keywords, createdAt
  - `inquiries` — id, name, email, phone, message, productId (FK to products), createdAt
- **Relations:** Products belong to a category (many-to-one)

### Development vs Production

- **Dev:** `npm run dev` runs tsx with Vite dev server middleware (HMR via `server/vite.ts`). Includes Replit-specific dev plugins (cartographer, dev-banner, runtime-error-overlay)
- **Prod:** `npm run build` creates optimized bundle, `npm start` serves static files from `dist/public` with Express

### Key Design Decisions

1. **Shared validation contracts** — Zod schemas in `shared/routes.ts` are used by both client hooks and server routes, ensuring type-safe API communication without code generation
2. **shadcn/ui component library** — Components live in `client/src/components/ui/` and are customized copies (not installed as a package). New components can be added via the shadcn CLI using `components.json` config
3. **Storage abstraction** — `server/storage.ts` defines an `IStorage` interface with a `DatabaseStorage` implementation, allowing potential swap of storage backends
4. **No separate auth library** — Admin auth is a simple session-based check, not Passport or JWT-based, keeping complexity low for this B2B brochure site
5. **SEO optimized** — Every page has unique title, meta description, keywords, Open Graph tags, canonical URLs via react-helmet. JSON-LD Organization schema in index.html for rich search results
6. **Image uploads** — Admin can upload images from device gallery for both products and categories via `/api/admin/upload` (multer)
7. **Self-hosted deployment** — `.env.example` provided with all required environment variables for deploying on own server

## External Dependencies

### Required Services

- **MySQL Database** — Required. Hostinger-hosted MySQL via `MYSQL_DATABASE_URL`. Remote MySQL access must be enabled in Hostinger control panel
- **Hostinger Email** — SMTP email for inquiry notifications via `SMTP_EMAIL` and `SMTP_PASSWORD` secrets

### Email Notifications

- **SMTP:** Hostinger email via `nodemailer` (smtp.hostinger.com:465 SSL)
- **Trigger:** Contact/inquiry form submission sends formatted HTML email to `SMTP_EMAIL`
- **Config:** `SMTP_EMAIL` and `SMTP_PASSWORD` secrets

### Environment Variables

- `MYSQL_DATABASE_URL` — MySQL connection string for Hostinger database (required, server must allow remote access)
- `ADMIN_PASSWORD` — Admin panel password (optional, defaults to `qiyue2024`)
- `SESSION_SECRET` — Express session secret (optional, has default)
- `SMTP_EMAIL` — Hostinger email address for sending notifications
- `SMTP_PASSWORD` — Hostinger email password
- `NODE_ENV` — Set to `production` for production builds

### Key NPM Packages

- `drizzle-orm` + `drizzle-kit` — ORM and migration tooling for MySQL
- `nodemailer` — Email sending for inquiry notifications
- `express` + `express-session` — HTTP server and session management
- `memorystore` — In-memory session store (production should consider connect-pg-simple which is also installed)
- `@tanstack/react-query` — Client-side data fetching and caching
- `framer-motion` — Animations
- `react-helmet` — SEO meta tags
- `wouter` — Client-side routing
- `zod` + `drizzle-zod` — Schema validation
- `react-hook-form` + `@hookform/resolvers` — Form handling with Zod integration

### External Assets

- Google Fonts: Inter, Oswald (loaded via CSS @import in index.css), plus additional fonts loaded in index.html
- Images: External images from Unsplash used as hero/about page backgrounds
- Company logo: Served as `/logo.png` from public directory