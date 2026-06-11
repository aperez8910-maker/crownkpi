# CrownKPI — Website Analyzer & Competitor Monitoring

A React + Vite application for analyzing websites, tracking competitors, and generating marketing insights. Powered by Supabase (Lovable Cloud) for backend services.

---

## Prerequisites

- **Node.js** `>= 18` (recommended: install via [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- **Bun** or **npm** (Bun is preferred and pre-installed in the Lovable sandbox)
- Git

---

## Quick Start

### 1. Clone the repository

```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

### 2. Environment variables

This project uses three environment variables to connect to the Supabase backend. They are already configured in the committed `.env` file at the project root:

```
VITE_SUPABASE_URL="https://iwewfgdbnrhvoyfzafox.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIs..."
VITE_SUPABASE_PROJECT_ID="iwewfgdbnrhvoyfzafox"
```

> **Note:** `VITE_SUPABASE_PUBLISHABLE_KEY` is an **anonymous/public** key (safe to commit). It only grants access scoped by Row Level Security (RLS) policies. No private service-role keys are required to run the frontend locally.

If you ever need to rotate or replace these values, edit the `.env` file directly.

### 3. Install dependencies

Using **Bun** (recommended):
```bash
bun install
```

Using **npm**:
```bash
npm install
```

### 4. Start the development server

```bash
bun run dev
```

The app will be available at **`http://localhost:8080`** (configured in `vite.config.ts`).

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start Vite dev server with HMR on port 8080 |
| `bun run build` | Production build |
| `bun run build:dev` | Development build |
| `bun run preview` | Preview the production build locally |
| `bun run lint` | Run ESLint |
| `bun run test` | Run Vitest tests once |
| `bun run test:watch` | Run Vitest in watch mode |

---

## Project Structure

```
├── public/                    # Static assets
├── src/
│   ├── components/            # React components
│   │   ├── dashboard/         # Dashboard views (AnalysisResults, SavedReports, etc.)
│   │   ├── layout/            # Header, Sidebar, etc.
│   │   ├── settings/          # Settings page
│   │   └── ui/                # shadcn/ui base components
│   ├── hooks/                 # Custom React hooks
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts      # Supabase client (auto-generated)
│   │       └── types.ts       # Database TypeScript types
│   ├── lib/
│   │   ├── api/               # API helper modules (analysis-reports, competitor-alerts, monitoring)
│   │   └── utils.ts           # Utility functions
│   ├── pages/                 # Route-level page components
│   ├── App.tsx                # Root app component
│   └── main.tsx               # Entry point
├── supabase/
│   ├── config.toml            # Supabase project config (auto-generated)
│   ├── functions/             # Edge functions (deployed automatically)
│   │   ├── analyze-website/
│   │   ├── check-competitor-changes/
│   │   ├── scrape-website/
│   │   └── send-competitor-alert/
│   └── migrations/            # Database migrations (deployed automatically)
├── .env                       # Environment variables (public keys only)
├── index.html                 # HTML entry point
├── package.json
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json
└── vite.config.ts             # Vite configuration
```

---

## Backend & Edge Functions

This project uses **Lovable Cloud** (Supabase) for its backend:

- **Database:** PostgreSQL with Row Level Security (RLS)
- **Edge Functions:** Deno-based serverless functions in `supabase/functions/`
- **Auth:** Available but optional for anonymous features

Edge functions deploy automatically when you push changes — no manual deployment step is needed.

If you want to run edge functions locally, install the [Supabase CLI](https://supabase.com/docs/guides/cli) and run:

```bash
supabase start        # Starts local Supabase stack
supabase functions serve analyze-website
```

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + Vite 5 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 + shadcn/ui |
| State | React Hooks + TanStack Query |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Backend | Supabase (PostgreSQL + Edge Functions) |
| Testing | Vitest + Testing Library |

---

## Connecting to GitHub

To push local changes back to Lovable:

1. In the Lovable editor, click the **+** menu → **GitHub** → **Connect project**
2. Authorize the Lovable GitHub App
3. Select your account/organization and create the repository
4. Clone the repo locally, make changes, commit, and push

Pushed changes sync automatically to Lovable in real time.

---

## Deployment

1. Open the Lovable editor
2. Click **Share → Publish** to deploy the frontend
3. Backend changes (migrations, edge functions) deploy automatically on push

Published URL: `https://crownkpi.lovable.app`

---

## Need Help?

- [Lovable Documentation](https://docs.lovable.dev/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Supabase Documentation](https://supabase.com/docs)
