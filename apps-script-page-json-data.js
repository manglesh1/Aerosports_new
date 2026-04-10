/**
 * Apps Script: Populate `page-json-data` column on the Data sheet
 * for the home page row of all 5 AeroSports locations.
 *
 * Run `updatePageJsonDataAll()` from the Apps Script editor.
 *
 * The column is added to the Data sheet if it doesn't already exist.
 * Each home row (path === 'home') for each location_slug gets its
 * page-json-data column populated with location-specific text content
 * for the new home page sections (hero, highlights, attractions,
 * plan, party, social proof, why, promo, location, final CTA).
 *
 * Existing data in unrelated rows/columns is left untouched.
 */

const SHEET_NAME = "Data";
const COLUMN_NAME = "page-json-data";

const LOCATIONS = [
  {
    slug: "oakville",
    display: "Oakville",
    region: "Oakville–Mississauga border",
    serviceArea: "Burlington, Brampton, Etobicoke, Georgetown and all across the GTA",
    sqft: "27,000",
    trampolines: "130+",
    insta: "@aerosportsoakville",
    address: "2679 Bristol Cir, Oakville",
  },
  {
    slug: "london",
    display: "London",
    region: "London Ontario",
    serviceArea: "London, St. Thomas, Strathroy and Southwestern Ontario",
    sqft: "20,000+",
    trampolines: "100+",
    insta: "@aerosportslondon",
    address: "London, ON",
  },
  {
    slug: "windsor",
    display: "Windsor",
    region: "Windsor–Essex region",
    serviceArea: "Windsor, LaSalle, Tecumseh, Amherstburg and Essex County",
    sqft: "20,000+",
    trampolines: "100+",
    insta: "@aerosportswindsor",
    address: "Windsor, ON",
  },
  {
    slug: "st-catharines",
    display: "St. Catharines",
    region: "Niagara region",
    serviceArea: "St. Catharines, Niagara Falls, Welland, Thorold and the Niagara Region",
    sqft: "20,000+",
    trampolines: "100+",
    insta: "@aerosportsstcatharines",
    address: "St. Catharines, ON",
  },
  {
    slug: "scarborough",
    display: "Scarborough",
    region: "Scarborough — Toronto",
    serviceArea: "Scarborough, North York, Markham, Pickering and the GTA",
    sqft: "25,000+",
    trampolines: "120+",
    insta: "@aerosportsscarborough",
    address: "1120 Birchmount Rd, Scarborough",
  },
];

/**
 * Build the per-location page-json-data payload.
 *
 * IMPORTANT: The home-v2 components have NO defaults. Anything you want
 * to render on the home page must live in this JSON. If a field is missing
 * the corresponding chunk of the section is hidden.
 *
 * Special hints:
 *   - highlights[].source = "rating"      → num is replaced by live API rating
 *   - highlights[].source = "attractions" → num is replaced by attraction count
 *   - highlights[].source = "location"    → num is replaced by display name
 *   - social.rating / social.fallbackReviews are NOT used (reviews are API-only)
 *   - promo.fallbackCards are NOT used (promotions come from the Promotions sheet)
 *   - location.hours is read from the locations sheet `hours` column, not from JSON
 */
