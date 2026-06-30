import { fetchsheetdata, fetchMenuData, getWaiverLink, getReviewsData, generateSchema, fetchHomePageJsonData } from "../../../lib/sheets";
import { getDataByParentId } from "../../../utils/customFunctions";
import { buildLocationGroupRuntime } from "../runtime.mjs";

export async function loadLocationHomePageData(locationSlug) {
  const [
    data,
    dataconfig,
    promotions,
    locationData,
    waiverLink,
    popupData,
    pageJson,
  ] = await Promise.all([
    fetchMenuData(locationSlug),
    fetchsheetdata("config", locationSlug),
    fetchsheetdata("promotions", locationSlug),
    fetchsheetdata("locations", locationSlug),
    getWaiverLink(locationSlug),
    fetchsheetdata("popups", locationSlug),
    fetchHomePageJsonData(locationSlug),
  ]);

  const locationRuntime = buildLocationGroupRuntime(locationSlug, locationData?.[0]);
  const pj = pageJson || {};
  const locationid = locationData?.[0]?.locationid || null;
  const reviewdata = locationid ? await getReviewsData(locationid) : [];
  const estoreConfig = Array.isArray(dataconfig)
    ? dataconfig.find((item) => item.key === "estorebase")
    : null;
  const headerImage = Array.isArray(data)
    ? data.filter((item) => item.path === "home")
    : [];
  const attractionsData = Array.isArray(data)
    ? getDataByParentId(data, "attractions") || []
    : [];
  const attractions = attractionsData?.[0]?.children || [];
  const jsonLDschema = await generateSchema(
    headerImage?.[0],
    locationData,
    "",
    ""
  );

  return {
    attractions,
    dataconfig,
    estoreConfig,
    headerImage,
    jsonLDschema,
    locationData,
    locationRuntime,
    pageJson: pj,
    popupData,
    promotions,
    reviewdata,
    waiverLink,
  };
}

