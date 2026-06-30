# Location Group Architecture

## Public URL model

- `https://www.aerosportsparks.ca/windsor` -> `group1`
- `https://www.aerosportsparks.ca/st-catharines` -> `group1`
- `https://www.aerosportsparks.ca/oakville` -> `group2`
- `https://www.aerosportsparks.ca/london` -> `group2`
- `https://www.aerosportsparks.ca/scarborough` -> `group2`
- `https://www.aerosportsparks.ca/` -> default site behavior

## Why the public routes stay where they are

Next.js route groups do not appear in the URL, but two hidden route trees cannot both resolve to the same public pathname. Because of that, the production-safe pattern is:

1. Keep the public route files at `src/app/[location_slug]/**`
2. Split location-specific code into `src/app/location-groups/group1/**` and `src/app/location-groups/group2/**`
3. Let the live route files dispatch into the correct group code at runtime

This preserves every existing URL while still giving each location group its own code path and sheet source.

## Environment variables

Set these in local development and production:

- `GROUP1_SHEET_URL`
- `GROUP2_SHEET_URL`
- `DEFAULT_LOCATION_GROUP_KEY`

If a group-specific sheet URL is missing, the app falls back to the legacy `SHEET_URL`.

## Deployment notes

1. Point `GROUP1_SHEET_URL` at the Windsor / St. Catharines workbook.
2. Point `GROUP2_SHEET_URL` at the Oakville / London / Scarborough workbook.
3. Set `DEFAULT_LOCATION_GROUP_KEY=group2` unless the root site should follow Group 1 content.
4. Deploy once both sheets contain the required tabs (`locations`, `Data`, `config`, and any feature-specific tabs used by the routes).
5. Run:
   - `npm run lint`
   - `npm run build`
   - `npm run test:location-groups`

