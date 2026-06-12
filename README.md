# Crown KPI

**Crown KPI** is a website intelligence and marketing audit dashboard built by **Alexander Emilio Perez** as a **CodeDesk OS portfolio project**.

## Overview

Crown KPI helps businesses review website performance signals from one clean dashboard, including traffic trends, visitor geography, marketing channels, SEO scoring, security indicators, competitor monitoring, recent scan history, and AI-style marketing recommendations.

The project demonstrates frontend dashboard architecture, TypeScript component design, Tailwind CSS styling, Supabase-ready data modeling, business intelligence layout, and automation-ready reporting for small-business operations.

## Live Demo

https://crownkpi.lovable.app

## Features

- Website URL analysis interface
- Traffic analytics dashboard
- Visitor geolocation breakdown
- Marketing channel overview
- SEO score presentation
- Security audit indicators
- Competitor comparison views
- Competitor monitoring dashboard
- Recent scan history
- AI marketing insight cards
- Dark premium dashboard UI
- Supabase-ready data model

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | React 18 + Vite 5 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 + shadcn/ui |
| State/Data | React Hooks + TanStack Query |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Backend-ready | Supabase PostgreSQL + Edge Functions |
| Testing | Vitest + Testing Library |

## Project Structure

```text
src/
  components/
    dashboard/       Dashboard cards, charts, reports, analysis results
    layout/          Sidebar and header layout components
    monitoring/      Competitor monitoring screens
    competitor/      Competitor comparison screens
    settings/        Settings screen
    ui/              shadcn/ui base components
  hooks/             Shared React hooks
  integrations/      Supabase client and generated database types
  lib/api/           Website analysis and report helper modules
  pages/             Route-level pages
  App.tsx            App providers and routes
  main.tsx           React entry point
supabase/
  functions/         Edge functions for scraping, analysis, and alerts
  migrations/        Database migrations
```

## Local Development

### Prerequisites

- Node.js 18+
- npm or Bun
- Git

### Install

```bash
git clone https://github.com/aperez8910-maker/crownkpi.git
cd crownkpi
npm install
```

### Environment Setup

Copy the example file and fill in your own Supabase values:

```bash
cp .env.example .env.local
```

Expected variables:

```env
VITE_SUPABASE_PROJECT_ID=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_SUPABASE_URL=
```

Do not commit real `.env` or `.env.local` values.

### Run

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run build:dev` | Create a development-mode build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest once |
| `npm run test:watch` | Run Vitest in watch mode |

## Portfolio Purpose

Crown KPI is designed to show how small businesses can replace scattered spreadsheets, disconnected analytics screenshots, and manual marketing reviews with a structured intelligence dashboard.

This project aligns with the CodeDesk OS focus: practical automation, clean dashboards, and business systems that small businesses can actually use.

## Built By

**Alexander Emilio Perez**  
Founder, **CodeDesk OS**
