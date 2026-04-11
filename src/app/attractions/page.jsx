import Link from "next/link";
import { fetchsheetdata, fetchMenuData, fetchPageData, generateMetadataLib } from "../lib/sheets";
import { getDataByParentId } from "@/utils/customFunctions";
import CorporateNav from "../components/corporate/CorporateNav";
import "../styles/home-v2.css";

export async function generateMetadata() {
  const meta = await generateMetadataLib({ location: "", page: "attractions" });
  if (meta.title === "AeroSports Trampoline Park") {
    meta.title = "Our Attractions | AeroSports Parks Canada";
    meta.openGraph.title = "Our Attractions | AeroSports Parks Canada";
    meta.twitter.title = "Our Attractions | AeroSports Parks Canada";
  }
  if (meta.description === "Fun for all ages at AeroSports!") {
    meta.description = "Explore all attractions at AeroSports Parks. Trampolines, ninja courses, climbing walls, arcades, and more across our Ontario indoor adventure parks.";
    meta.openGraph.description = meta.description;
    meta.twitter.description = meta.description;
  }
  return meta;
}

export default async function AttractionsPage() {
  const pageData = await fetchPageData("", "attractions");
  const allLocations = await fetchsheetdata("locations");
  const locations = allLocations.filter((l) => l.locations);

  // Fetch attractions from all locations, deduplicate by path
  const allAttractions = [];
  const seenPaths = new Set();
  for (const loc of locations) {
    try {
      const menuData = await fetchMenuData(loc.locations);
      const attractionsParent = getDataByParentId(menuData, "attractions") || [];
      const children = attractionsParent?.[0]?.children || [];
      for (const a of children) {
        if (a?.path && !seenPaths.has(a.path)) {
          seenPaths.add(a.path);
          allAttractions.push({
            path: a.path,
            name: (a.name || a.title || "").split(" - ").pop(),
            desc: a.smalltext || a.metadescription || "",
            image: a.smallimage || a.headerimage || "",
            locationSlug: loc.locations,
          });
        }
      }
    } catch {
      // Skip location if menu data fetch fails
    }
  }

  return (
    <main className="hv2" style={{ background: "#fff", minHeight: "100vh" }}>
      <CorporateNav />

      {/* ═══════════ HERO ═══════════ */}
      <section
        className="hv2-hero"
        style={{
          position: "relative",
          padding: "10rem 2rem 5rem",
          textAlign: "center",
          overflow: "hidden",
          background: pageData?.video ? "#080B18" : "linear-gradient(135deg, #080B18 0%, #181D35 100%)",
        }}
      >
        {pageData?.video && (
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.4,
            }}
          >
            <source src={pageData.video} type="video/mp4" />
          </video>
        )}
        <div style={{ maxWidth: 1600, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <span
            className="hv2-section-tag"
            style={{ background: "rgba(245,22,59,0.15)", color: "var(--hv2-red)" }}
          >
            Activities
          </span>
          <h1
            style={{
              fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif",
              fontSize: "clamp(40px, 6vw, 72px)",
              color: "#fff",
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              lineHeight: 1.05,
              marginTop: 12,
            }}
          >
            {pageData?.title || "Our Attractions"}
          </h1>
          <p
            style={{
              fontSize: 18,
              color: "rgba(255,255,255,0.5)",
              maxWidth: 600,
              margin: "16px auto 0",
              lineHeight: 1.6,
            }}
          >
            {pageData?.subtitle || "Wall-to-wall fun across all our parks. Experiences may vary by location."}
          </p>
        </div>
      </section>

      {/* ═══════════ ATTRACTIONS GRID ═══════════ */}
      <section style={{ padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 1600, margin: "0 auto" }}>
          {allAttractions.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 24,
              }}
            >
              {allAttractions.map((a, i) => (
                <Link
                  key={a.path}
                  href={`/${a.locationSlug}/attractions/${a.path}`}
                  style={{
                    display: "block",
                    textDecoration: "none",
                    borderRadius: 20,
                    overflow: "hidden",
                    border: "1px solid #eee",
                    background: "#fff",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                    transition: "box-shadow 0.3s, transform 0.3s",
                  }}
                >
                  <div style={{ height: 220, overflow: "hidden", position: "relative" }}>
                    {a.image ? (
                      <img
                        src={a.image}
                        alt={a.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.5s",
                        }}
                        loading="lazy"
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          background: "linear-gradient(135deg, var(--hv2-navy), var(--hv2-slate, #2a2f4a))",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--hv2-red)" strokeWidth="1.5">
                          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "24px 24px 28px" }}>
                    <h3
                      style={{
                        fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif",
                        fontSize: 24,
                        color: "var(--hv2-navy)",
                        textTransform: "uppercase",
                        letterSpacing: "0.02em",
                        marginBottom: 8,
                        lineHeight: 1.1,
                      }}
                    >
                      {a.name}
                    </h3>
                    {a.desc && (
                      <p
                        style={{
                          fontSize: 13,
                          color: "#888",
                          lineHeight: 1.6,
                          marginBottom: 14,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {a.desc}
                      </p>
                    )}
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--hv2-red)" }}>
                      Explore →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "4rem 0", color: "#888" }}>
              <p style={{ fontSize: 16 }}>Attractions are loading from our locations. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════ SEO CONTENT FROM CMS ═══════════ */}
      {pageData?.section1 && (
        <section style={{ padding: "0 2rem 5rem" }}>
          <div
            style={{ maxWidth: 900, margin: "0 auto", fontSize: 16, lineHeight: 1.8, color: "#444" }}
            dangerouslySetInnerHTML={{ __html: pageData.section1 }}
          />
        </section>
      )}

      {/* ═══════════ FOOTER ═══════════ */}
      <footer style={{ background: "#060810", padding: "5rem 2rem 2rem", color: "rgba(255,255,255,0.4)" }}>
        <div style={{ maxWidth: 1600, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 48, marginBottom: 64 }}>
            <div>
              <a href="/" style={{ display: "inline-block", marginBottom: 16, textDecoration: "none" }}>
                <span style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif", fontSize: 28, color: "#fff", letterSpacing: "0.02em" }}>
                  AERO<span style={{ color: "var(--hv2-red)" }}>SPORTS</span>
                </span>
              </a>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", lineHeight: 1.7 }}>
                Indoor adventure parks for families, birthdays and group fun. Choose your location to start playing.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>Explore</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {[{ label: "Attractions", href: "/attractions" }, { label: "About Us", href: "/about-us" }, { label: "Contact Us", href: "/contact-us" }, { label: "Privacy Policy", href: "/privacy-policy" }].map((l, i) => (
                  <li key={i} style={{ marginBottom: 12 }}>
                    <a href={l.href} style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>Locations</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {locations.filter((l) => l.locations).map((loc, i) => (
                  <li key={i} style={{ marginBottom: 12 }}>
                    <Link href={`/${loc.locations}`} style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>
                      {loc.location || loc.desc}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>Company</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {[{ label: "About Us", href: "/about-us" }, { label: "Contact Us", href: "/contact-us" }, { label: "Privacy Policy", href: "/privacy-policy" }].map((l, i) => (
                  <li key={i} style={{ marginBottom: 12 }}>
                    <a href={l.href} style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
              &copy; 2026 AeroSports. All rights reserved.
            </span>
            <div style={{ display: "flex", gap: 24 }}>
              <a href="/privacy-policy" style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", textDecoration: "none" }}>Privacy Policy</a>
              <a href="/contact-us" style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", textDecoration: "none" }}>Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
