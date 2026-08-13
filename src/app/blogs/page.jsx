import Link from "next/link";
import { fetchsheetdata, fetchMenuData, fetchPageData, generateMetadataLib } from "../lib/sheets";
import { getDataByParentId } from "../utils/customFunctions";
import CorporateNav from "../components/corporate/CorporateNav";
import CorporateFooter from "../components/corporate/CorporateFooter";
import AppImage from "../components/AppImage";
import "../styles/home-v2.css";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function generateMetadata() {
  const metadata = await generateMetadataLib({ location: "", category: "", page: "blogs" });
  if (metadata?.alternates) metadata.alternates.canonical = `${BASE_URL}/blogs`;
  return metadata;
}

function stripHtml(html) {
  return html?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() || "";
}

function getPostTitle(post) {
  return post?.title || post?.desc || post?.metatitle || "Blog article";
}

function isPublishedPost(post) {
  const value = String(post?.active ?? post?.isactive ?? "").trim().toLowerCase();
  return value === "1" || value === "true" || value === "yes";
}

// Corporate blog list: fetchMenuData("") returns global blog content:
// blank-location rows plus rows marked location="corporate".
export default async function CorporateBlogList() {
  console.log("CorporateBlogList: fetching data...");
  const [allLocations, corporateMenu, corporateBlogRows, pageData] = await Promise.all([
    fetchsheetdata("locations"),
    fetchMenuData(""),
    fetchsheetdata("blogs",""),
    fetchPageData("", "blogs"),
  ]);
  const locations = allLocations.filter((l) => l.locations);

  const blogsParent = Array.isArray(corporateMenu)
    ? getDataByParentId(corporateMenu, "blogs") || []
    : [];
  const posts = blogsParent?.[0]?.children?.length
    ? blogsParent[0].children
    : (Array.isArray(corporateBlogRows) ? corporateBlogRows : []).filter(
        (row) => isPublishedPost(row) && row?.parentid === "blogs" && row?.path
      );

  return (
    <main className="hv2">
      <CorporateNav />

      <section className="hv2-attractions" style={{ paddingTop: 140 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto 48px", textAlign: "center" }}>
          <span className="hv2-section-tag">Blog</span>
          <h1 className="hv2-section-h2" style={{ marginTop: 12 }}>{pageData?.title || "The AeroSports Blog"}</h1>
          <p style={{ fontSize: 15, color: "#666", marginTop: 8 }}>
            {pageData?.smalltext || pageData?.metadescription || "Party tips, attraction guides, and the latest from across our parks."}
          </p>
        </div>

        {posts.length > 0 ? (
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            {posts.map((b, i) => {
              const excerpt = b.metadescription
                ? b.metadescription.length > 140
                  ? b.metadescription.substring(0, 140) + "…"
                  : b.metadescription
                : stripHtml(b.section1).substring(0, 140) + "…";
              const tag = b.category ? b.category.replace(/-/g, " ") : "Blog";
              const title = getPostTitle(b);
              return (
                <Link key={b.path || i} href={`/blogs/${b.path}`} style={{ textDecoration: "none" }}>
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 16,
                      overflow: "hidden",
                      border: "1px solid #eee",
                      height: "100%",
                    }}
                  >
                    {(b.smallimage || b.headerimage) && (
                      <div style={{ height: 192, overflow: "hidden", position: "relative" }}>
                        <AppImage
                          src={b.smallimage || b.headerimage}
                          alt={b.smallimage_media?.alt || b.headerimage_media?.alt || title}
                          fill
                          priority={i < 3}
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div style={{ position: "absolute", top: 14, left: 14 }}>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.1em",
                              background: "rgba(255,255,255,0.9)",
                              backdropFilter: "blur(4px)",
                              padding: "4px 10px",
                              borderRadius: 100,
                              color: "var(--hv2-navy)",
                            }}
                          >
                            {tag}
                          </span>
                        </div>
                      </div>
                    )}
                    <div style={{ padding: 24 }}>
                      <h2 style={{ fontWeight: 700, fontSize: 17, color: "var(--hv2-navy)", marginBottom: 8, lineHeight: 1.3 }}>
                        {title}
                      </h2>
                      <p style={{ fontSize: 13, color: "#888", lineHeight: 1.6, marginBottom: 12 }}>{excerpt}</p>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--hv2-red)" }}>Read More →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", padding: "3rem 1rem", color: "#888" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
            <h2 style={{ fontSize: 18, color: "var(--hv2-navy)", marginBottom: 8 }}>No articles yet</h2>
            <p style={{ fontSize: 14 }}>
              We&apos;re working on new stories. Check back soon — or explore a park near you.
            </p>
            <a href="/#locations" className="hv2-btn hv2-btn-red" style={{ marginTop: 20 }}>
              Find Your Park
            </a>
          </div>
        )}
      </section>

      <CorporateFooter locations={locations} />
    </main>
  );
}
