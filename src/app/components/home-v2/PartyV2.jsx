import Link from "next/link";
import Image from "next/image";

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

const PartyV2 = ({ locationSlug, locationData }) => {
  const partyImage = `https://storage.googleapis.com/aerosports/webp/${locationSlug}/celeberate-your-birthday-parties-at-aerosports.webp`;
  const birthdayUrl = locationData?.[0]?.birthdayurlz || locationData?.[0]?.birthdaypartyurl || null;
  const includes = parseIncludes(locationData?.[0]?.partyincludes);

  return (
    <section className="hv2-parties" id="parties">
      <div className="hv2-parties-inner">
        <div className="hv2-party-visual">
          <div className="hv2-party-main-img">
            <Image
              src={partyImage}
              alt="AeroSports birthday party"
              fill
              sizes="(max-width: 900px) 100vw, 480px"
              style={{ objectFit: "cover" }}
            />
            <div className="hv2-party-badge">BOOK YOUR PARTY</div>
          </div>
        </div>

        <div className="hv2-party-content">
          <div className="hv2-section-tag">Birthdays & Events</div>
          <h2>
            Parties That&apos;ll<br />
            <em>Be Talked About</em><br />
            For Years
          </h2>
          <p>
            From little ones to teenagers — our birthday packages take all the
            stress off your plate so you can actually enjoy the party too.
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
                Book a Party →
              </a>
            )}
            <Link href={`/${locationSlug}/kids-birthday-parties`} className="hv2-btn hv2-btn-lg" style={{ background: "transparent", color: "#080B18", border: "1.5px solid #ccc" }}>
              View Packages
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartyV2;
