import { fetchData } from "@/utils/fetchData";
import "../../../styles/blogs.css";
import { getDataByBlogId } from "@/utils/customFunctions";

export default async function BlogDetail({ params }) {
  const { location_slug, slug } = params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const data = await fetchData(
    `${API_URL}/fetchsheetdata?sheetname=blogs&location=${location_slug}`
  );
  const blogData = getDataByBlogId(data, slug);

  return (
    <main className="aero_home-actionbtn-bg">
      <section className="aero-max-container">
        <div className="aero-blog-detail-main-section">
          <div className="aero-blog-img-section aero-blog-detail-img-section">
            <img
              src="https://storage.googleapis.com/aerosports/common/gallery-thummbnail-wall-climbwall.jpg"
              alt=""
              width="100%"
            />
          </div>
          <div
            className="aero-blog-detail-content-section"
            dangerouslySetInnerHTML={{ __html: blogData?.htmldesc || "" }}
          ></div>
        </div>
      </section>
    </main>
  );
}
