# Groups & Events — section1 SEO content index

Each HTML file holds the body HTML for the `section1` field of one Group Events child page.
Paste the full file contents into the `section1` cell of the matching sheet row.

Common values:
- **parentid:** `groups-events`
- **target column:** `section1`

The 4 children (child `path` values):
1. Corporate Parties / Team Events — `corporate-parties-events-groups`
2. School Groups / Field Trips — `school-groups`
3. Fundraising Events — `fund-raising`
4. Facility Rental — `facility-rental`

## File → sheet row mapping

| File | location (slug) | parentid | child path | target column |
|------|-----------------|----------|------------|----------------|
| `windsor-corporate.html` | windsor | groups-events | corporate-parties-events-groups | section1 |
| `windsor-school-groups.html` | windsor | groups-events | school-groups | section1 |
| `windsor-fund-raising.html` | windsor | groups-events | fund-raising | section1 |
| `windsor-facility-rental.html` | windsor | groups-events | facility-rental | section1 |
| `st-catharines-corporate.html` | st-catharines | groups-events | corporate-parties-events-groups | section1 |
| `st-catharines-school-groups.html` | st-catharines | groups-events | school-groups | section1 |
| `st-catharines-fund-raising.html` | st-catharines | groups-events | fund-raising | section1 |
| `st-catharines-facility-rental.html` | st-catharines | groups-events | facility-rental | section1 |

## NAP reference
- **Windsor** (`windsor`): AeroSports Windsor, 7654 Tecumseh Rd E, Windsor, ON N8T 1E9 · 519-916-9663
- **St. Catharines** (`st-catharines`): AeroSports St. Catharines, 333 Ontario St, St. Catharines, ON L2R 5L3 · 289-362-3377

## Notes
- Headings start at `<h2>` (an h1→h2 sanitizer runs on render; no `<h1>` used).
- Internal links use relative hrefs: hub `/{slug}/groups-events`, siblings `/{slug}/groups-events/{child-path}`, plus `/{slug}/kids-birthday-parties`, `/{slug}/pricing-promos`, `/{slug}/attractions`.
- CTA links to `/{slug}/groups-events#g1ge-quote`.
- No invented prices, percentages, stats, or reviews.
