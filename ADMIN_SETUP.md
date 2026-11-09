# Private visitor dashboard

The Admin button appears above About Me only after an authenticated session for `doa12967@gmail.com`. The dashboard shows unique browser history (first visit, latest visit, device, browser, and operating system), followed by the unique visitor count. History is paginated in batches of 50.

## Production

The existing Cloudflare Worker is `personal-website`. `wrangler.jsonc` now deploys `server/worker.js` plus the Vite `dist` assets. The D1 database `portfolio-visitors` is bound as `DB`; its ID is configured in Wrangler. The production database and initial migration have been created.

The configured Cloudflare Access self-hosted application protects **only** `andybdo.com/api/admin/login`, with an Allow policy for exactly `doa12967@gmail.com`. Email one-time PIN is the login method. Do not put the whole public website behind Access.

Public API requests are handled by the Worker. Every admin data request separately verifies the Access JWT signature, expiry, issuer, application audience, and email. Protecting just the sign-in URL does not make the other admin APIs public.

Set these Worker variables:

- `ADMIN_EMAIL`: `doa12967@gmail.com`.
- `ACCESS_TEAM_DOMAIN`: `https://shy-rain-154a.cloudflareaccess.com`.
- `ACCESS_AUD`: the application audience tag from the Portfolio Admin Access application.

`ANALYTICS_SECRET` is a private Worker secret used to sign visitor cookies. It has been created in Cloudflare. Never put it in a public Vite variable or commit it. Keep it stable across deploys to preserve returning-browser recognition.

The private sign-in link is `https://andybdo.com/api/admin/login`. After verification it returns to the home menu with Admin visible. The dashboard's Sign out link clears the Access session. Visitor history cannot be recovered from before tracking was enabled.

Deploy updates with `npm run deploy`, or the existing Git-connected Cloudflare build using `npm run build` and `npx wrangler deploy`. Deploys preserve D1 history. For future schema changes, run `npm run db:remote` before publishing the updated Worker.

## Local development

1. `npm run db:local` initializes the local database.
2. Add a local `ANALYTICS_SECRET` to the ignored `.dev.vars` file. This file was generated for the current checkout.
3. `npm run dev:api` serves the Worker on localhost:8787 using local D1.
4. `npm run dev` serves Vite, which proxies `/api` to that local Worker.

Local development does not bypass owner authentication. Without an Access token, Admin stays hidden and its APIs return 401. Browser tests mock the session and history for UI coverage; security tests exercise signed JWTs and real SQLite queries separately.

`npm test` runs the geometry, analytics security, and browser tests. `npm run test:server` runs only the analytics security tests.

## Counting behavior

A random, signed first-party HttpOnly cookie recognizes each browser for up to one year. A returning browser updates its last-seen time without creating another visitor. Signed-in owner visits and recognizable bots are excluded. Signing in removes that browser's earlier anonymous entry. No IP addresses or full user-agent strings are stored.

Unique visitors are an estimate of unique browsers: different browsers/devices, cleared cookies, cookie expiry, or rejected cookies can produce another entry. Device, browser, and system labels come from the browser's reported user agent and can be inaccurate or spoofed. This does not identify visitors by name or email.
