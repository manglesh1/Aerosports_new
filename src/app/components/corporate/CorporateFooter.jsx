import Link from "next/link";

// Shared corporate footer. Section links point to home-page anchors (/#…) so they
// work from any corporate page (home, /blogs, etc.), not just the homepage.
export default function CorporateFooter({ locations = [] }) {
  return (
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
              {[{ label: "Attractions", href: "/#attractions" }, { label: "Birthday Parties", href: "/#parties" }, { label: "Group Events", href: "/#groups" }, { label: "Blog", href: "/blogs" }].map((l, i) => (
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
  );
}
