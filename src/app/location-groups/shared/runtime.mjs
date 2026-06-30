import { LOCATION_GROUPS, resolveLocationGroup } from "../../lib/location-groups.mjs";
import { buildGroupOneLocationExperience } from "../group1/controllers/location-experience-controller.mjs";
import { buildGroupTwoLocationExperience } from "../group2/controllers/location-experience-controller.mjs";

const EXPERIENCE_BUILDERS = {
  group1: buildGroupOneLocationExperience,
  group2: buildGroupTwoLocationExperience,
};

export async function loadGroupHomePageComponent(groupKey) {
  if (groupKey === "group1") {
    return (await import("../group1/pages/LocationHomePage.jsx")).default;
  }

  return (await import("../group2/pages/LocationHomePage.jsx")).default;
}

export async function loadGroupLocationShellComponent(groupKey) {
  if (groupKey === "group1") {
    return (await import("../group1/components/GroupLocationShell.jsx")).default;
  }

  return (await import("../group2/components/GroupLocationShell.jsx")).default;
}

export function buildLocationGroupRuntime(locationSlug, locationData) {
  const match = resolveLocationGroup(locationSlug);

  if (!match) {
    return null;
  }

  const groupConfig = LOCATION_GROUPS[match.group.key];
  const buildExperience =
    EXPERIENCE_BUILDERS[match.group.key] || buildGroupTwoLocationExperience;

  return {
    ...match,
    groupConfig,
    experience: buildExperience({
      locationSlug: match.location.slug,
      locationData,
      groupConfig,
    }),
  };
}
