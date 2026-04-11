import Link from "next/link";
import { fetchsheetdata, fetchPageData, generateMetadataLib } from "../lib/sheets";
import { sanitizeCmsHtml } from "@/utils/customFunctions";
import CorporateNav from "../components/corporate/CorporateNav";
import "../styles/home-v2.css";

export async function generateMetadata() {
  const meta = await generateMetadataLib({ location: "", page: "privacy-policy" });
  if (meta.title === "AeroSports Trampoline Park") {
    meta.title = "Privacy Policy | AeroSports Parks Canada";
    meta.openGraph.title = "Privacy Policy | AeroSports Parks Canada";
    meta.twitter.title = "Privacy Policy | AeroSports Parks Canada";
  }
  if (meta.description === "Fun for all ages at AeroSports!") {
    meta.description = "Read the AeroSports Parks privacy policy. Learn how we collect, use, and protect your personal information.";
    meta.openGraph.description = meta.description;
    meta.twitter.description = meta.description;
  }
  return meta;
}

export default async function PrivacyPolicyPage() {
  const pageData = await fetchPageData("", "privacy-policy");
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
          <h1
            style={{
              fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif",
              fontSize: "clamp(40px, 6vw, 72px)",
              color: "#fff",
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              lineHeight: 1.05,
            }}
          >
            {pageData?.title || "Privacy Policy"}
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
            {pageData?.subtitle || "How we handle your information"}
          </p>
        </div>
      </section>

      {/* ═══════════ CONTENT ═══════════ */}
      <section style={{ padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {pageData?.section1 ? (
            <div
              style={{
                fontSize: 16,
                lineHeight: 1.8,
                color: "#444",
              }}
              dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(pageData.section1) }}
            />
          ) : (
            <div style={{ fontSize: 16, lineHeight: 1.8, color: "#555", textAlign: "center", padding: "4rem 0" }}>
              <p>Our privacy policy will be updated here shortly.</p>
              <p style={{ marginTop: 16 }}>
                If you have questions about how we handle your data, please{" "}
                <a href="/contact-us" style={{ color: "var(--hv2-red)", fontWeight: 600, textDecoration: "none" }}>
                  contact us
                </a>
                .
              </p>
            </div>
          )}
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
