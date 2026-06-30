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
      badgeText={`Group 2 Experience in ${locationDisplay}`}
      subtitleText="Oakville, London and Scarborough use the Group 2 home experience and Group 2 business rules."
    />
  );
}

