import Link from "next/link";
import { fetchsheetdata, fetchPageData, generateMetadataLib } from "../lib/sheets";
import CorporateNav from "../components/corporate/CorporateNav";
import "../styles/home-v2.css";

export async function generateMetadata() {
  const meta = await generateMetadataLib({ location: "", page: "corporate-events" });
  if (meta.title === "AeroSports Trampoline Park") {
    meta.title = "Corporate Events & Team Building | AeroSports Parks Canada";
    meta.openGraph.title = "Corporate Events & Team Building | AeroSports Parks Canada";
    meta.twitter.title = "Corporate Events & Team Building | AeroSports Parks Canada";
  }
  if (meta.description === "Fun for all ages at AeroSports!") {
    meta.description = "Host unforgettable corporate team building events at AeroSports Parks. Active, engaging activities that actually build teams and are actually fun.";
    meta.openGraph.description = meta.description;
    meta.twitter.description = meta.description;
  }
  return meta;
}

export default async function CorporateEventsPage() {
  const pageData = await fetchPageData("", "corporate-events");
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
            🏢 Corporate Events
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
            {pageData?.title || "Corporate Events & Team Building"}
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
            {pageData?.subtitle || "Team building activities that actually build teams (and are actually fun)."}
          </p>
        </div>
      </section>

      {/* ═══════════ CONTENT ═══════════ */}
      <section style={{ padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 1600, margin: "0 auto" }}>
          {pageData?.section1 ? (
            <div
              style={{ fontSize: 16, lineHeight: 1.8, color: "#444", maxWidth: 900, margin: "0 auto" }}
              dangerouslySetInnerHTML={{ __html: pageData.section1 }}
            />
          ) : (
            <>
              <div style={{ maxWidth: 900, margin: "0 auto 4rem" }}>
                <span
                  className="hv2-section-tag"
                  style={{ background: "rgba(245,22,59,0.15)", color: "var(--hv2-red)" }}
                >
                  Why AeroSports
                </span>
                <h2 className="hv2-section-h2" style={{ marginTop: 12, marginBottom: 16 }}>
                  Ditch the Boardroom, Build Real Bonds
                </h2>
                <p style={{ fontSize: 16, lineHeight: 1.8, color: "#555" }}>
                  Forget trust falls and icebreaker bingo. AeroSports corporate events get your team
                  moving, laughing, and actually connecting. Our indoor adventure parks provide the perfect
                  backdrop for team building that people genuinely enjoy — from competitive dodgeball
                  tournaments to ninja course challenges and relay races.
                </p>
              </div>

              <div style={{ maxWidth: 900, margin: "0 auto 4rem" }}>
                <span
                  className="hv2-section-tag"
                  style={{ background: "rgba(57,255,20,0.15)", color: "var(--hv2-lime-dark, #2d8a0e)" }}
                >
                  Event Options
                </span>
                <h2 className="hv2-section-h2" style={{ marginTop: 12, marginBottom: 24 }}>
                  Corporate Packages
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
                  {[
                    { icon: "🤝", title: "Team Building", desc: "Structured team challenges, relay races, and competitive games that foster collaboration." },
                    { icon: "🎉", title: "Company Parties", desc: "Holiday parties, milestone celebrations, and company picnics with a twist." },
                    { icon: "🏢", title: "Department Outings", desc: "Smaller group events perfect for departments, project teams, or new hire onboarding." },
                    { icon: "🏟️", title: "Full Facility Rental", desc: "Exclusive access to the entire park for large corporate events and retreats." },
                    { icon: "🍽️", title: "Catering Available", desc: "Full food and beverage packages including pizza, platters, and more." },
                    { icon: "📊", title: "Custom Programs", desc: "Work with our events team to create a tailored experience for your organization." },
                  ].map((item, i) => (
                    <div
                      key={i}
                      style={{
                        background: "#fff",
                        borderRadius: 16,
                        padding: "28px 24px",
                        border: "1px solid #eee",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                      }}
                    >
                      <div style={{ fontSize: 32, marginBottom: 14 }}>{item.icon}</div>
                      <h3 style={{ fontWeight: 700, fontSize: 16, color: "var(--hv2-navy)", marginBottom: 8 }}>{item.title}</h3>
                      <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
                <h2 className="hv2-section-h2" style={{ marginBottom: 16 }}>
                  Plan Your Corporate Event
                </h2>
                <p style={{ fontSize: 16, color: "#555", marginBottom: 32 }}>
                  Choose your nearest park to inquire about corporate event packages and availability.
                </p>
              </div>
            </>
          )}

          {/* Location Cards */}
          <div style={{ maxWidth: 1200, margin: "3rem auto 0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
              {locations.map((loc, i) => (
                <Link
                  key={i}
                  href={`/${loc.locations}/groups-events/corporate-parties-events-groups`}
                  style={{
                    display: "block",
                    background: "#fff",
                    borderRadius: 16,
                    padding: "28px 24px",
                    border: "1px solid #eee",
                    textDecoration: "none",
                    transition: "box-shadow 0.3s",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif",
                      fontSize: 24,
                      color: "var(--hv2-navy)",
                      textTransform: "uppercase",
                      letterSpacing: "0.02em",
                      marginBottom: 8,
                    }}
                  >
                    {loc.location || loc.desc}
                  </h3>
                  {loc.address && (
                    <p style={{ fontSize: 13, color: "#888", lineHeight: 1.5 }}>{loc.address}</p>
                  )}
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--hv2-red)", marginTop: 12, display: "inline-block" }}>
                    Inquire About Events →
                  </span>
                </Link>
              ))}
            </div>
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
