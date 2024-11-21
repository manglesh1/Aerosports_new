import { fetchData } from '@/utils/fetchData';
import '../../../styles/blogs.css'
import { getDataByParentId } from '@/utils/customFunctions';

export default async function BlogDetail({params}) {

  const { location_slug, subcategory_slug } = params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [data, dataconfig] = await Promise.all([
    fetchData(
      `${API_URL}/fetchsheetdata?sheetname=Data&location=${location_slug}`
    ),
    fetchData(
      `${API_URL}/fetchsheetdata?sheetname=config&location=${location_slug}`
    ),
  ]);

  const attractionsData = getDataByParentId(data, subcategory_slug);
  const header_image = getDataByParentId(data, subcategory_slug);
  console.log(attractionsData);

  return (
    <main className="aero_home-actionbtn-bg">
      <section className="aero-max-container">
        <div className="aero-blog-detail-main-section">
          <div className="aero-blog-img-section aero-blog-detail-img-section">
            <img
              src="https://storage.googleapis.com/aerosports/common/gallery-thummbnail-wall-climbwall.jpg"
              alt=""
              width='100%'
            />
          </div>
          <div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo
            reiciendis, excepturi, mollitia harum beatae impedit quas quos fugit
            minus vitae alias, iusto iste fuga sed deleniti? Consectetur magni
            eum harum.
          </div>
        </div>
      </section>
    </main>
  );
}
