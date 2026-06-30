# AeroSports — Two-Codebase Architecture

One domain, two independently-owned Next.js projects, stitched together by a
Cloudflare Worker that routes by URL path.

## The two codebases

| | Serves | Owner | Deploy |
|---|---|---|---|
| **Main** (this repo) | `/` + all corporate pages, `/windsor`, `/st-catharines` | You | App Engine (`default` service) |
| **Group3** (separate repo) | `/oakville`, `/london`, `/scarborough` | Oakville/London/Scarborough operators | Their own infra |

Both serve under `https://www.aerosportsparks.ca`. Neither shares code with the
other — Group3 is a standalone clone its operators fully control.

## Routing (Cloudflare Worker)

Cloudflare already fronts the domain. A Worker intercepts every request and
forwards the Group3 city paths (and Group3's assets/sitemap) to the Group3
origin; everything else falls through to the Main origin Cloudflare already
points at. See [`cloudflare-worker.js`](./cloudflare-worker.js).

```
www.aerosportsparks.ca/oakville      ─┐
www.aerosportsparks.ca/london        ─┼─►  Group3 origin
www.aerosportsparks.ca/scarborough   ─┤
www.aerosportsparks.ca/_g3/_next/... ─┘    (assets — Worker strips /_g3)
www.aerosportsparks.ca/sitemap-group3.xml ─► Group3 origin
everything else  ──────────────────────────► Main origin (default)
```

## The #1 gotcha: asset collisions

Both apps emit assets at `/_next/static/...`. On one shared domain these
overwrite each other. Fix: **Group3 sets `assetPrefix: '/_g3'`** in
`next.config.mjs`, so its assets are requested at `/_g3/_next/...`. The Worker
matches `/_g3/*`, strips the prefix, and forwards to the Group3 origin (which
still serves `_next` at the root). Main needs no `assetPrefix` — it's the
default origin and keeps `/_next/...`.

`public/` files referenced by absolute path (e.g. `/assets/logo.png`) are NOT
covered by `assetPrefix`. Group3's static images already come from the GCS CDN
(absolute URLs), so this is a non-issue today — but keep any new Group3
`public/` asset on GCS or under `/_g3`.

## Group3 project recipe

Create the Group3 repo from a clean clone of this one, then:

1. **Scope locations** — in `src/middleware.js`, set
   `VALID_LOCATIONS = new Set(['oakville', 'london', 'scarborough'])`.
2. **Asset prefix** — in `next.config.mjs`, add `assetPrefix: '/_g3'`.
   Keep `NEXT_PUBLIC_BASE_URL = 'https://www.aerosportsparks.ca'` so canonicals
   and sitemap URLs render on the shared domain.
3. **Own content source** — point `SHEET_URL` at Group3's own Google Sheet
   (only Oakville/London/Scarborough rows in `locations`, `Data`, etc.).
4. **Sitemap** — rename the route to emit at `/sitemap-group3.xml` (its
   `locations` tab already excludes the other cities, so output is auto-scoped).
5. **Deploy** to the operators' infra. Note the public origin hostname — that's
   `GROUP3_ORIGIN` in the Worker.

## Main project changes (apply at cutover, not before)

These remove the Group3 cities from the app you own. Do NOT deploy them until
Group3 is live, or those three cities 404.

1. **Scope locations** — `VALID_LOCATIONS = new Set(['windsor', 'st-catharines'])`
   in `src/middleware.js`.
2. **Trim the sheet** — remove (or move to Group3's sheet) the
   Oakville/London/Scarborough rows from the Main Google Sheet, so `/sitemap.xml`
   and the locations lists stop emitting them.
3. **Reference Group3's sitemap** — add a second line to `public/robots.txt`:
   `Sitemap: https://www.aerosportsparks.ca/sitemap-group3.xml`, alongside the
   existing `/sitemap.xml` line. Main's `/sitemap.xml` is unchanged and
   auto-scopes to its own cities once the sheet is trimmed (step 2). Crawlers
   honor multiple `Sitemap:` directives, so no sitemap-index route is needed.

## Cutover order

1. Stand up the Group3 repo + its Google Sheet + deploy. Test its 3 cities
   directly against the Group3 origin (before any Cloudflare change).
2. Deploy the Cloudflare Worker. Verify `/oakville` etc. resolve to Group3 and
   assets load via `/_g3/...`.
3. Deploy Main with `VALID_LOCATIONS` and the sheet trimmed, plus the robots.txt
   Group3 sitemap line.
4. Verify: all 6 cities + corporate render, assets load on every page, both
   sitemaps resolve, redirects still work.

## Notes

- **Cross-zone links are full page loads.** A nav link from corporate `/` to
  `/oakville` crosses origins, so use `<a href>`, not next/`<Link>`.
- **Cookies** are shared (same registrable domain) — fine.
- **`apex → www` redirect** stays in Main's middleware; it runs before the
  Worker's path routing matters because both land on the same domain.
