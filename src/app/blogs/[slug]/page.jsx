import { notFound } from "next/navigation";
import Link from "next/link";
import "../../styles/blogs.css";
import "../../styles/blog-content.css";
import "../../styles/home-v2.css";
import { getDataByParentId, sanitizeCmsHtml } from "../../utils/customFunctions";
import { fetchPageData, fetchMenuData, fetchsheetdata, generateMetadataLib } from "../../lib/sheets";
import CorporateNav from "../../components/corporate/CorporateNav";
import CorporateFooter from "../../components/corporate/CorporateFooter";
import AppImage from "../../components/AppImage";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function generateMetadata({ params }) {
  const { slug } = params;
  const blogData = await fetchPageData("", slug);
  if (!blogData || !blogData.path) notFound();
  const metadata = await generateMetadataLib({ location: "", category: "blogs", page: slug });
  if (metadata?.alternates) metadata.alternates.canonical = `${BASE_URL}/blogs/${slug}`;
  return metadata;
}

function stripHtml(html) {
  return html?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() || "";
}

function getReadingTime(html) {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function generateBlogSchema(blogData, slug) {
  const fullUrl = `${BASE_URL}/blogs/${slug}`;
  const imageUrl = blogData?.headerimage?.startsWith("http")
    ? blogData.headerimage
    : `${BASE_URL}${blogData?.headerimage || ""}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blogData?.metatitle || blogData?.title || "",
    description: blogData?.metadescription || blogData?.smalltext || "",
    image: imageUrl,
    url: fullUrl,
    datePublished: blogData?.createdon || blogData?.pageid || "",
    dateModified: blogData?.modifiedon || blogData?.createdon || blogData?.pageid || "",
    author: { "@type": "Organization", name: "AeroSports Trampoline Park", url: BASE_URL },
    publisher: {
      "@type": "Organization",
      name: "AeroSports Trampoline Park",
      url: BASE_URL,
      logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": fullUrl },
    wordCount: stripHtml(blogData?.section1).split(/\s+/).filter(Boolean).length,
    articleBody: stripHtml(blogData?.section1).substring(0, 500),
  };
  return JSON.stringify(schema);
}

// Corporate blog detail: only no-location blogs (fetchContentData("") is the
// blank-location content set), so located posts are never served here.
export default async function CorporateBlogDetail({ params }) {
  const { slug } = params;

  const [blogData, menuData, allLocations] = await Promise.all([
    fetchPageData("", slug),
    fetchMenuData(""),
    fetchsheetdata("locations"),
  ]);

  if (!blogData || !blogData.path) notFound();

  const locations = allLocations.filter((l) => l.locations);
  const related = getDataByParentId(menuData, "blogs")[0]?.children?.filter((c) => c.path !== slug) || [];
  const readingTime = getReadingTime(blogData?.section1);
  const jsonLDschema = generateBlogSchema(blogData, slug);

  return (
    <main className="hv2">
      <CorporateNav />

      <section className="aero-max-container" style={{ paddingTop: 120 }}>
        <article className="aero-blog-detail-main-section">
          <div className="aero-blog-detail-header">
            {blogData?.category && (
              <Link href="/blogs" className="aero-blog-detail-category">
                {blogData.category.replace(/-/g, " ")}
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

          {blogData?.headerimage && (
            <div className="aero-blog-detail-hero">
              <AppImage
                src={blogData.headerimage}
                alt={blogData?.headerimagetitle || blogData?.title}
                width={1200}
                height={630}
                priority
                sizes="100vw"
                style={{ width: "100%", height: "auto", borderRadius: "16px" }}
              />
            </div>
          )}

          <div
            className="aero-blog-content"
            dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(blogData?.section1) }}
          />
        </article>

        {related.length > 0 && (
          <section className="aero-blog-related-section">
            <div className="aero-blog-related-header">
              <h2 className="aero-blog-related-title">More Articles</h2>
              <Link href="/blogs" className="aero-blog-related-viewall">
                View All Articles →
              </Link>
            </div>
            <div className="aero-blog-main-article-wrapper">
              {related.slice(0, 4).map((item, i) => (
                <article className="aero-blog-main-article-card" key={i}>
                  <div className="aero-blog-img-section">
                    <Link href={`/blogs/${item?.path}`} prefetch>
                      <AppImage src={item.smallimage} alt={item.title || "Blog article"} width={400} height={300} sizes="(max-width: 768px) 100vw, 33vw" />
                    </Link>
                  </div>
                  <div className="aero-blog-content-section">
                    <span className="aero-blog-updated-time">{item.pageid}</span>
                    <Link href={`/blogs/${item?.path}`} prefetch>
                      <h3 className="aero-blog-second-heading">{item.title}</h3>
                    </Link>
                    <Link href={`/blogs/${item?.path}`} prefetch className="aero-blog-readmore-btn" aria-label={`Read more about ${item.title}`}>
                      Read More: {item.title}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </section>

      <CorporateFooter locations={locations} />

      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: jsonLDschema }} />
    </main>
  );
}
