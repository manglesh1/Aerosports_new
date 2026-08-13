import { notFound } from "next/navigation";
import "../../../styles/blogs.css";
import "../../../styles/blog-content.css";
import { getDataByParentId, sanitizeCmsHtml } from "@/utils/customFunctions";
import { fetchPageData, fetchMenuData, generateMetadataLib, fetchsheetdata } from "@/lib/sheets";
import Link from 'next/link';
import AppImage from "@/components/AppImage";

import { resolveLocationGroup } from "@/lib/location-groups.mjs";
import Group2BlogDetail from "@g2/pages/Group2BlogDetail";
import { generateMetadataLib as generateMetadataLibG2 } from "@g2/lib/sheets";

const isGroup2 = (slug) => resolveLocationGroup(slug)?.group?.key === "group2";

export async function generateMetadata({ params }) {
  const { location_slug, slug } = params;
  if (isGroup2(location_slug)) {
    const blogData = await fetchPageData(location_slug, slug);
    if (!blogData || !blogData.path) {
      notFound();
    }

    return await generateMetadataLibG2({
      location: location_slug,
      category: 'blogs',
      page: slug
    });
  }
  // Validate blog post exists before generating metadata
  const blogData = await fetchPageData(location_slug, slug);
  if (!blogData || !blogData.path) {
    notFound();
  }
  const metadata = await generateMetadataLib({
    location: location_slug,
    category: 'blogs',
    page: slug
  });
  return metadata;
}

function stripHtml(html) {
  return html?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() || '';
}

function getReadingTime(html) {
  const text = stripHtml(html);
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function generateBlogSchema(blogData, locationData, slug, BASE_URL) {
  const location = blogData?.location || '';
  const fullUrl = `${BASE_URL}/${location}/blogs/${slug}`;
  const imageUrl = blogData?.headerimage?.startsWith("http")
    ? blogData.headerimage
    : `${BASE_URL}${blogData?.headerimage || ""}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blogData?.metatitle || blogData?.title || "",
    "description": blogData?.metadescription || blogData?.smalltext || "",
    "image": imageUrl,
    "url": fullUrl,
    "datePublished": blogData?.createdon || blogData?.pageid || new Date().toISOString().split('T')[0],
    "dateModified": blogData?.modifiedon || blogData?.createdon || new Date().toISOString().split('T')[0],
    "author": {
      "@type": "Organization",
      "name": "AeroSports Trampoline Park",
      "url": BASE_URL
    },
    "publisher": {
      "@type": "Organization",
      "name": "AeroSports Trampoline Park",
      "url": BASE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": fullUrl
    },
    "wordCount": stripHtml(blogData?.section1).split(/\s+/).filter(Boolean).length,
    "articleBody": stripHtml(blogData?.section1).substring(0, 500)
  };

  return JSON.stringify(schema);
}

export default async function BlogDetail({ params }) {
  if (isGroup2(params?.location_slug)) return <Group2BlogDetail params={params} />;

  const { location_slug, slug } = params;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const [blogData, menuData, locationData] = await Promise.all([
    fetchPageData(location_slug, slug),
    fetchMenuData(location_slug),
    fetchsheetdata('locations', location_slug),
  ]);

  // Return 404 if blog post doesn't exist
  if (!blogData || !blogData.path) {
    notFound();
  }

  const extractBlogData = (await getDataByParentId(menuData, "blogs"))[0]?.children?.filter(child => child.path !== slug);
  const readingTime = getReadingTime(blogData?.section1);
  const jsonLDschema = generateBlogSchema(blogData, locationData, slug, BASE_URL);

  return (
    <main className="aero_home-actionbtn-bg">
      <section className="aero-max-container">
        {/* Blog Header */}
        <article className="aero-blog-detail-main-section">
          <div className="aero-blog-detail-header">
            {blogData?.category && (
              <Link href={`/${location_slug}/blogs`} className="aero-blog-detail-category">
                {blogData.category.replace(/-/g, ' ')}
              </Link>
            )}
            <h1 className="aero-blog-detail-title">{blogData?.title}</h1>
            {blogData?.smalltext && (
              <p className="aero-blog-detail-smalltext">{blogData.smalltext}</p>
            )}
            <div className="aero-blog-detail-meta">
              {blogData?.pageid && <span className="aero-blog-detail-date">{blogData.pageid}</span>}
              <span className="aero-blog-detail-reading-time">{readingTime} min read</span>
            </div>
          </div>

          {/* Hero Image */}
          <div className="aero-blog-detail-hero">
            <AppImage
              src={blogData?.headerimage}
              alt={blogData?.headerimagetitle || blogData?.title}
              width={1200}
              height={630}
              priority
              sizes="100vw"
              style={{ width: '100%', height: 'auto', borderRadius: '16px' }}
            />
          </div>

          {/* Blog Content */}
          <div
            className="aero-blog-content"
            dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(blogData?.section1) }}
          />
        </article>

        {/* Related Blogs */}
        {extractBlogData?.length > 0 && (
          <section className="aero-blog-related-section">
            <div className="aero-blog-related-header">
              <h2 className="aero-blog-related-title">More Articles</h2>
              <Link href={`/${location_slug}/blogs`} className="aero-blog-related-viewall">
                View All Articles →
              </Link>
            </div>
            <div className="aero-blog-main-article-wrapper">
              {extractBlogData?.slice(0, 4).map((item, i) => (
                <article className="aero-blog-main-article-card" key={i}>
                  <div className="aero-blog-img-section">
                    <Link href={`/${location_slug}/blogs/${item?.path}`} prefetch>
                      <AppImage src={item.smallimage} alt={item.title || "Blog article"} width={400} height={300} sizes="(max-width: 768px) 100vw, 33vw" />
                    </Link>
                  </div>
                  <div className="aero-blog-content-section">
                    <span className='aero-blog-updated-time'>{item.pageid}</span>
                    <Link href={`/${location_slug}/blogs/${item?.path}`} prefetch><h3 className='aero-blog-second-heading'>{item.title}</h3></Link>
                    <Link href={`/${location_slug}/blogs/${item?.path}`} prefetch className='aero-blog-readmore-btn' aria-label={`Read more about ${item.title}`}>Read More: {item.title}</Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </section>

      <script type="application/ld+json" suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: jsonLDschema }}
      />
    </main>
  );
}
