import Link from "next/link";
import PartyCarousel from "./PartyCarousel";

// Birthday parties section. Most copy is hardcoded (identical across every
// location). Dynamic pieces from data:
//   - image URL   (per-location convention under storage.googleapis.com)
//   - Book a Party URL (locationData[0].birthdayurlz / birthdaypartyurl)
//   - includes list (locationData[0].partyincludes — JSON string of strings)
//   - View Packages → /<location>/kids-birthday-parties
const DEFAULT_INCLUDES = [
  "Dedicated party host for the full session",
  "Private party room for 90 minutes",
  "Open jump session for all guests",
  "Pizza, juice boxes & cake time",
  "Grip socks for all jumpers",
];

// The locations sheet stores `partyincludes` as a JSON string of strings,
// e.g. '["Dedicated host","Private room",...]'. Fall back to the default list
// if the column is empty or unparseable so existing parks keep working.
const parseIncludes = (raw) => {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string" && raw.trim()) {
    try {
      // Tolerate trailing commas before ] that creep in from manual sheet edits.
      const parsed = JSON.parse(raw.replace(/,\s*]/g, "]"));
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      // fall through to default
    }
  }
  return DEFAULT_INCLUDES;
};

const PartyV2 = ({ locationSlug, locationData, locationDisplay, partyImages }) => {
  const defaultImg = `https://storage.googleapis.com/aerosports/webp/${locationSlug}/celeberate-your-birthday-parties-at-aerosports.webp`;
  // page-json-data.partyImages: array of image URLs for a carousel.
  // Falls back to the single default convention image when not set.
  const images = Array.isArray(partyImages) && partyImages.length > 0
    ? partyImages
    : [defaultImg];
  const birthdayUrl = locationData?.[0]?.birthdayurlz || locationData?.[0]?.birthdaypartyurl || null;
  const includes = parseIncludes(locationData?.[0]?.partyincludes);

  return (
    <section className="hv2-parties" id="parties">
      <div className="hv2-parties-inner">
        <div className="hv2-party-visual">
          {images.map((src, i) => (
            <div className="hv2-party-main-img" key={i} style={images.length > 1 ? { display: i === 0 ? "block" : "none" } : undefined} data-party-slide={i}>
              <img
                src={src}
                alt={`AeroSports birthday party ${i + 1}`}
                loading={i === 0 ? "eager" : "lazy"}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div className="hv2-party-badge">BOOK YOUR PARTY</div>
            </div>
          ))}
          {images.length > 1 && (
            <div className="hv2-party-dots">
              {images.map((_, i) => (
                <span key={i} className={`hv2-party-dot${i === 0 ? " active" : ""}`} data-dot={i} />
              ))}
            </div>
          )}
          {images.length > 1 && <PartyCarousel count={images.length} />}
        </div>

        <div className="hv2-party-content">
          <div className="hv2-section-tag">Birthdays &amp; Events</div>
          <h2>
            Best Kids Birthday<br />
            <em>Party Venue</em>{locationDisplay ? <><br />in {locationDisplay}</> : <><br />Near You</>}
          </h2>
          <p>
            All-inclusive, stress-free birthday packages — 50,000+ parties hosted
            and counting. Takes just 2 minutes to book.
          </p>
          <div className="hv2-party-includes">
            <h4>Every Package Includes</h4>
            {includes.map((it, i) => (
              <div className="hv2-include-item" key={i}>
                <div className="hv2-include-check">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l3.5 3.5 6.5-7" stroke="#22CC08" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="hv2-include-text">{it}</div>
              </div>
            ))}
          </div>
          <div className="hv2-party-actions">
            {birthdayUrl && (
              <a href={birthdayUrl} target="_blank" rel="noopener noreferrer" className="hv2-btn hv2-btn-red hv2-btn-lg">
                Book Your Party Now →
              </a>
            )}
            <Link href={`/${locationSlug}/kids-birthday-parties`} className="hv2-btn hv2-btn-lg" style={{ background: "transparent", color: "#080B18", border: "1.5px solid #ccc" }}>
              Explore Packages
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartyV2;
