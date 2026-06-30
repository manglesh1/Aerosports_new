const DAY_MS = 24 * 60 * 60 * 1000;

const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getField = (row, names) => {
  if (!row || typeof row !== "object") return "";
  const wanted = new Set(names.map(normalize));
  const key = Object.keys(row).find((item) => wanted.has(normalize(item)));
  return key ? row[key] : "";
};

const parseDate = (value, endOfDay = false) => {
  if (!value) return null;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const date = new Date(value);
    if (endOfDay) date.setHours(23, 59, 59, 999);
    else date.setHours(0, 0, 0, 0);
    return date;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    const date = new Date(Date.UTC(1899, 11, 30) + value * DAY_MS);
    if (endOfDay) date.setUTCHours(23, 59, 59, 999);
    else date.setUTCHours(0, 0, 0, 0);
    return date;
  }

  const raw = String(value).trim();
  if (!raw) return null;

  const numericDate = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (numericDate) {
    const first = Number(numericDate[1]);
    const second = Number(numericDate[2]);
    const year = Number(numericDate[3].length === 2 ? `20${numericDate[3]}` : numericDate[3]);
    const dayFirst = first > 12 || raw.includes("-");
    const day = dayFirst ? first : second;
    const month = dayFirst ? second : first;
    const date = new Date(year, month - 1, day);
    if (endOfDay) date.setHours(23, 59, 59, 999);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  if (endOfDay) parsed.setHours(23, 59, 59, 999);
  else parsed.setHours(0, 0, 0, 0);
  return parsed;
};

const cleanPath = (value) =>
  String(value || "")
    .toLowerCase()
    .split(/[?#]/)[0]
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/^\/+|\/+$/g, "")
    .trim();

const splitPaths = (value) =>
  String(value || "")
    .split(/[,|\n]/)
    .map((item) => item.trim())
    .filter(Boolean);

const monthIndexes = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

const dateFromTextParts = (monthName, dayValue, yearValue, now) => {
  const month = monthIndexes[normalize(monthName)];
  const day = Number(dayValue);
  const year = Number(yearValue) || now.getFullYear();
  if (month === undefined || !day) return null;
  const date = new Date(year, month, day, 23, 59, 59, 999);
  return Number.isNaN(date.getTime()) ? null : date;
};

const parseValidityEndDate = (value, now = new Date()) => {
  const raw = String(value || "");
  if (!raw) return null;

  const monthNames = Object.keys(monthIndexes).join("|");
  const patterns = [
    new RegExp(`(${monthNames})\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,?\\s*(\\d{4}))?`, "i"),
    new RegExp(`(\\d{1,2})(?:st|nd|rd|th)?\\s+(${monthNames})(?:,?\\s*(\\d{4}))?`, "i"),
  ];

  for (const pattern of patterns) {
    const match = raw.match(pattern);
    if (!match) continue;
    const month = Number.isNaN(Number(match[1])) ? match[1] : match[2];
    const day = Number.isNaN(Number(match[1])) ? match[2] : match[1];
    const year = match[3];
    const date = dateFromTextParts(month, day, year, now);
    if (date) return date;
  }

  return null;
};

const formatDateLabel = (value) => {
  const date = parseDate(value);
  if (!date) return String(value || "").trim();
  return date.toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const getPromotionDisplayData = (promotion) => {
  const validFrom = getField(promotion, ["valid from", "valid_from", "from"]);
  const validTo = getField(promotion, ["valid to", "valid_to", "to", "expires"]);
  const validity =
    getField(promotion, ["validity", "valid until", "valid"]) ||
    [validFrom, validTo].filter(Boolean).map(formatDateLabel).join(" - ");

  return {
    title: getField(promotion, ["title", "name", "offer", "promotion"]) || "Current Offer",
    description: getField(promotion, ["description", "details", "detail", "subtitle"]),
    code: getField(promotion, ["code", "promo code", "coupon"]),
    link: getField(promotion, ["link", "url", "booking url", "booking"]),
    linkText: getField(promotion, ["linktext", "link text", "cta", "button"]) || "Claim Offer",
    badge: getField(promotion, ["badge", "label", "tag"]),
    validity,
    validTo,
  };
};

export const isPromotionActive = (promotion, now = new Date()) => {
  const start = parseDate(getField(promotion, ["valid from", "valid_from", "from"]));
  const end = parseDate(getField(promotion, ["valid to", "valid_to", "to", "expires"]), true);
  const current = now instanceof Date ? now : new Date(now);

  if (start && current < start) return false;
  if (end && current > end) {
    const validityFallbackEnd = parseValidityEndDate(
      getField(promotion, ["validity", "valid until", "valid"]),
      current
    );
    return Boolean(validityFallbackEnd && current <= validityFallbackEnd);
  }
  return true;
};

export const promotionMatchesPath = (promotion, pagePath, locationSlug) => {
  const pathValue = getField(promotion, ["path", "page path", "page", "pages"]);
  const paths = splitPaths(pathValue);
  if (paths.length === 0) return false;

  const targetSlug = cleanPath(pagePath).split("/").pop();
  const targetFull = cleanPath(`/${locationSlug}/${pagePath}`);

  return paths.some((path) => {
    const clean = cleanPath(path);
    if (!clean || clean === "*" || clean === "all") return true;
    if (clean === targetSlug || clean === cleanPath(pagePath)) return true;
    return clean === targetFull;
  });
};

export const getActivePromotionsForPath = (promotions, options = {}) => {
  const { locationSlug = "", path = "", now = new Date(), limit = 2 } = options;
  return (Array.isArray(promotions) ? promotions : [])
    .filter((promotion) => promotionMatchesPath(promotion, path, locationSlug))
    .filter((promotion) => isPromotionActive(promotion, now))
    .slice(0, limit);
};
