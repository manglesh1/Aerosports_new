import Link from "next/link";
import AppImage from "../AppImage";
import ResponsiveVideo from "../ResponsiveVideo";

// Hero section. All copy is hardcoded (identical across every location)
// with the exception of the interpolated location display name.
// Dynamic pieces:
//   - card video/image from headerimage row (home path)
//   - address from locations sheet
//   - CTA URLs: estorebase config, pricing page, waiver link
const TRUST_ITEMS = [
  { icon: "🛡️", title: "Safety First", subtitle: "Certified & trained staff" },
  { icon: "⭐",  title: "Top Rated",    subtitle: "Loved by families" },
  { icon: "🎉", title: "Birthday Pro", subtitle: "All-inclusive, stress-free" },
];

const FLOAT_STATS = [
  { num: "15+", label: "Attractions" },
  { num: "20K+", label: "Happy Jumpers" },
];

const HeroV2 = ({ headerImage, locationData, estoreConfig, waiverLink, locationSlug, locationDisplay }) => {
  const heroRow = headerImage?.[0] || {};
  const cardImage = heroRow.headerimage || "";
  const cardImageAlt = heroRow.headerimagetitle || `AeroSports ${locationData?.[0]?.location || ""}`;
  const heroTitle = heroRow.title || (
    <>
      {locationDisplay ? `${locationDisplay}'s` : "The"}<br />
      <em>Ultimate Fun</em><br />
      For Kids &amp; Families
    </>
  );
  const heroSmallText =
    heroRow.smalltext ||
    heroRow.metadescription ||
    "Trampolines, ninja courses, dodgeball & more - the easiest way to plan an unforgettable birthday party or family outing.";
  // The home row in the Data sheet has a `video` column. When present, the
  // hero card plays it on loop/muted/autoplay; otherwise we fall back to the
  // headerimage still.
  const cardVideo = heroRow.video || "";
  const address = locationData?.[0]?.address || "";

  return (
    <section className="hv2-hero">
      <div className="hv2-hero-bg">
        {(cardVideo || cardImage) && (
          <div className="hv2-hero-mobile-media" aria-hidden="true">
            {cardVideo ? (
              <ResponsiveVideo
                src={cardVideo}
                posterSrc={cardImage}
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                deferSource
                deferDelay={3500}
              />
            ) : cardImage ? (
              <AppImage src={cardImage} alt="" fill priority sizes="100vw" />
            ) : (
              null
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
          <div className="hv2-hero-badge">
            <div className="hv2-hero-badge-dot" />
            <span>#1 Indoor Trampoline Park {locationDisplay ? `in ${locationDisplay}` : ""}</span>
          </div>
          <h1 className="hv2-hero-h1">{heroTitle}</h1>
          <p className="hv2-hero-sub">{heroSmallText}</p>
          {/*
            Hero CTA labels are hardcoded (universal across locations).
            Only the URLs come from data:
              - Book Now    → config.estorebase
              - View Pricing → /<location>/pricing-promos (always exists)
              - Sign Waiver → waiver link from config
            A button is hidden only if its URL is missing.
          */}
          <div className="hv2-hero-actions">
            {estoreConfig?.value && (
              <Link href={estoreConfig.value} target="_blank" rel="noopener noreferrer" className="hv2-btn hv2-btn-red hv2-btn-hero">
                Book Your Fun Now →
              </Link>
            )}
            <Link href={`/${locationSlug}/pricing-promos`} className="hv2-btn hv2-btn-outline hv2-btn-hero">
              Explore Pricing
            </Link>
          
          </div>
          <div className="hv2-hero-trust">
            {TRUST_ITEMS.map((t, i) => (
              <div className="hv2-trust-item" key={i}>
                <div className="hv2-trust-icon">{t.icon}</div>
                <div className="hv2-trust-text">
                  <strong>{t.title}</strong>
                  {t.subtitle}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hv2-hero-visual">
          <div className="hv2-hero-card-stack">
            <div className="hv2-hero-main-card">
              <div className="hv2-hero-card-bg">
                {cardVideo ? (
                  <ResponsiveVideo
                    src={cardVideo}
                    posterSrc={cardImage}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="none"
                    deferSource
                    deferDelay={3500}
                    aria-label={cardImageAlt}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  cardImage && (
                    <AppImage
                      src={cardImage}
                      alt={cardImageAlt}
                      fill
                      priority={false}
                      sizes="(max-width: 900px) 100vw, 50vw"
                    />
                  )
                )}
              </div>
              <div className="hv2-hero-card-overlay">
                <div className="hv2-now-open-chip">
                  <span style={{ width: 6, height: 6, background: "#fff", borderRadius: "50%", display: "inline-block" }} />
                  Open Today
                </div>
                <div className="hv2-hero-card-title">
                  Jump Higher.<br />Play Harder.
                </div>
                {address && <div className="hv2-hero-card-sub">{address}</div>}
              </div>
            </div>
            {FLOAT_STATS.map((s, i) => (
              <div key={i} className={`hv2-float-stat hv2-float-stat-${i + 1}`}>
                <div className="hv2-stat-num">{s.num}</div>
                <div className="hv2-stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroV2;
