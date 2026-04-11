import Link from "next/link";
import { fetchsheetdata, fetchPageData, generateMetadataLib } from "../lib/sheets";
import CorporateNav from "../components/corporate/CorporateNav";
import "../styles/home-v2.css";

export async function generateMetadata() {
  const meta = await generateMetadataLib({ location: "", page: "contact-us" });
  if (meta.title === "AeroSports Trampoline Park") {
    meta.title = "Contact Us | AeroSports Parks Canada";
    meta.openGraph.title = "Contact Us | AeroSports Parks Canada";
    meta.twitter.title = "Contact Us | AeroSports Parks Canada";
  }
  if (meta.description === "Fun for all ages at AeroSports!") {
    meta.description = "Get in touch with AeroSports Parks. Find contact information, addresses, and phone numbers for all our indoor adventure park locations across Ontario.";
    meta.openGraph.description = meta.description;
    meta.twitter.description = meta.description;
  }
  return meta;
}

export default async function ContactUsPage() {
  const pageData = await fetchPageData("", "contact-us");
  const allLocations = await fetchsheetdata("locations");
  const locations = allLocations.filter((l) => l.locations);

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
            Get In Touch
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
            {pageData?.title || "Contact Us"}
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
            {pageData?.subtitle || "We'd love to hear from you. Reach out to any of our locations below."}
          </p>
        </div>
      </section>

      {/* ═══════════ CMS CONTENT ═══════════ */}
      {pageData?.section1 && (
        <section style={{ padding: "4rem 2rem 0" }}>
          <div
            style={{ maxWidth: 900, margin: "0 auto", fontSize: 16, lineHeight: 1.8, color: "#444" }}
            dangerouslySetInnerHTML={{ __html: pageData.section1 }}
          />
        </section>
      )}

      {/* ═══════════ LOCATION CONTACTS GRID ═══════════ */}
      <section style={{ padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 1600, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span
              className="hv2-section-tag"
              style={{ background: "rgba(8,11,24,0.1)", color: "var(--hv2-navy)" }}
            >
              Our Parks
            </span>
            <h2 className="hv2-section-h2" style={{ marginTop: 12 }}>
              Park Locations & Contact Info
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 24,
              maxWidth: 1200,
              margin: "0 auto",
            }}
          >
            {locations.map((loc, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  padding: "32px 28px",
                  border: "1px solid #eee",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif",
                    fontSize: 28,
                    color: "var(--hv2-navy)",
                    textTransform: "uppercase",
                    letterSpacing: "0.02em",
                    marginBottom: 4,
                  }}
                >
                  {loc.location || loc.desc}
                </h3>

                {loc.address && (
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <svg style={{ width: 18, height: 18, flexShrink: 0, marginTop: 2 }} fill="none" viewBox="0 0 24 24" stroke="var(--hv2-red)" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span style={{ fontSize: 14, color: "#555", lineHeight: 1.5 }}>{loc.address}</span>
                  </div>
                )}

                {loc.phone && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <svg style={{ width: 18, height: 18, flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="var(--hv2-red)" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <a href={`tel:${loc.phone}`} style={{ fontSize: 14, color: "var(--hv2-navy)", fontWeight: 600, textDecoration: "none" }}>
                      {loc.phone}
                    </a>
                  </div>
                )}

                {loc.email && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <svg style={{ width: 18, height: 18, flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="var(--hv2-red)" strokeWidth={2}>
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <a href={`mailto:${loc.email}`} style={{ fontSize: 14, color: "var(--hv2-navy)", fontWeight: 600, textDecoration: "none" }}>
                      {loc.email}
                    </a>
                  </div>
                )}

                <div style={{ marginTop: "auto", paddingTop: 12, display: "flex", gap: 10 }}>
                  <Link
                    href={`/${loc.locations}`}
                    className="hv2-btn hv2-btn-red"
                    style={{ flex: 1, justifyContent: "center", fontSize: 13 }}
                  >
                    View Park
                  </Link>
                  {loc.gmburl && (
                    <a
                      href={loc.gmburl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hv2-btn hv2-btn-dark"
                      style={{ flex: 1, justifyContent: "center", background: "transparent", color: "var(--hv2-navy)", borderColor: "#ccc", fontSize: 13 }}
                    >
                      Directions
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
