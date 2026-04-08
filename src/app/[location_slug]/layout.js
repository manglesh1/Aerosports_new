import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SignWaiver from "@/components/SignWaiver";
import { fetchMenuData, fetchsheetdata, getReviewsData, fetchPricingTableData } from "@/lib/sheets";
export default async function LocationLayout({ children, params }) {
	const location_slug = params?.location_slug;

	// Fetch location data first (needed for reviews), then parallelize everything
	const locationData = await fetchsheetdata('locations', location_slug);
	const locationid = locationData?.[0]?.locationid || null;

	const [menudata, configdata, pricingData, promotions, reviewdata] = await Promise.all([
		fetchMenuData(location_slug),
		fetchsheetdata('config', location_slug),
		fetchPricingTableData(location_slug),
		fetchsheetdata('promotions', location_slug),
		locationid ? getReviewsData(locationid) : Promise.resolve([]),
	]);


	const waiverConfig = Array.isArray(configdata)
		? configdata.find((item) => item.key === "waiver")
		: null;
	const waiverUrl = waiverConfig?.value || null;

	return (
		<div>
			<Header location_slug={location_slug} configdata={configdata} menudata={menudata} pricingData={pricingData} locationData={locationData} promotions={promotions} />
			{children}
			<Footer
				location_slug={location_slug}
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
