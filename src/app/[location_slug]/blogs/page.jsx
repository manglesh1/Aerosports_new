import '../../styles/blogs.css'
import React from "react";
import { getDataByParentId } from '@/utils/customFunctions';
import Link from 'next/link';
import { fetchMenuData, generateMetadataLib, fetchsheetdata, generateSchema } from "@/lib/sheets";

export async function generateMetadata({ params }) {
  const metadata = await generateMetadataLib({
    location: params.location_slug,
    category: '',
    page: 'blogs'
  });
  return metadata;
}

function stripHtml(html) {
  return html?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() || '';
}

const page = async ({ params }) => {
  const location_slug = params?.location_slug;
  const [data, locationData] = await Promise.all([
    fetchMenuData(location_slug),
    fetchsheetdata('locations', location_slug),
  ]);

  const blogsData = getDataByParentId(data, "blogs");
  const extractBlogData = blogsData[0]?.children;
  const jsonLDschema = await generateSchema(blogsData[0], locationData, '', 'blogs');

  return (
    <main className="aero-blog-main-section">
      <section className='aero-max-container'>
        <h1 className="aero-blog-main-heading">{blogsData[0]?.title}</h1>

        <div className="aero-blog-listing-grid">
          {extractBlogData?.map((item, i) => (
            <Link href={`/${location_slug}/blogs/${item?.path}`} className="aero-blog-listing-card" key={i} prefetch>
              <div className="aero-blog-listing-card-image">
                <img
                  src={item.smallimage}
                  alt={item.title || "Blog article"}
                  width={400}
                  height={250}
                  loading={i < 3 ? "eager" : "lazy"}
                />
              </div>
              <div className="aero-blog-listing-card-body">
                {item.category && (
                  <span className="aero-blog-listing-card-category">
                    {item.category.replace(/-/g, ' ')}
                  </span>
                )}
                <h2 className="aero-blog-listing-card-title">{item.title}</h2>
                <p className="aero-blog-listing-card-excerpt">
                  {item.metadescription
                    ? item.metadescription.length > 140
                      ? item.metadescription.substring(0, 140) + '...'
                      : item.metadescription
                    : stripHtml(item.section1)?.substring(0, 140) + '...'}
                </p>
                <div className="aero-blog-listing-card-footer">
                  <span className="aero-blog-listing-card-date">{item.pageid}</span>
                  <span className="aero-blog-listing-card-readmore">Read More →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <script type="application/ld+json" suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: jsonLDschema }}
      />
    </main>
  );
};

export default page;
