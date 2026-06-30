import test from "node:test";
import assert from "node:assert/strict";

import {
  getAllKnownLocationSlugs,
  isKnownLocationSlug,
  resolveLocationGroup,
  resolveLocationRequest,
  resolveSheetSourcesForLocation,
} from "../../../lib/location-groups.mjs";
import { buildLocationGroupRuntime } from "../runtime.mjs";

test("resolves group1 locations", () => {
  const match = resolveLocationGroup("windsor");
  assert.equal(match.group.key, "group1");
  assert.equal(match.location.slug, "windsor");
});

test("resolves group2 locations", () => {
  const match = resolveLocationGroup("oakville");
  assert.equal(match.group.key, "group2");
  assert.equal(match.location.slug, "oakville");
});

test("returns default request type for root path", () => {
  const request = resolveLocationRequest("/");
  assert.equal(request.type, "default");
  assert.equal(request.segment, null);
});

test("marks invalid locations as unknown", () => {
  assert.equal(isKnownLocationSlug("mississauga"), false);
});

test("returns both sheet sources for all locations", () => {
  const sources = resolveSheetSourcesForLocation("all");
  assert.ok(sources.length >= 1);
});

test("builds runtime with group-specific experience data", () => {
  const runtime = buildLocationGroupRuntime("st-catharines", {
    location: "st-catharines",
  });

  assert.equal(runtime.group.key, "group1");
  assert.match(runtime.experience.heroBadgeText, /St\. Catharines/i);
});

test("lists all registered location slugs", () => {
  assert.deepEqual(getAllKnownLocationSlugs().sort(), [
    "london",
    "oakville",
    "scarborough",
    "st-catharines",
    "windsor",
  ]);
});
