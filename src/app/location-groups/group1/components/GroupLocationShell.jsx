import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SignWaiver from "@/components/SignWaiver";

export default function GroupLocationShell({
  children,
  configdata,
  locationData,
  locationRuntime,
  locationSlug,
  menudata,
  pricingData,
  promotions,
  reviewdata,
  waiverUrl,
}) {
  return (
    <div
      data-location-group={locationRuntime.group.key}
      data-location-slug={locationRuntime.location.slug}
      data-group-code="group1"
    >
      <Header
        location_slug={locationSlug}
        configdata={configdata}
        menudata={menudata}
        pricingData={pricingData}
        locationData={locationData}
        promotions={promotions}
      />
      {children}
      <Footer
        location_slug={locationSlug}
        configdata={configdata}
        menudata={menudata}
        reviewdata={reviewdata}
        locationData={locationData}
      />
      <SignWaiver waiverUrl={waiverUrl} />
      <div id="modal-root"></div>
    </div>
  );
}

