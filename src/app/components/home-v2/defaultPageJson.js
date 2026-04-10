/**
 * No default content. The home page reads everything from the
 * `page-json-data` column on the Data sheet for each location.
 * Sections without data render nothing (or render with empty fields).
 */

export const defaultPageJson = {};

/**
 * Deep merge: sheet JSON values override defaults; arrays are replaced wholesale.
 */
function deepMerge(target, source) {
  if (Array.isArray(source)) return source;
  if (source && typeof source === "object") {
    const out = { ...(target || {}) };
    for (const key of Object.keys(source)) {
      out[key] = deepMerge(target ? target[key] : undefined, source[key]);
    }
    return out;
  }
  return source !== undefined ? source : target;
}

/**
 * Replace {{display}} placeholders inside string values with the location's display name.
 */
function applyTokens(value, tokens) {
  if (typeof value === "string") {
    return value.replace(/\{\{(\w+)\}\}/g, (m, key) =>
      tokens[key] != null ? tokens[key] : m
    );
  }
  if (Array.isArray(value)) return value.map((v) => applyTokens(v, tokens));
  if (value && typeof value === "object") {
    const out = {};
    for (const k of Object.keys(value)) out[k] = applyTokens(value[k], tokens);
    return out;
  }
  return value;
}

export function buildPageJson(sheetJson, tokens = {}) {
  const merged = deepMerge(defaultPageJson, sheetJson || {});
  return applyTokens(merged, tokens);
}
