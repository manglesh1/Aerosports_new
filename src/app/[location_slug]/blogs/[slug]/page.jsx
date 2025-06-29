import { fetchData } from "@/utils/fetchData";
import "../../../styles/blogs.css";
import { getDataByBlogId } from "@/utils/customFunctions";
import { fetchsheetdata, generateMetadataLib } from "@/lib/sheets";

export async function generateMetadata({ params }) {
  const { location_slug, slug } = params;
  const metadata = await generateMetadataLib({
    location: location_slug,
    category: 'blogs',
    page: slug
  });
  return metadata;
}

export default async function BlogDetail({ params }) {
  const { location_slug, slug } = params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
const data = await fetchsheetdata('Data', location_slug);
 // const data = await fetchData(
 //   `${API_URL}/fetchsheetdata?sheetname=blogs&location=${location_slug}`
 // );
 
  const blogData = getDataByBlogId(data, slug);

  return (
    <main className="aero_home-actionbtn-bg">
      <section className="aero-max-container">
        <div className="aero-blog-detail-main-section">
          <div className="aero-blog-img-section aero-blog-detail-img-section">
          <img src={blogData?.headerimage} alt="" width="100%" />
          </div>
          <div
            className="aero-blog-detail-content-section"
            dangerouslySetInnerHTML={{ __html: blogData?.section1 || "" }}
          ></div>
        </div>
      </section>
    </main>
  );
}
