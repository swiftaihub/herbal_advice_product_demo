# Cloudflare Production Hardening

## Architecture

- Public storefront pages are static-first.
- The unprefixed `/` route is a static locale chooser instead of a runtime redirect.
- Locale pages under `/en/**` and `/zh/**` are pre-rendered and locked down with `dynamic = "error"`.
- Product, ingredient, and article detail pages set `dynamicParams = false` so random bot slug scans do not trigger on-demand rendering.
- `next/image` runs in unoptimized mode so images are served as static assets instead of hitting a Worker image pipeline.
- Middleware only runs on `/api/*`, and today it applies a narrow ingress guard to `/api/contact`.

## Interactive endpoints

Current dynamic endpoint surface:

- `/api/contact`

Protections in code:

- Same-origin enforcement
- Request body size limits
- Honeypot field
- IP and session keyed rate limiting
- Burst limit and longer rolling window
- Cooldown on abuse
- Structured JSON logging with hashed IP/session identifiers
- No-store responses
- Duplicate-submit prevention on the client

## Environment variables

Required:

- `NEXT_PUBLIC_SITE_URL`

Optional:

- `CONTACT_ALLOWED_ORIGINS`
  Comma-separated extra origins allowed to post to `/api/contact`.
- `RATE_LIMIT_SALT`
  Extra salt for privacy-safe hashing in logs. Set this in production so IP and session hashes are not derived from public origins alone.

## Cloudflare Builds configuration

Recommended Workers Builds settings:

- Root directory: `.`
- Build command: leave blank
- Deploy command: `npm run deploy`
- Non-production branch deploy command: `npm run upload`

This avoids double-deploying the Worker during CI.

## Manual Cloudflare Dashboard Configuration

Configure these after the code deploy:

1. WAF Rate Limiting Rule for `/api/*`
   Expression: `http.request.uri.path starts_with "/api/"`
   Action: Managed Challenge
   Suggested threshold: 30 requests per minute per IP

2. Stricter WAF rule for `/api/contact`
   Expression: `http.request.uri.path eq "/api/contact"`
   Action: Block or Managed Challenge
   Suggested threshold: 5 requests per 10 minutes per IP

3. Bot protection
   Turn on Super Bot Fight Mode for the zone.
   Keep verified bots allowed.
   Add a custom rule to challenge non-verified bots on `/api/*`.

4. Security level for anonymous bursts
   If the site is seeing concentrated abusive bursts from a small set of countries, add a temporary Managed Challenge rule for those countries on `/api/*`.

5. Fail-open vs fail-closed
   `/api/contact`: fail-open at the app layer if the in-memory limiter degrades, but fail-closed at the WAF layer.
   Future AI or model proxy endpoints: fail-closed both in-app and at the WAF layer.

## Deployment

1. Set `NEXT_PUBLIC_SITE_URL` and, if needed, `CONTACT_ALLOWED_ORIGINS`.
2. Confirm Workers Builds config matches the values above.
3. Deploy with `npm run deploy`.
4. Validate:
   - `/`
   - `/en`
   - `/zh`
   - `/en/articles`
   - `/api/contact` from the contact form
5. Check Worker logs for `contact_submission_accepted`, `contact_rate_limited`, and `endpoint_summary` events.

## Rollback

1. In Cloudflare Workers, redeploy the previous Worker version from the Versions tab if you need an immediate rollback.
2. Revert the hardening commit in git.
3. Redeploy with `npm run deploy`.
4. If the rollback includes older route behavior, re-check Builds settings so CI does not double deploy.
