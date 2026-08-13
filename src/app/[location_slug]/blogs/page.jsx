import '../../styles/blogs.css'
import React from "react";
import { getDataByParentId } from '@/utils/customFunctions';
import Link from 'next/link';
import { fetchMenuData, generateMetadataLib, fetchsheetdata, generateSchema } from "@/lib/sheets";
import AppImage from "@/components/AppImage";

import { resolveLocationGroup } from "@/lib/location-groups.mjs";
import Group2Blogs from "@g2/pages/Group2Blogs";
import { generateMetadataLib as generateMetadataLibG2 } from "@g2/lib/sheets";

const isGroup2 = (slug) => resolveLocationGroup(slug)?.group?.key === "group2";

export async function generateMetadata({ params }) {
  if (isGroup2(params.location_slug)) {
    return await generateMetadataLibG2({
      location: params.location_slug,
      category: '',
      page: 'blogs'
    });
  }
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
  if (isGroup2(params?.location_slug)) return <Group2Blogs params={params} />;

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
        {blogsData[0]?.smalltext && (
          <p className="aero-blog-main-smalltext">{blogsData[0].smalltext}</p>
        )}

        <div className="aero-blog-listing-grid">
          {extractBlogData?.map((item, i) => (
            <Link href={`/${location_slug}/blogs/${item?.path}`} className="aero-blog-listing-card" key={i} prefetch>
              <div className="aero-blog-listing-card-image">
                <AppImage
                  src={item.smallimage}
                  alt={item.smallimage_media?.alt || item.title || "Blog article"}
                  width={400}
                  height={250}
                  priority={i < 3}
                  sizes="(max-width: 768px) 100vw, 33vw"
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
