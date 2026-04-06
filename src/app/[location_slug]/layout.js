import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchMenuData, fetchsheetdata, getReviewsData, fetchPricingTableData } from "@/lib/sheets";
export default async function LocationLayout({ children, params }) {
	const location_slug = params?.location_slug;

	const [menudata, configdata, locationData, pricingData] = await Promise.all([
		fetchMenuData(location_slug),
		fetchsheetdata('config', location_slug),
		fetchsheetdata('locations', location_slug),
		fetchPricingTableData(location_slug),
	]);

	const locationid = locationData?.[0]?.locationid || null;
	const reviewdata = await getReviewsData(locationid)


	return (
		<div>
			<Header location_slug={location_slug} configdata={configdata} menudata={menudata} pricingData={pricingData} />
			{children}
			<Footer
				location_slug={location_slug}
				configdata={configdata}
				menudata={menudata}
				reviewdata={reviewdata}
				locationData={locationData}
			/>
			<div id="modal-root"></div>
		</div>
	);
}
