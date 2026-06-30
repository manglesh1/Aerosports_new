const FALLBACK_SHEET_URL =
  process.env.SHEET_URL ||
  "https://docs.google.com/spreadsheets/d/1B_9EaTQDztWGH_cD3lUP7hpWD6FvNBJ-6Czml2x7d9c/export?format=xlsx";

const DEFAULT_LOCATION_GROUP_KEY =
  process.env.DEFAULT_LOCATION_GROUP_KEY || "group2";

export const LOCATION_GROUPS = {
  group1: {
    key: "group1",
    label: "Group 1",
    description: "Windsor and St. Catharines experience stack.",
    sheetUrl: process.env.GROUP1_SHEET_URL || FALLBACK_SHEET_URL,
    locations: [
      { slug: "windsor", displayName: "Windsor", provinceCode: "ON" },
      { slug: "st-catharines", displayName: "St. Catharines", provinceCode: "ON" },
    ],
    experience: {
      heroBadgeTemplate: "AeroSports {location} Group One Experience",
      heroSubtitle:
        "Trampolines, ninja courses, dodgeball and more with the Group One content stack.",
      planSectionLabel: "Plan Your Group One Visit",
    },
  },
  group2: {
    key: "group2",
    label: "Group 2",
    description: "Oakville, London and Scarborough experience stack.",
    sheetUrl: process.env.GROUP2_SHEET_URL || FALLBACK_SHEET_URL,
    locations: [
      { slug: "oakville", displayName: "Oakville", provinceCode: "ON" },
      { slug: "london", displayName: "London", provinceCode: "ON" },
      { slug: "scarborough", displayName: "Scarborough", provinceCode: "ON" },
    ],
    experience: {
      heroBadgeTemplate: "AeroSports {location} Group Two Experience",
      heroSubtitle:
        "Trampolines, ninja courses, dodgeball and more with the Group Two content stack.",
      planSectionLabel: "Plan Your Group Two Visit",
    },
  },
};

function normalizeLocationSlug(value) {
  return String(value || "").trim().toLowerCase();
}

function createSourceCacheKey(url) {
  return String(url)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getGroupEntries() {
  return Object.values(LOCATION_GROUPS);
}

function getLocationMap() {
  return getGroupEntries().reduce((map, group) => {
    group.locations.forEach((location) => {
      map.set(location.slug, {
        ...location,
        groupKey: group.key,
        groupLabel: group.label,
      });
    });
    return map;
  }, new Map());
}

export function getDefaultLocationGroup() {
  return LOCATION_GROUPS[DEFAULT_LOCATION_GROUP_KEY] || LOCATION_GROUPS.group2;
}

export function getAllKnownLocationSlugs() {
  return Array.from(getLocationMap().keys());
}

export function getAllKnownLocations() {
  return Array.from(getLocationMap().values());
}

export function resolveLocationGroup(locationSlug) {
  const normalizedSlug = normalizeLocationSlug(locationSlug);
  if (!normalizedSlug) {
    return null;
  }

  const location = getLocationMap().get(normalizedSlug);
  if (!location) {
    return null;
  }

  return {
    location,
    group: LOCATION_GROUPS[location.groupKey],
  };
}

export function isKnownLocationSlug(locationSlug) {
  return Boolean(resolveLocationGroup(locationSlug));
}

export function resolveLocationRequest(pathname) {
  const segments = String(pathname || "/")
    .split("/")
    .filter(Boolean);
  const firstSegment = normalizeLocationSlug(segments[0]);

  if (!firstSegment) {
    return {
      type: "default",
      pathname,
      segment: null,
      group: getDefaultLocationGroup(),
      location: null,
    };
  }

  const match = resolveLocationGroup(firstSegment);
  if (!match) {
    return {
      type: "default",
      pathname,
      segment: firstSegment,
      group: getDefaultLocationGroup(),
      location: null,
    };
  }

  return {
    type: "location",
    pathname,
    segment: firstSegment,
    ...match,
  };
}

function buildSource(group) {
  return {
    groupKey: group.key,
    url: group.sheetUrl,
    cacheKey: createSourceCacheKey(group.sheetUrl),
  };
}

export function resolveSheetSourcesForLocation(locationSlug) {
  const normalizedSlug = normalizeLocationSlug(locationSlug);

  if (!normalizedSlug) {
    return [buildSource(getDefaultLocationGroup())];
  }

  if (normalizedSlug === "all") {
    const sourcesByCacheKey = new Map();
    getGroupEntries().forEach((group) => {
      const source = buildSource(group);
      if (!sourcesByCacheKey.has(source.cacheKey)) {
        sourcesByCacheKey.set(source.cacheKey, source);
      }
    });
    return Array.from(sourcesByCacheKey.values());
  }

  const match = resolveLocationGroup(normalizedSlug);
  if (!match) {
    return [buildSource(getDefaultLocationGroup())];
  }

  return [buildSource(match.group)];
}

