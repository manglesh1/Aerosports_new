import Link from "next/link";
import { fetchsheetdata, fetchMenuData, fetchPageData, fetchFaqData, generateMetadataLib } from "./lib/sheets";
import { getDataByParentId } from "./utils/customFunctions";
import CorporateNav from "./components/corporate/CorporateNav";
import CorporateFAQ from "./components/corporate/CorporateFAQ";
import LocationSelector from "./components/corporate/LocationSelector";
import "./styles/home-v2.css";

/* ── SEO Metadata from Google Sheet (blank location = corporate) ── */
const CORPORATE_META_DEFAULTS = {
  metatitle: "AeroSports Parks Canada | Indoor Adventure Parks for Families, Birthdays & Groups",
  metadescription: "Discover wall-to-wall trampolines, ninja courses, arcades, and stress-free birthday parties at AeroSports indoor adventure parks across Ontario. Find your nearest park and start playing!",
};

export async function generateMetadata() {
  const meta = await generateMetadataLib({ location: "", page: "home" });
  // Use corporate defaults if sheet doesn't have values yet
  if (meta.title === "AeroSports Trampoline Park") {
    meta.title = CORPORATE_META_DEFAULTS.metatitle;
    meta.openGraph.title = CORPORATE_META_DEFAULTS.metatitle;
    meta.twitter.title = CORPORATE_META_DEFAULTS.metatitle;
  }
  if (meta.description === "Fun for all ages at AeroSports!") {
    meta.description = CORPORATE_META_DEFAULTS.metadescription;
    meta.openGraph.description = CORPORATE_META_DEFAULTS.metadescription;
    meta.twitter.description = CORPORATE_META_DEFAULTS.metadescription;
  }
  return meta;
}

/* Default audience/priority (same as AttractionsV2) */
const AUDIENCE_DEFAULTS = {
  "open-jump":        { audience: "All Ages",       priority: 1 },
  "dodgeball":        { audience: "Teens & Groups", priority: 2 },
  "ninja-warrior":    { audience: "Kids & Teens",   priority: 3 },
  "battle-beam":      { audience: "All Ages",       priority: 4 },
  "slam-basketball":  { audience: "Kids & Teens",   priority: 5 },
  "soft-play":        { audience: "Ages 2-5",       priority: 6 },
  "toddler-zone":     { audience: "Ages 2-5",       priority: 6 },
  "kidzone":          { audience: "Ages 2-5",       priority: 6 },
  "foam-pit":         { audience: "All Ages",       priority: 4 },
  "rock-climbing":    { audience: "All Ages",       priority: 8 },
  "arcade":           { audience: "All Ages",       priority: 13 },
  "valo-arena":       { audience: "All Ages",       priority: 7 },
};

