# Local Edge Function & Scraping Workflow

A repeatable loop for testing edge functions and scraping jobs with clear logs
**before** they ship to production.

## TL;DR

```bash
# Test a deployed function from your laptop
bun run fn:test scrape-website --body-file scripts/fixtures/scrape-website.json

# Test against a locally running edge runtime
supabase functions serve --no-verify-jwt --env-file .env
bun run fn:test scrape-website --local --body-file scripts/fixtures/scrape-website.json

# Tail production logs while you test
bun run fn:logs scrape-website
```

## 1. One-time setup

1. Install the Supabase CLI: <https://supabase.com/docs/guides/cli>
2. Clone the repo and `bun install`.
3. Confirm `.env` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
   (already committed — these are public).
4. For local serving, create `supabase/.env.local` with any function secrets
   you need (`FIRECRAWL_API_KEY`, `LOVABLE_API_KEY`, `RESEND_API_KEY`).
   **Never commit this file.**

## 2. Run an edge function locally

```bash
supabase functions serve --env-file supabase/.env.local --no-verify-jwt
```

This starts the Deno edge runtime on `http://127.0.0.1:54321`. Every
`console.log` / `console.error` from the function is streamed to your terminal
with file + line info — that is your clear log feed.

In another terminal:

```bash
bun run fn:test scrape-website --local \
  --body-file scripts/fixtures/scrape-website.json
```

You'll see request URL, body, status, latency, and pretty-printed response.

## 3. Run an edge function against the deployed backend

Same command, drop `--local`:

```bash
bun run fn:test analyze-website \
  --body-file scripts/fixtures/analyze-website.json
```

Live logs:

```bash
bun run fn:logs analyze-website
# or with the Supabase CLI directly:
supabase functions logs analyze-website --tail
```

## 4. Test scraping jobs

The scraping pipeline = `scrape-website` (Firecrawl) → `analyze-website`
(Gemini) → persisted to `analysis_reports`. To validate end-to-end:

```bash
# 1. Raw scrape
bun run fn:test scrape-website --body '{"url":"https://lnpplumbing.com"}'

# 2. Full analysis (scrape + AI)
bun run fn:test analyze-website --body '{"url":"https://lnpplumbing.com"}'

# 3. Trigger the daily monitor manually (requires service-role auth)
bun run fn:test check-competitor-changes \
  --header "Authorization=Bearer $SUPABASE_SERVICE_ROLE_KEY"
```

## 5. Pre-deploy checklist

- [ ] `bun run fn:test <name> --local` passes
- [ ] `bun run fn:test <name>` (deployed) returns 2xx with expected shape
- [ ] `bun run fn:logs <name>` shows no `error`/`stack` lines
- [ ] `bun run test` passes (unit tests)
- [ ] No new secrets needed (or added via Lovable Cloud secrets UI)

## 6. Fixtures

Reusable JSON bodies live in `scripts/fixtures/`. Add one per scenario you
want to repeat — keep them small and free of real PII.