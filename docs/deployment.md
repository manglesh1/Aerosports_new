# Deployment & Environment

Everything the app needs to run in production, in one place.

## Environment variables

| Var | Required? | What it does |
|---|---|---|
| `SHEET_URL` | yes | xlsx-export URL of the content spreadsheet (`Data`, `blogs`, `media`, `config`, …). Already set in `next.config.mjs`. |
| `NEXT_PUBLIC_BASE_URL` | yes | Canonical site URL (`https://www.aerosportsparks.ca`). |
| `STUDIO_USERS` | **yes (prod)** | Admin logins as JSON: `[{"id":"alice","password":"…"},{"id":"bob","password":"…"}]`. **If unset in production, studio login is disabled** — no `admin`/`admin` fallback. |
| `STUDIO_SESSION_SECRET` | **yes (prod)** | Long random string used to sign session cookies. |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | recommended | Service-account JSON (stringified) for Sheets writes + GCS uploads. Preferred over the on-disk creds file — set this and delete `src/app/api/sheet/service-account-creds.json`. |
| `STUDIO_SHEET_ID` | optional | Spreadsheet id the studio writes to. Defaults to the id parsed from `SHEET_URL`. |
| `STUDIO_GCS_BUCKET` | optional | GCS bucket for image uploads. Defaults to `aerosports`. |
| `GROUP3_ORIGIN` | **local only** | Proxies Group3 cities (oakville/london/scarborough) to a Group3 dev server for prototyping. **Leave unset in production** — the Cloudflare Worker handles that routing. |

Local dev: the studio falls back to **`admin` / `admin`** and a dev session secret so the
prototype works without config. Both fallbacks are **disabled when `NODE_ENV=production`**.

## One-time Google setup

The service account is `googlesheeteditor@aerosports-website.iam.gserviceaccount.com`.

1. **Sheets** — the content spreadsheet must be shared with the service account as **Editor**
   (already done — studio writes work).
2. **Cloud Storage** — the SA needs write access to the bucket for image uploads:
   ```
   gsutil iam ch serviceAccount:googlesheeteditor@aerosports-website.iam.gserviceaccount.com:roles/storage.objectAdmin gs://aerosports
   ```
   The bucket must also allow public reads (it already serves public WebP).

## Content model (which sheet holds what)

- `Data` — pages
- `blogs` — blog listing + posts (merged with `Data` at read time)
- `media` — images: `id, type, desktop_url, mobile_url, alt, title, width, height`.
  Content rows reference images by `id`; the data layer resolves them to URLs + alt.
- `config`, `promotions`, `faq`, `pricingtable`, `photo gallery`, `popups` — as before.

All editable at **`/studio`** (a tab per sheet).

## Deploy checklist

1. Set the env vars above (especially `STUDIO_USERS` + `STUDIO_SESSION_SECRET`).
2. Move creds to `GOOGLE_SERVICE_ACCOUNT_JSON` and delete the on-disk creds file.
3. `npm run build` → deploy (App Engine `app.yaml`).
4. Smoke-test: a location page, a blog post, `/studio` login, an image upload.

## Two-codebase split

See [two-codebase-architecture.md](./two-codebase-architecture.md) and
[cloudflare-worker.js](./cloudflare-worker.js). Group3 is a separate deploy the operators own;
the Cloudflare Worker routes `/oakville`, `/london`, `/scarborough` (+ `/_g3/*` assets) to it.