export default async function CorporatePage() {
  const allLocations = await fetchsheetdata("locations");
  const locations = allLocations.filter(l => l.locations); // exclude corporate (blank) rows

  // Fetch corporate page data (blank location = corporate)
  const corporateHome = await fetchPageData("", "home");

  // Fetch attractions from all locations, deduplicate by path
  const allAttractions = [];
  const seenPaths = new Set();
  for (const loc of locations) {
    if (!loc.locations) continue;
    try {
      const menuData = await fetchMenuData(loc.locations);
      const attractionsParent = Array.isArray(menuData)
        ? getDataByParentId(menuData, "attractions") || []
        : [];
      const children = attractionsParent?.[0]?.children || [];
      for (const a of children) {
        if (a?.path && !seenPaths.has(a.path)) {
          seenPaths.add(a.path);
          const defaults = AUDIENCE_DEFAULTS[a.path] || {};
          allAttractions.push({
            path: a.path,
            name: (a.name || a.title || "").split(" - ").pop(),
            desc: a.smalltext || "",
            image: a.smallimage || a.headerimage || "",
            audience: a.audience || defaults.audience || "",
            priority: Number(a.priority) || defaults.priority || 99,
            locationSlug: loc.locations,
          });
        }
      }
    } catch (e) {
      // skip location on error
    }
  }
  allAttractions.sort((a, b) => a.priority - b.priority);
  const topAttractions = allAttractions.slice(0, 6);

  // Fetch corporate blogs (blank location = corporate blogs)
  let blogPosts = [];
  try {
    const corporateMenu = await fetchMenuData("");
    const blogsParent = Array.isArray(corporateMenu)
      ? getDataByParentId(corporateMenu, "blogs") || []
      : [];
    blogPosts = (blogsParent?.[0]?.children || []).slice(0, 3);
  } catch (e) {
    // fallback to empty
  }

  // Fetch corporate FAQ (blank location = corporate FAQ)
  let faqData = [];
  try {
    faqData = await fetchFaqData("", "home");
  } catch (e) {
    // fallback to empty
  }

  return (
    <main className="hv2">
      <CorporateNav />

      {/* ═══════════ HERO ═══════════ */}
      <section className="hv2-hero">
        <div className="hv2-hero-bg">
          <div className="hv2-hero-pattern" />
          <div className="hv2-hero-orb hv2-orb1" />
          <div className="hv2-hero-orb hv2-orb2" />
          <div className="hv2-hero-orb hv2-orb3" />
        </div>
        <div className="hv2-hero-inner">
          <div className="hv2-hero-left">
            <div className="hv2-hero-badge">
              <div className="hv2-hero-badge-dot" />
              <span>Now Open in Oakville</span>
            </div>
            <h1 className="hv2-hero-h1">
              {corporateHome?.title
                ? corporateHome.title
                : <>Indoor adventure parks for families,{" "}<em>birthdays</em> and group fun.</>}
            </h1>
            <p className="hv2-hero-sub">
              {corporateHome?.metadescription ||
                "Experience wall-to-wall trampolines, ninja courses, arcades, and the easiest birthday parties ever. Choose your location to start playing."}
            </p>
            <div className="hv2-hero-actions" style={{ marginBottom: "32px" }}>
              {["Family-friendly", "Indoor year-round", "Multi-attraction"].map((label) => (
                <span key={label} className="hv2-btn hv2-btn-ghost" style={{ cursor: "default" }}>
                  {label}
                </span>
              ))}
            </div>
            <div className="hv2-hero-actions">
              <a href="#locations" className="hv2-btn hv2-btn-red hv2-btn-hero">
                Find Your Park
              </a>
            </div>
          </div>

          <div className="hv2-hero-visual">
            <div className="hv2-hero-card-stack">
              <div className="hv2-hero-main-card">
                <div className="hv2-hero-card-bg">
                  {corporateHome?.video ? (
                    <video
                      autoPlay muted loop playsInline
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    >
                      <source src={corporateHome.video} type="video/mp4" />
                    </video>
                  ) : locations[0]?.smallimage ? (
                    <img
                      src={locations[0].smallimage}
                      alt={locations[0].desc || "AeroSports Park"}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : null}
                </div>
                <div className="hv2-hero-card-overlay">
                  <div className="hv2-now-open-chip">
                    <span style={{ width: 6, height: 6, background: "#fff", borderRadius: "50%", display: "inline-block" }} />
                    Now Open
                  </div>
                  <div className="hv2-hero-card-title">Choose Location</div>
                  <div className="hv2-hero-card-sub">Select a park to view attractions and book</div>
                  <div style={{ marginTop: 12 }}>
                    <LocationSelector locations={locations.map(l => ({ locations: l.locations, location: l.location, desc: l.desc }))} />
                  </div>
                </div>
              </div>

              {/* Floating stats */}
              <div className="hv2-float-stat hv2-float-stat-1">
                <div className="hv2-stat-num">{locations.length}</div>
                <div className="hv2-stat-lbl">Locations</div>
              </div>
              <div className="hv2-float-stat hv2-float-stat-2">
                <div className="hv2-stat-num">All Ages</div>
                <div className="hv2-stat-lbl">Welcome</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ WHAT IS AEROSPORTS ═══════════ */}
      <section className="hv2-attractions">
        <div style={{ maxWidth: 1600, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "3rem", alignItems: "center" }}>
            <div>
              <span className="hv2-section-tag">About</span>
              <h2 className="hv2-section-h2">What is AeroSports?</h2>
              <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7, margin: "12px 0 24px" }}>
                We are an indoor adventure park dedicated to high-energy fun. Whether
                you&apos;re looking to burn off steam, celebrate a birthday, or bond with
                colleagues, we provide a safe, exciting space for all.
              </p>
              <a href="#attractions" className="hv2-section-link">
                Explore Attractions →
              </a>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {[
                { icon: "⚡", bg: "rgba(255,45,135,0.08)", color: "#ff2d87", title: "Active Play", desc: "Wall-to-wall trampolines, ninja courses, and climbing walls to keep everyone moving." },
                { icon: "🎉", bg: "rgba(255,45,135,0.08)", color: "#ff2d87", title: "Celebrations", desc: "The ultimate stress-free destination for unforgettable birthdays and team events." },
                { icon: "👥", bg: "rgba(8,11,24,0.08)", color: "var(--hv2-navy)", title: "Shared Experiences", desc: "Designed for families and friends to disconnect from screens and connect through play." },
              ].map((f, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "32px 28px", border: "1px solid #eee", borderTop: "3px solid #ff2d87", transition: "box-shadow 0.3s" }}>
                  <div style={{ width: 56, height: 56, borderRadius: 12, background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, fontSize: 28 }}>
                    {f.icon}
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: 18, color: "var(--hv2-navy)", marginBottom: 10 }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ CHOOSE YOUR EXPERIENCE ═══════════ */}
      <section className="hv2-plan" style={{ padding: "6rem 2rem" }}>
        <div style={{ maxWidth: 1600, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="hv2-section-tag" style={{ background: "rgba(200,255,0,0.15)", color: "var(--hv2-red)" }}>Start Here</span>
            <h2 className="hv2-why-h2" style={{ marginTop: 12 }}>Choose Your Experience</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 900, margin: "0 auto" }}>
            {[
              { title: "Birthday Parties", desc: "Stress-free celebrations with private rooms and hosts.", href: "#parties", gradient: "linear-gradient(135deg, rgba(88,28,135,0.8), #181D35)" },
              { title: "Attractions", desc: "Trampolines, ninja courses, arcades and more.", href: "#attractions", gradient: "linear-gradient(135deg, rgba(200,255,0,0.4), #181D35)" },
              { title: "Group Events", desc: "School trips, corporate building, and camps.", href: "#groups", gradient: "linear-gradient(135deg, rgba(30,58,138,0.6), #181D35)" },
              { title: "Locations", desc: "Find an AeroSports park near you to start playing.", href: "#locations", gradient: "linear-gradient(135deg, rgba(255,45,135,0.2), #181D35)" },
            ].map((e, i) => (
              <a
                key={i}
                href={e.href}
                style={{
                  display: "flex", flexDirection: "column", justifyContent: "space-between",
                  background: e.gradient, borderRadius: 16, padding: "32px",
                  minHeight: 260, border: "1px solid rgba(255,255,255,0.05)",
                  textDecoration: "none", transition: "border-color 0.3s",
                }}
              >
                <div>
                  <h3 style={{
                    fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif",
                    fontSize: 28, color: "#fff", textTransform: "uppercase",
                    letterSpacing: "0.02em", marginBottom: 8
                  }}>{e.title}</h3>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", maxWidth: 280 }}>{e.desc}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>
                    Explore →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ SIGNATURE EXPERIENCES ═══════════ */}
      {topAttractions.length > 0 && (
        <section id="attractions" className="hv2-attractions">
          <div className="hv2-section-header">
            <div>
              <span className="hv2-section-tag">Activities</span>
              <h2 className="hv2-section-h2">Signature Experiences</h2>
              <p className="hv2-section-sub">* Experiences may vary by location.</p>
            </div>
            <Link href="/attractions" className="hv2-section-link">
              View All Attractions →
            </Link>
          </div>
          <div className="hv2-attractions-grid">
            {topAttractions.map((a, i) => (
              <div
                key={a.path}
                className={`hv2-attr-tile${i === 0 ? " hv2-attr-tile-big" : ""}`}
              >
                <div
                  className="hv2-attr-bg"
                  style={a.image ? { backgroundImage: `url('${a.image}')` } : { background: "var(--hv2-navy)" }}
                >
                  <div className="hv2-attr-overlay" />
                  <div className="hv2-attr-hover-overlay" />
                  <div className="hv2-attr-content">
                    {a.audience && <div className="hv2-attr-audience">{a.audience}</div>}
                    {a.name && <div className="hv2-attr-name">{a.name}</div>}
                    {a.desc && <div className="hv2-attr-desc">{a.desc}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════ WHY FAMILIES CHOOSE ═══════════ */}
      <section className="hv2-why">
        <div className="hv2-why-bg" />
        <div className="hv2-why-inner">
          <div className="hv2-why-header">
            <h2 className="hv2-why-h2">Why Families Choose AeroSports</h2>
            <p style={{ fontSize: 15, color: "var(--hv2-muted)", maxWidth: 600, margin: "12px auto 0" }}>
              We provide a safe, thrilling environment where kids can be kids and parents can join in or relax.
            </p>
          </div>
          <div className="hv2-why-grid">
            {[
              { icon: "❤️", title: "Family-Friendly Environment", desc: "Clean, well-lit spaces designed for all ages to enjoy together." },
              { icon: "🛡️", title: "Safety First Focus", desc: "Trained court monitors, regular equipment checks, and clear rules." },
              { icon: "⭐", title: "Stress-Free Parties", desc: "Dedicated party hosts handle everything from setup to cleanup." },
              { icon: "🏠", title: "Everything Under One Roof", desc: "Play, eat, and celebrate without leaving the building." },
            ].map((c, i) => (
              <div key={i} className="hv2-why-card">
                <div className="hv2-why-icon">{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ BIRTHDAY PARTIES ═══════════ */}
      <section id="parties" className="hv2-parties">
        <div className="hv2-parties-inner">
          <div className="hv2-party-visual">
            <div className="hv2-party-main-img">
              {locations[0]?.smallimage && (
                <img
                  src={locations[0].smallimage}
                  alt="Birthday party at AeroSports"
                  loading="lazy"
                />
              )}
              <div className="hv2-party-badge">🎈 BIRTHDAY PARTIES</div>
            </div>
            <div className="hv2-party-floating-review">
              <div className="hv2-review-stars">★★★★★</div>
              <p className="hv2-review-quote">
                &ldquo;Easiest birthday party I&apos;ve ever hosted. The kids had a blast and the host took care of everything!&rdquo;
              </p>
              <div className="hv2-reviewer-info">
                <div className="hv2-reviewer-avatar">S</div>
                <div className="hv2-reviewer-name">Sarah M.</div>
              </div>
            </div>
          </div>

          <div className="hv2-party-content">
            <h2>
              Birthday parties <em>made easy.</em>
            </h2>
            <p>
              Give them a party they&apos;ll never forget while you sit back and relax.
              We handle the entertainment, the food, the setup, and the cleanup.
            </p>
            <div className="hv2-party-includes">
              <h4>What&apos;s Included</h4>
              {["Dedicated party host", "Private party room", "Full access to attractions", "Food and drink packages", "Simple online booking"].map((f, i) => (
                <div key={i} className="hv2-include-item">
                  <div className="hv2-include-check">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--hv2-lime-dark)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  </div>
                  <span className="hv2-include-text">{f}</span>
                </div>
              ))}
            </div>
            <div className="hv2-party-actions">
              <a href="#locations" className="hv2-btn hv2-btn-red hv2-btn-lg">Explore Birthday Packages</a>
              <a href="#faq" className="hv2-btn hv2-btn-dark" style={{ background: "transparent", color: "var(--hv2-navy)", borderColor: "#ccc" }}>Party FAQs</a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ GROUP EVENTS ═══════════ */}
      <section id="groups" className="hv2-attractions">
        <div className="hv2-section-header">
          <div>
            <h2 className="hv2-section-h2">Group Events</h2>
            <p className="hv2-section-sub">From small teams to full facility rentals, we can accommodate groups of any size.</p>
          </div>
          <a href="#locations" className="hv2-btn hv2-btn-red">Explore Group Events</a>
        </div>
        <div style={{ maxWidth: 1600, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[
            { emoji: "🏫", title: "School Groups", desc: "Educational and active field trips that students and teachers love.", href: "/school-groups" },
            { emoji: "☀️", title: "Summer Camps", desc: "Keep campers active and entertained regardless of the weather outside.", href: "/summer-camps" },
            { emoji: "🏆", title: "Team Celebrations", desc: "End-of-season parties for sports teams and local clubs.", href: "/team-celebrations" },
            { emoji: "🏢", title: "Corporate Events", desc: "Team building activities that actually build teams (and are actually fun).", href: "/corporate-events" },
          ].map((g, i) => (
            <Link key={i} href={g.href} style={{ background: "#fff", borderRadius: 16, padding: "28px 24px", border: "1px solid #eee", transition: "all 0.3s", cursor: "pointer", textDecoration: "none", display: "block" }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{g.emoji}</div>
              <h3 style={{ fontWeight: 700, fontSize: 16, color: "var(--hv2-navy)", marginBottom: 8 }}>{g.title}</h3>
              <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, marginBottom: 12 }}>{g.desc}</p>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--hv2-red)" }}>Learn More</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════ SOCIAL PROOF / TESTIMONIALS ═══════════ */}
      <section className="hv2-social">
        <div className="hv2-social-inner">
          <div className="hv2-social-header">
            <div>
              <span className="hv2-section-tag">Reviews</span>
              <h2 className="hv2-section-h2">Trusted by Families Across Ontario</h2>
            </div>
            <div className="hv2-rating-badge">
              <div>
                <div className="hv2-rating-num">4.7</div>
                <div className="hv2-rating-stars">★★★★★</div>
              </div>
              <div>
                <div className="hv2-rating-count">500+ Parties Hosted</div>
              </div>
            </div>
          </div>

          <div className="hv2-reviews-grid">
            {[
              { name: "Jessica T.", source: "Google Reviews", text: "Absolutely amazing experience for my son's 10th birthday! The staff was incredibly attentive, the facilities were spotless, and the kids didn't want to leave." },
              { name: "Mike D.", source: "Yelp", text: "Great place to burn off some energy on a rainy weekend. The ninja course is legitimately challenging even for adults. Will definitely be back." },
              { name: "Amanda L.", source: "Google Reviews", text: "We've been to a few different trampoline parks and this one is by far the best maintained. The variety of attractions keeps our kids coming back." },
            ].map((t, i) => (
              <div key={i} className="hv2-review-card">
                <div className="hv2-stars">★★★★★</div>
                <p>&ldquo;{t.text}&rdquo;</p>
                <div className="hv2-reviewer-name">{t.name}</div>
                <div className="hv2-review-source">{t.source}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FIND YOUR PARK ═══════════ */}
      <section id="locations" className="hv2-attractions">
        <div style={{ maxWidth: 1600, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="hv2-section-tag">Directory</span>
            <h2 className="hv2-section-h2">Find Your Park</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 900, margin: "0 auto" }}>
            {/* Dynamic location cards */}
            {locations.filter(l => l.locations).map((loc, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 24, overflow: "hidden", border: "1px solid #eee", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column" }}>
                <div style={{ height: 192, position: "relative", overflow: "hidden" }}>
                  {loc.smallimage ? (
                    <img
                      src={loc.smallimage}
                      alt={loc.desc}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      loading="lazy"
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, var(--hv2-navy), var(--hv2-slate))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--hv2-red)" strokeWidth="1.5"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>
                    </div>
                  )}
                  <div style={{ position: "absolute", top: 16, left: 16 }}>
                    <span style={{ background: "var(--hv2-red)", color: "#000", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", padding: "4px 12px", borderRadius: 100 }}>
                      Now Open
                    </span>
                  </div>
                </div>
                <div style={{ padding: 28, display: "flex", flexDirection: "column", flex: 1 }}>
                  <h3 style={{
                    fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif",
                    fontSize: 36, color: "var(--hv2-navy)", textTransform: "uppercase",
                    letterSpacing: "0.02em", marginBottom: 4, lineHeight: 1
                  }}>
                    {loc.location || loc.desc}
                  </h3>
                  <p style={{ fontSize: 14, color: "#888", fontWeight: 500, marginBottom: 16 }}>
                    27,000 sq ft of adventure
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                    {["Trampolines", "Ninja Course", "Valo Arena"].map((tag) => (
                      <span key={tag} style={{ fontSize: 11, fontWeight: 600, background: "#f5f5f5", color: "#666", padding: "4px 10px", borderRadius: 100 }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div style={{ marginTop: "auto", display: "flex", gap: 10 }}>
                    <Link href={`/${loc.locations}`} className="hv2-btn hv2-btn-red" style={{ flex: 1, justifyContent: "center" }}>
                      View Park
                    </Link>
                    {loc.gmburl && (
                      <a href={loc.gmburl} target="_blank" rel="noopener noreferrer" className="hv2-btn hv2-btn-dark" style={{ flex: 1, justifyContent: "center", background: "transparent", color: "var(--hv2-navy)", borderColor: "#ccc" }}>
                        Directions
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ═══════════ BLOG ═══════════ */}
      {blogPosts.length > 0 && (
      <section id="blog" className="hv2-parties">
        <div style={{ maxWidth: 1600, margin: "0 auto" }}>
          <div className="hv2-section-header" style={{ marginBottom: 32 }}>
            <h2 className="hv2-section-h2">From the AeroSports Blog</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(blogPosts.length, 3)}, 1fr)`, gap: 20 }}>
            {blogPosts.map((b, i) => {
              const excerpt = b.metadescription
                ? (b.metadescription.length > 140 ? b.metadescription.substring(0, 140) + "..." : b.metadescription)
                : (b.smalltext || "").substring(0, 140) + "...";
              const tag = b.category ? b.category.replace(/-/g, " ") : "Blog";
              return (
                <a key={b.path || i} href={`/blogs/${b.path}`} style={{ textDecoration: "none" }}>
                  <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #eee", cursor: "pointer", transition: "box-shadow 0.3s", height: "100%" }}>
                    {(b.smallimage || b.headerimage) && (
                    <div style={{ height: 192, overflow: "hidden", position: "relative" }}>
                      <img src={b.smallimage || b.headerimage} alt={b.title || "Blog article"} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }} loading="lazy" />
                      <div style={{ position: "absolute", top: 14, left: 14 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(4px)", padding: "4px 10px", borderRadius: 100, color: "var(--hv2-navy)" }}>
                          {tag}
                        </span>
                      </div>
                    </div>
                    )}
                    <div style={{ padding: 24 }}>
                      <h3 style={{ fontWeight: 700, fontSize: 17, color: "var(--hv2-navy)", marginBottom: 8, lineHeight: 1.3 }}>{b.title}</h3>
                      <p style={{ fontSize: 13, color: "#888", lineHeight: 1.6, marginBottom: 12 }}>{excerpt}</p>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--hv2-red)" }}>Read More →</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* ═══════════ FAQ ═══════════ */}
      <section id="faq" className="hv2-attractions">
        <div style={{ maxWidth: 1600, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 className="hv2-section-h2">Frequently Asked Questions</h2>
            <p style={{ fontSize: 15, color: "#888", marginTop: 8 }}>Got questions? We&apos;ve got answers.</p>
          </div>
          <CorporateFAQ faqs={faqData} />
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="hv2-final-cta">
        <div className="hv2-final-cta-bg" />
        <div className="hv2-final-cta-inner">
          <h2>Ready to plan your next visit?</h2>
          <div className="hv2-final-cta-btns">
            <a href="#locations" className="hv2-btn hv2-btn-white hv2-btn-lg">Find Your Park</a>
            <a href="#parties" className="hv2-btn hv2-btn-outline hv2-btn-lg">Birthday Parties</a>
            <a href="#attractions" className="hv2-btn hv2-btn-outline hv2-btn-lg">Explore Attractions</a>
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
                {[{ label: "Attractions", href: "#attractions" }, { label: "Birthday Parties", href: "#parties" }, { label: "Group Events", href: "#groups" }, { label: "Blog", href: "#blog" }].map((l, i) => (
                  <li key={i} style={{ marginBottom: 12 }}>
                    <a href={l.href} style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>Locations</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {locations.filter(l => l.locations).map((loc, i) => (
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
