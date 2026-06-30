function formatDisplayName(locationData, fallbackSlug) {
  const rawName = locationData?.location || fallbackSlug || "";
  return String(rawName)
    .split("-")
    .map((segment) =>
      segment === "st"
        ? "St."
        : segment.charAt(0).toUpperCase() + segment.slice(1)
    )
    .join(" ");
}

export function buildGroupOneLocationExperience({
  locationSlug,
  locationData,
  groupConfig,
}) {
  const displayName = formatDisplayName(locationData, locationSlug);

  return {
    displayName,
    heroBadgeText: groupConfig.experience.heroBadgeTemplate.replace(
      "{location}",
      displayName
    ),
    heroSubtitle: groupConfig.experience.heroSubtitle,
    planSectionLabel: groupConfig.experience.planSectionLabel,
  };
}

