import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SignWaiver from "@/components/SignWaiver";
import { fetchMenuData, fetchsheetdata, getReviewsData, fetchPricingTableData } from "@/lib/sheets";

// Validate location exists during metadata resolution (before streaming starts)
// This ensures proper 404 status code instead of Soft 404
export async function generateMetadata({ params }) {
	const locationData = await fetchsheetdata('locations', params?.location_slug);
	if (!locationData || locationData.length === 0) {
		notFound();
	}
	// Return empty metadata - page-level generateMetadata will provide the actual values
	return {};
}

export default async function LocationLayout({ children, params }) {
	const location_slug = params?.location_slug;

	// Fetch location data first (needed for reviews), then parallelize everything
	const locationData = await fetchsheetdata('locations', location_slug);

	// Return 404 if location doesn't exist
	if (!locationData || locationData.length === 0) {
		notFound();
	}

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
