import Link from "next/link";
import { fetchsheetdata, fetchMenuData, fetchPageData, fetchFaqData, generateMetadataLib } from "./lib/sheets";
import { getDataByParentId } from "./utils/customFunctions";
import CorporateNav from "./components/corporate/CorporateNav";
import CorporateFAQ from "./components/corporate/CorporateFAQ";
import CorporateFooter from "./components/corporate/CorporateFooter";
import LocationSelector from "./components/corporate/LocationSelector";
import AppImage from "./components/AppImage";
import ResponsiveVideo from "./components/ResponsiveVideo";
import "./styles/home-v2.css";

/* â”€â”€ SEO Metadata from Google Sheet (blank location = corporate) â”€â”€ */
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

function formatLocationSqft(value) {
  const raw = String(value || "").trim();
  if (!raw) return "27,000 sq ft of adventure";
  if (/adventure/i.test(raw) || /sq\s*ft/i.test(raw)) return raw;
  return `${raw} sq ft of adventure`;
}

function getLocationAttractions(value) {
  const tags = String(value || "")
    .split(/[,\n|]+/)
    .map((tag) => tag.trim())
    .filter(Boolean);

  return tags.length ? tags : ["Trampolines", "Ninja Course", "Valo Arena"];
}

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

      {/* â•â•â•â•â•â•â•â•â•â•â• HERO â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="hv2-hero">
        <div className="hv2-hero-bg">
          {(corporateHome?.video || locations[0]?.smallimage) && (
            <div className="hv2-hero-mobile-media" aria-hidden="true">
              {corporateHome?.video ? (
                <ResponsiveVideo
                  src={corporateHome.video}
                  posterSrc={locations[0]?.smallimage || corporateHome?.headerimage}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              ) : (
                <AppImage
                  src={locations[0].smallimage}
                  alt=""
                  fill
                  sizes="100vw"
                  priority
                />
              )}
            </div>
          )}
          <div className="hv2-hero-pattern" />
          <div className="hv2-hero-orb hv2-orb1" />
          <div className="hv2-hero-orb hv2-orb2" />
          <div className="hv2-hero-orb hv2-orb3" />
        </div>
        <div className="hv2-hero-inner">
          <div className="hv2-hero-left">
            <span className="hv2-hero-mobile-tag">AeroSports Parks</span>
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
              <a href="#attractions" className="hv2-btn hv2-btn-outline hv2-btn-hero hv2-hero-mobile-secondary">
                Explore Attractions
              </a>
            </div>
          </div>

          <div className="hv2-hero-visual">
            <div className="hv2-hero-card-stack">
              <div className="hv2-hero-main-card">
                <div className="hv2-hero-card-bg">
                  {corporateHome?.video ? (
                    <ResponsiveVideo
                      src={corporateHome.video}
                      posterSrc={locations[0]?.smallimage || corporateHome?.headerimage}
                      autoPlay muted loop playsInline
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : locations[0]?.smallimage ? (
                    <AppImage
                      src={locations[0].smallimage}
                      alt={locations[0].desc || "AeroSports Park"}
                      fill
                      sizes="(max-width: 900px) 100vw, 520px"
                      priority
                    />
                  ) : null}
                </div>
                <div className="hv2-hero-card-overlay">
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

      {/* â•â•â•â•â•â•â•â•â•â•â• WHAT IS AEROSPORTS â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="hv2-attractions">
        <div style={{ maxWidth: 1600, margin: "0 auto" }}>
          <div className="hv2-about-grid">
            <div>
              <span className="hv2-section-tag">About</span>
              <h2 className="hv2-section-h2">What is AeroSports?</h2>
              <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7, margin: "12px 0 24px" }}>
                We are an indoor adventure park dedicated to high-energy fun. Whether
                you&apos;re looking to burn off steam, celebrate a birthday, or bond with
                colleagues, we provide a safe, exciting space for all.
              </p>
              <a href="#attractions" className="hv2-section-link">
                Explore Attractions -&gt;
              </a>
            </div>

            <div className="hv2-about-card-grid">
              {[
                { icon: "play", bg: "rgba(255,45,135,0.08)", color: "#ff2d87", title: "Active Play", desc: "Wall-to-wall trampolines, ninja courses, and climbing walls to keep everyone moving." },
                { icon: "party", bg: "rgba(255,45,135,0.08)", color: "#ff2d87", title: "Celebrations", desc: "The ultimate stress-free destination for unforgettable birthdays and team events." },
                { icon: "team", bg: "rgba(8,11,24,0.08)", color: "var(--hv2-navy)", title: "Shared Experiences", desc: "Designed for families and friends to disconnect from screens and connect through play." },
              ].map((f, i) => (
                <div key={i} className="hv2-about-card">
                  <div className="hv2-about-card-icon" style={{ background: f.bg, color: f.color }}>
                    {f.icon === "play" && (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M13 2 4 14h7l-1 8 10-13h-7l1-7Z" />
                      </svg>
                    )}
                    {f.icon === "party" && (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M4 21 9 5l10 10L4 21Z" />
                        <path d="M13 6l5-3M16 10l5-1M10 4l1-3" />
                      </svg>
                    )}
                    {f.icon === "team" && (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M16 11a4 4 0 1 0-8 0" />
                        <path d="M3 21a7 7 0 0 1 14 0" />
                        <path d="M17 8a3 3 0 0 1 3 3M18 21a5 5 0 0 0-3-4.6" />
                      </svg>
                    )}
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â• CHOOSE YOUR EXPERIENCE â•â•â•â•â•â•â•â•â•â•â• */}
            <section className="hv2-plan hv2-experience-photo-section">
        <div className="hv2-experience-photo-inner">
          <div className="hv2-experience-photo-header">
            <span className="hv2-section-tag">Start Here</span>
            <h2 className="hv2-why-h2">Choose Your Experience</h2>
          </div>

          <div className="hv2-experience-photo-grid">
            {[
              {
                title: "Birthday Parties",
                desc: "Stress-free celebrations with private rooms and party hosts.",
                href: "#parties",
                image: "https://media.aerosportsparks.ca/home-experience/birthday-parties.webp",
              },
              {
                title: "Gallery",
                desc: "See real park moments, smiles, and action from AeroSports.",
                href: "#gallery",
                image: "https://media.aerosportsparks.ca/home-experience/gallery.webp",
              },
              {
                title: "Group Events",
                desc: "Bring the crew for school trips, team days, and group fun.",
                href: "#groups",
                image: "https://media.aerosportsparks.ca/home-experience/group-events.webp",
              },
            ].map((e) => (
              <a key={e.title} href={e.href} className="hv2-experience-photo-card">
                <AppImage
                  src={e.image}
                  alt={e.title}
                  fill
                  sizes="(max-width: 900px) 100vw, 33vw"
                  className="hv2-experience-photo-img"
                />
                <span className="hv2-experience-photo-shade" />
                <span className="hv2-experience-photo-glow" />
                <span className="hv2-experience-photo-content">
                  <span className="hv2-experience-photo-title">{e.title}</span>
                  <span className="hv2-experience-photo-desc">{e.desc}</span>
                  <span className="hv2-experience-photo-link">Explore -&gt;</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â• SIGNATURE EXPERIENCES â•â•â•â•â•â•â•â•â•â•â• */}
      {topAttractions.length > 0 && (
        <section id="attractions" className="hv2-attractions">
          <div className="hv2-section-header">
            <div>
              <span className="hv2-section-tag">Activities</span>
              <h2 className="hv2-section-h2">Signature Experiences</h2>
              <p className="hv2-section-sub">* Experiences may vary by location.</p>
            </div>
            <Link href="/attractions" className="hv2-section-link">
              View All Attractions -&gt;
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
                  style={!a.image ? { background: "var(--hv2-navy)" } : undefined}
                >
                  {a.image && (
                    <AppImage
                      src={a.image}
                      alt={a.name || "AeroSports attraction"}
                      fill
                      sizes={i === 0 ? "(max-width: 768px) calc(100vw - 32px), 66vw" : "(max-width: 768px) calc(100vw - 32px), 33vw"}
                    />
                  )}
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

      {/* â•â•â•â•â•â•â•â•â•â•â• WHY FAMILIES CHOOSE â•â•â•â•â•â•â•â•â•â•â• */}
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
              { icon: "FF", title: "Family-Friendly Environment", desc: "Clean, well-lit spaces designed for all ages to enjoy together." },
              { icon: "SF", title: "Safety First Focus", desc: "Trained court monitors, regular equipment checks, and clear rules." },
              { icon: "SP", title: "Stress-Free Parties", desc: "Dedicated party hosts handle everything from setup to cleanup." },
              { icon: "AR", title: "Everything Under One Roof", desc: "Play, eat, and celebrate without leaving the building." },
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

      {/* â•â•â•â•â•â•â•â•â•â•â• BIRTHDAY PARTIES â•â•â•â•â•â•â•â•â•â•â• */}
      <section id="parties" className="hv2-parties">
        <div className="hv2-parties-inner">
          <div className="hv2-party-visual">
            <div className="hv2-party-main-img">
              {locations[0]?.smallimage && (
                <AppImage
                  src={locations[0].smallimage}
                  alt="Birthday party at AeroSports"
                  fill
                  sizes="(max-width: 900px) calc(100vw - 32px), 42vw"
                />
              )}
              <div className="hv2-party-badge">BIRTHDAY PARTIES</div>
            </div>
            <div className="hv2-party-floating-review">
              <div className="hv2-review-stars" aria-label="5 star rating" />
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
              They jump. <em>We handle the rest.</em>
            </h2>
            <p>
              Skip the planning, the setup, and the post-party cleanup. The birthday
              kid gets a day packed with trampolines, games, and cake &mdash; while a
              dedicated host runs the whole party so you can sit back and actually
              enjoy it.
            </p>
            <div className="hv2-party-includes">
              <h4>What&apos;s Included</h4>
              {["Your own dedicated party host", "A private party room for your group", "All-access jump time on every attraction", "Pizza, drinks & treat packages", "Easy online booking"].map((f, i) => (
                <div key={i} className="hv2-include-item">
                  <div className="hv2-include-check">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--hv2-lime-dark)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  </div>
                  <span className="hv2-include-text">{f}</span>
                </div>
              ))}
            </div>
            <div className="hv2-party-actions">
              <a href="#locations" className="hv2-btn hv2-btn-red hv2-btn-lg">Explore -&gt;kages</a>
              <a href="#faq" className="hv2-btn hv2-btn-dark" style={{ background: "transparent", color: "var(--hv2-navy)", borderColor: "#ccc" }}>Party FAQs</a>
            </div>
          </div>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â• GROUP EVENTS â•â•â•â•â•â•â•â•â•â•â• */}
      <section id="groups" className="hv2-attractions">
        <div className="hv2-section-header">
          <div>
            <h2 className="hv2-section-h2">Group Events</h2>
            <p className="hv2-section-sub">From small teams to full facility rentals, we can accommodate groups of any size.</p>
          </div>
          <a href="#locations" className="hv2-btn hv2-btn-red">Explore -&gt;</a>
        </div>
        <div className="hv2-group-card-grid">
          {[
            { icon: "SG", title: "School Groups", desc: "Educational and active field trips that students and teachers love.", href: "/school-groups" },
            { icon: "SC", title: "Summer Camps", desc: "Keep campers active and entertained regardless of the weather outside.", href: "/summer-camps" },
            { icon: "TC", title: "Team Celebrations", desc: "End-of-season parties for sports teams and local clubs.", href: "/team-celebrations" },
            { icon: "CE", title: "Corporate Events", desc: "Team building activities that actually build teams (and are actually fun).", href: "/corporate-events" },
          ].map((g, i) => (
            <Link key={i} href={g.href} className="hv2-group-card">
              <div className="hv2-group-card-icon">{g.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: 16, color: "var(--hv2-navy)", marginBottom: 8 }}>{g.title}</h3>
              <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, marginBottom: 12 }}>{g.desc}</p>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--hv2-red)" }}>Learn More</span>
            </Link>
          ))}
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â• SOCIAL PROOF / TESTIMONIALS â•â•â•â•â•â•â•â•â•â•â• */}
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
                <div className="hv2-rating-count">50,000+ Parties Hosted</div>
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

      {/* â•â•â•â•â•â•â•â•â•â•â• FIND YOUR PARK â•â•â•â•â•â•â•â•â•â•â• */}
      <section id="locations" className="hv2-attractions">
        <div style={{ maxWidth: 1600, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="hv2-section-tag">Directory</span>
            <h2 className="hv2-section-h2">Find Your Park</h2>
          </div>

          <div className="hv2-location-card-grid">
            {/* Dynamic location cards */}
            {locations.filter(l => l.locations).map((loc, i) => {
              const attractionTags = getLocationAttractions(loc.attraction || loc.attractions);

              return (
                <div key={i} className="hv2-location-card">
                  <div style={{ height: 192, position: "relative", overflow: "hidden" }}>
                    {loc.smallimage ? (
                      <AppImage
                        src={loc.smallimage}
                        alt={loc.desc || loc.location || "AeroSports location"}
                        fill
                        sizes="(max-width: 560px) calc(100vw - 32px), (max-width: 980px) 520px, 450px"
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, var(--hv2-navy), var(--hv2-slate))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--hv2-red)" strokeWidth="1.5"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>
                      </div>
                    )}
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
                      {formatLocationSqft(loc.sqft)}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                      {attractionTags.map((tag) => (
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
              );
            })}

          </div>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â• BLOG â•â•â•â•â•â•â•â•â•â•â• */}
      {blogPosts.length > 0 && (
      <section id="blog" className="hv2-parties">
        <div style={{ maxWidth: 1600, margin: "0 auto" }}>
          <div className="hv2-section-header" style={{ marginBottom: 32 }}>
            <h2 className="hv2-section-h2">From the AeroSports Blog</h2>
            <Link href="/blogs" className="hv2-section-link">View All Articles -&gt;</Link>
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
                      <AppImage
                        src={b.smallimage || b.headerimage}
                        alt={b.smallimage_media?.alt || b.headerimage_media?.alt || b.title || "Blog article"}
                        fill
                        sizes="(max-width: 900px) calc(100vw - 32px), 33vw"
                        style={{ transition: "transform 0.5s" }}
                      />
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
                      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--hv2-red)" }}>Read More -&gt;</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* â•â•â•â•â•â•â•â•â•â•â• FAQ â•â•â•â•â•â•â•â•â•â•â• */}
      <section id="faq" className="hv2-attractions">
        <div style={{ maxWidth: 1600, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 className="hv2-section-h2">Frequently Asked Questions</h2>
            <p style={{ fontSize: 15, color: "#888", marginTop: 8 }}>Got questions? We&apos;ve got answers.</p>
          </div>
          <CorporateFAQ faqs={faqData} />
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â• FINAL CTA â•â•â•â•â•â•â•â•â•â•â• */}
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

      {/* â•â•â•â•â•â•â•â•â•â•â• FOOTER â•â•â•â•â•â•â•â•â•â•â• */}
      <CorporateFooter locations={locations} />
    </main>
  );
}

