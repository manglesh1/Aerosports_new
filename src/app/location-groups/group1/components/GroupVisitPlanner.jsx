import PlanV2 from "@/components/home-v2/PlanV2";

export default function GroupVisitPlanner({ estoreConfig, locationSlug, waiverLink }) {
  return (
    <PlanV2
      locationSlug={locationSlug}
      estoreConfig={estoreConfig}
      waiverLink={waiverLink}
      sectionLabel="Plan Your Group 1 Visit"
    />
  );
}

