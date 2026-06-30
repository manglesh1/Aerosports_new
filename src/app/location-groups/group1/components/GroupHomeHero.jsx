import HeroV2 from "@/components/home-v2/HeroV2";

export default function GroupHomeHero({
  estoreConfig,
  headerImage,
  locationData,
  locationDisplay,
  locationSlug,
  waiverLink,
}) {
  return (
    <HeroV2
      headerImage={headerImage}
      locationData={locationData}
      estoreConfig={estoreConfig}
      waiverLink={waiverLink}
      locationSlug={locationSlug}
      locationDisplay={locationDisplay}
      badgeText={`Group 1 Experience in ${locationDisplay}`}
      subtitleText="Windsor and St. Catharines use the Group 1 home experience and Group 1 business rules."
    />
  );
}

