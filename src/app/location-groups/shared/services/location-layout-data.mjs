import { fetchMenuData, fetchsheetdata, getReviewsData, fetchPricingTableData } from "../../../lib/sheets";
import { buildLocationGroupRuntime } from "../runtime.mjs";

export async function loadLocationLayoutData(locationSlug) {
  const locationData = await fetchsheetdata("locations", locationSlug);
  const locationRuntime = buildLocationGroupRuntime(locationSlug, locationData?.[0]);

  if (!locationRuntime || !locationData || locationData.length === 0) {
    return null;
  }

  const locationid = locationData?.[0]?.locationid || null;

  const [menudata, configdata, pricingData, promotions, reviewdata] = await Promise.all([
    fetchMenuData(locationSlug),
    fetchsheetdata("config", locationSlug),
    fetchPricingTableData(locationSlug),
    fetchsheetdata("promotions", locationSlug),
    locationid ? getReviewsData(locationid) : Promise.resolve([]),
  ]);

  const waiverConfig = Array.isArray(configdata)
    ? configdata.find((item) => item.key === "waiver")
    : null;

  return {
    configdata,
    locationData,
    locationRuntime,
    menudata,
    pricingData,
    promotions,
    reviewdata,
    waiverUrl: waiverConfig?.value || null,
  };
}

