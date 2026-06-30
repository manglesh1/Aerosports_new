import "../../../styles/home-v2.css";
import "../../../styles/promotions.css";
import "../../../styles/kidsparty.css";
import LocationPopupModal from "@/components/model/LocationPopupModal";
import HighlightsV2 from "@/components/home-v2/HighlightsV2";
import AttractionsV2 from "@/components/home-v2/AttractionsV2";
import PartyV2 from "@/components/home-v2/PartyV2";
import SocialProofV2 from "@/components/home-v2/SocialProofV2";
import WhyChooseV2 from "@/components/home-v2/WhyChooseV2";
import PromoV2 from "@/components/home-v2/PromoV2";
import LocationV2 from "@/components/home-v2/LocationV2";
import FinalCtaV2 from "@/components/home-v2/FinalCtaV2";
import GroupHomeHero from "../components/GroupHomeHero.jsx";
import GroupVisitPlanner from "../components/GroupVisitPlanner.jsx";

export default function LocationHomePage({
  attractions,
  estoreConfig,
  headerImage,
  jsonLDschema,
  locationData,
  locationRuntime,
  pageJson,
  popupData,
  promotions,
  reviewdata,
  waiverLink,
}) {
  const displayName = locationRuntime.experience.displayName;

  return (
    <main className="hv2" style={{ margin: 0, padding: 0 }} data-location-group="group1">
      <LocationPopupModal popupData={popupData} />

      <GroupHomeHero
        estoreConfig={estoreConfig}
        headerImage={headerImage}
        locationData={locationData}
        locationDisplay={displayName}
        locationSlug={locationRuntime.location.slug}
        waiverLink={waiverLink}
      />

      <HighlightsV2
        reviewdata={reviewdata}
        attractionsCount={attractions.length}
        locationDisplay={displayName}
      />

      {attractions.length > 0 && (
        <AttractionsV2
          attractions={attractions}
          locationSlug={locationRuntime.location.slug}
          locationDisplay={displayName}
        />
      )}

      <GroupVisitPlanner
        estoreConfig={estoreConfig}
        locationSlug={locationRuntime.location.slug}
        waiverLink={waiverLink}
      />

      <PartyV2
        locationSlug={locationRuntime.location.slug}
        locationData={locationData}
        locationDisplay={displayName}
        partyImages={pageJson.partyImages}
      />

      <SocialProofV2 reviewdata={reviewdata} locationData={locationData} />
      <WhyChooseV2 locationDisplay={displayName} />
      <PromoV2 promotions={promotions} locationSlug={locationRuntime.location.slug} />
      <LocationV2 locationData={locationData} reviewdata={reviewdata} />

      <FinalCtaV2
        locationSlug={locationRuntime.location.slug}
        estoreConfig={estoreConfig}
        waiverLink={waiverLink}
      />

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: jsonLDschema }}
      />
    </main>
  );
}