function buildPageJson(loc) {
  return {
    hero: {
      badge: `${loc.display}'s #1 Rated Trampoline Park`,
      headline: {
        line1: `${loc.display}'s #1`,
        lineAccent: "Destination for Fun, Fitness",
        line2: "& Parties!",
      },
      subtext: `${loc.sqft} sq ft of pure adrenaline. Trampolines, Ninja Warrior, dodgeball, foam pits & more — for every age, every day.`,
      cta: {
        book: "Book Now →",
        pricing: "View Pricing",
        waiver: "Sign Waiver",
      },
      openChip: "Open Today",
      cardTitle: { line1: "Jump Higher.", line2: "Play Harder." },
      trustItems: [
        { icon: "⭐", title: "Top Rated", subtitle: "Google Reviews" },
        { icon: "🏆", title: `${loc.display}'s #1`, subtitle: "Trampoline Park" },
        { icon: "👨‍👩‍👧‍👦", title: "Family Owned", subtitle: "100% Canadian" },
      ],
      floatStats: [
        { num: loc.sqft.replace(",000", "K").replace("+", ""), label: "Sq Ft of Fun" },
        { num: "8+", label: "Attractions" },
        { num: loc.display, label: "Location" },
      ],
    },
    // `source` keys auto-derive the number from live data:
    //   "rating"      → live Google rating from the API
    //   "attractions" → number of attractions for this location
    //   "location"    → location display name
    highlights: [
      {
        icon: "🎯",
        source: "attractions",
        num: "8+",
        label: "Attractions",
        desc: "Trampolines, Ninja course, Dodgeball, Foam pits & more",
      },
      {
        icon: "🎂",
        num: "500+",
        label: "Parties Hosted",
        desc: "Birthday & corporate parties with dedicated hosts and party rooms",
      },
      {
        icon: "⭐",
        source: "rating",
        num: "★",
        label: "Star Rated",
        desc: `Top-rated on Google, TripAdvisor & Facebook by ${loc.display} families`,
      },
      {
        icon: "📍",
        source: "location",
        num: loc.display,
        label: "Location",
        desc: `Convenient ${loc.region} location — serving the surrounding area`,
      },
    ],
    attractionsSection: {
      tag: "What's Inside",
      headline: "Epic Attractions\nFor Every Age",
      subtext: `One admission unlocks ${loc.sqft} sq ft of non-stop action — hover to explore.`,
      viewAllLabel: "View All →",
      defaultTileTag: "Explore",
      tileCtaLabel: "Explore →",
    },
    plan: {
      label: "Plan Your Visit",
      items: [
        {
          icon: "💰",
          title: "View Pricing",
          subtitle: "Jump passes & memberships",
          link: "pricing-promos",
        },
        {
          icon: "🎂",
          title: "Book a Party",
          subtitle: "Stress-free birthday packages",
          link: "kids-birthday-parties",
        },
        {
          icon: "🎟",
          title: "Buy Jump Passes",
          subtitle: "Online booking available",
          link: "{{estore}}",
        },
        {
          icon: "📝",
          title: "Sign Waiver",
          subtitle: "Save time — sign online",
          link: "{{waiver}}",
        },
      ],
    },
    party: {
      tag: "Birthdays & Events",
      headline: {
        line1: "Parties That'll",
        lineAccent: "Be Talked About",
        line2: "For Years",
      },
      subtext:
        "From little ones to teenagers — our birthday packages take all the stress off your plate so you can actually enjoy the party too.",
      includesTitle: "Every Package Includes",
      includes: [
        "Dedicated party host for the full session",
        "Private party room for 90 minutes",
        "Open jump session for all guests",
        "Pizza, juice boxes & cake time",
        "Grip socks for all jumpers",
      ],
      badge: "BOOK YOUR PARTY",
      cta: { book: "Book a Party →", packages: "View Packages" },
    },
    social: {
      tag: "What Families Say",
      headline: "Real Reviews.\nReal Smiles.",
      ratingCount: "Google reviews",
      instagramTitle: "Follow The Fun 📸",
      instagramHandleLabel: `${loc.insta} →`,
      instagramTiles: [
        { image: "" }, { image: "" }, { image: "" },
        { image: "" }, { image: "" }, { image: "" },
      ],
    },
    whyChoose: {
      tag: "Why AeroSports",
      headline: `${loc.display}'s Ultimate Play Destination`,
      cards: [
        {
          icon: "👨‍👩‍👧‍👦",
          title: "Family-Friendly",
          text: "Dedicated toddler zones, Toddler Time on Saturdays, and programming that works for ages 2 to adult.",
        },
        {
          icon: "🛡️",
          title: "Safety First",
          text: "Professional supervision, padded equipment, safety briefings, and required grip socks for every jumper.",
        },
        {
          icon: "💪",
          title: "Fitness Focused",
          text: "Trampoline exercise burns calories while feeling like pure fun — physical activity that kids beg for.",
        },
        {
          icon: "🎮",
          title: "Always Something New",
          text: "Seasonal glow nights, themed events and new attractions keep every visit fresh.",
        },
      ],
    },
    promo: {
      tag: "Current Offers",
      headline: "Deals & Upcoming Events",
      tickerItems: [
        "Birthday Discounts Available — Book Early",
        "Toddler Time Every Saturday 9–10 AM",
        "Glow Night Coming Soon — Stay Tuned",
        "Group Rates for Schools & Camps",
        "SickKids Charity Night — Watch for Dates",
        "Members Get 20% Off Every Visit",
      ],
    },
    location: {
      tag: "Find Us",
      headline: "We're Right in\nYour Backyard",
      subtext: `Conveniently located in ${loc.region}, we're easy to reach from ${loc.serviceArea}.`,
      addressLabel: "Address",
      phoneLabel: "Phone",
      emailLabel: "Party Inquiries",
      hoursTitle: "Hours of Operation",
      directionsLabel: "Get Directions →",
    },
    finalCta: {
      headline: "Ready to Jump In?",
      subtext: `${loc.display}'s most exciting indoor attraction is waiting for you. Book your session in 60 seconds — no waiting in line required.`,
      bookLabel: "Book Jump Session →",
      partyLabel: "Plan a Party",
      waiverLabel: "Sign Waiver",
    },
  };
}

function ensureColumnExists(sheet) {
  const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  const headers = headerRange.getValues()[0];
  let colIdx = headers.indexOf(COLUMN_NAME);
  if (colIdx === -1) {
    const newCol = sheet.getLastColumn() + 1;
    sheet.getRange(1, newCol).setValue(COLUMN_NAME);
    colIdx = newCol - 1;
    Logger.log(`Added new column ${COLUMN_NAME} at index ${newCol}`);
  }
  return colIdx + 1; // 1-based column number
}

function getHeaderMap(sheet) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const map = {};
  headers.forEach((h, i) => { if (h) map[h] = i + 1; });
  return map;
}

function updatePageJsonDataAll() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error(`Sheet not found: ${SHEET_NAME}`);

  ensureColumnExists(sheet);
  const headerMap = getHeaderMap(sheet);
  const pathCol = headerMap["path"];
  const locationCol = headerMap["location"];
  const jsonCol = headerMap[COLUMN_NAME];
  if (!pathCol || !locationCol || !jsonCol) {
    throw new Error("Missing required columns: path, location, or page-json-data");
  }

  const lastRow = sheet.getLastRow();
  const allData = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();

  let updated = 0;
  LOCATIONS.forEach((loc) => {
    const json = buildPageJson(loc);
    const jsonStr = JSON.stringify(json);
    let found = false;
    for (let i = 0; i < allData.length; i++) {
      const row = allData[i];
      if (
        String(row[pathCol - 1]).trim() === "home" &&
        String(row[locationCol - 1]).trim() === loc.slug
      ) {
        sheet.getRange(i + 2, jsonCol).setValue(jsonStr);
        updated++;
        found = true;
        Logger.log(`Updated home row for ${loc.slug} (sheet row ${i + 2})`);
        break;
      }
    }
    if (!found) Logger.log(`WARNING: No home row found for ${loc.slug}`);
  });

  Logger.log(`Done. Updated ${updated} rows.`);
  SpreadsheetApp.getActive().toast(`Updated ${updated} home rows with page-json-data`);
}
