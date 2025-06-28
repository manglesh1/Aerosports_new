import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchMenuData, fetchsheetdata } from "@/lib/sheets";
import { fetchData1 } from "@/utils/fetchData";

export default async function LocationLayout({ children, params }) {
  const location_slug = params?.location_slug;

  const [menudata, configdata, sheetdata] = await Promise.all([
    fetchMenuData(location_slug),
    fetchsheetdata('config', location_slug),
    fetchsheetdata('locations', location_slug)
  ]);

  const locationid = sheetdata?.[0]?.locationid || null;
  const ratingdata = locationid
    ? await fetchData1(`${process.env.NEXT_PUBLIC_API_URL}/getreviews?locationid=${locationid}`)
    : null;

  return (
    <div>
      <Header location_slug={location_slug} menudata={menudata} configdata={configdata} />
      {children}
      <Footer
        location_slug={location_slug}
        configdata={sheetdata}
        menudata={menudata}
        ratingdata={ratingdata}
      />
      <div id="modal-root"></div>
    </div>
  );
}
