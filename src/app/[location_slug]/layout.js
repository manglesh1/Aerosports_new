import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SignWaiver from "@/components/SignWaiver";
import MobileActionBar from "@/components/MobileActionBar";
import PathGallerySection from "@/components/PathGallerySection";
import "../styles/gallery.css";
import { fetchMenuData, fetchsheetdata, getReviewsData } from "@/lib/sheets";

// Group2 (oakville/london/scarborough) uses its own ported shell + sheet.
import { resolveLocationGroup } from "@/lib/location-groups.mjs";
import Group2LocationLayout from "@g2/pages/Group2LocationLayout";
import { fetchsheetdata as fetchsheetdataG2 } from "@g2/lib/sheets";

const isGroup2 = (slug) => resolveLocationGroup(slug)?.group?.key === "group2";

// Validate location exists during metadata resolution (before streaming starts)
// This ensures proper 404 status code instead of Soft 404
export async function generateMetadata({ params }) {
	const slug = params?.location_slug;
	const fetcher = isGroup2(slug) ? fetchsheetdataG2 : fetchsheetdata;
	const locationData = await fetcher('locations', slug);
	if (!locationData || locationData.length === 0) {
		notFound();
	}
	// Return empty metadata - page-level generateMetadata will provide the actual values
	return {};
}

export default async function LocationLayout({ children, params }) {
	const location_slug = params?.location_slug;

	// Group2 cities render the ported group2 shell (own Header/Footer + own sheet).
	if (isGroup2(location_slug)) {
		return (
			<Group2LocationLayout location_slug={location_slug}>
				{children}
			</Group2LocationLayout>
		);
	}

	// Fetch location data first (needed for reviews), then parallelize everything
	const locationData = await fetchsheetdata('locations', location_slug);

	// Return 404 if location doesn't exist
	if (!locationData || locationData.length === 0) {
		notFound();
	}

	const locationid = locationData?.[0]?.locationid || null;

	const [menudata, configdata, promotions, reviewdata] = await Promise.all([
		fetchMenuData(location_slug),
		fetchsheetdata('config', location_slug),
		fetchsheetdata('promotions', location_slug),
		locationid ? getReviewsData(locationid) : Promise.resolve([]),
	]);


	const waiverConfig = Array.isArray(configdata)
		? configdata.find((item) => item.key === "waiver")
		: null;
	const waiverUrl = waiverConfig?.value || null;

	const locationName = locationData?.[0]?.displayName || location_slug;

	return (
		<div>
			<Header location_slug={location_slug} configdata={configdata} menudata={menudata} locationData={locationData} promotions={promotions} />
			{children}
			<PathGallerySection locationSlug={location_slug} />
			<Footer
				location_slug={location_slug}
				configdata={configdata}
				menudata={menudata}
				reviewdata={reviewdata}
				locationData={locationData}
			/>
			<SignWaiver waiverUrl={waiverUrl} />
			<MobileActionBar waiverUrl={waiverUrl} locationName={locationName} />
			<div id="modal-root"></div>
		</div>
	);
}
