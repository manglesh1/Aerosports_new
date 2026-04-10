import Link from "next/link";

// Attractions section. Tag/headline/subtext are hardcoded and interpolate
// the location display name for SEO. Tiles come from the menu data (data
// sheet children of `attractions`).
//
// Per-attraction data from the Data sheet:
//   - smalltext → one-line description (already in sheet, shown on the card)
//   - audience  → audience chip, e.g. "Ages 3-8" (optional column, falls back to defaults)
//   - priority  → lower = shown first (optional column, falls back to defaults)
//
// Default audience/priority by path so cards work even before sheet columns
// are added. Sheet values override these when present.
const AUDIENCE_DEFAULTS = {
  "open-jump":        { audience: "All Ages",      priority: 1 },
  "dodgeball":        { audience: "Teens & Groups", priority: 2 },
  "ninja-warrior":    { audience: "Kids & Teens",  priority: 3 },
  "battle-beam":      { audience: "All Ages",      priority: 4 },
  "slam-basketball":  { audience: "Kids & Teens",  priority: 5 },
  "soft-play":        { audience: "Ages 2-5",      priority: 6 },
  "toddler-zone":     { audience: "Ages 2-5",      priority: 6 },
  "kidzone":          { audience: "Ages 2-5",      priority: 6 },
  "dark-ride-theater": { audience: "All Ages",     priority: 7 },
  "hexaquest":        { audience: "All Ages",      priority: 8 },
  "tile-hunt":        { audience: "Kids & Teens",  priority: 9 },
  "aero-ladder":      { audience: "All Ages",      priority: 10 },
  "aero-drop":        { audience: "All Ages",      priority: 11 },
  "foam-pit":         { audience: "All Ages",      priority: 4 },
  "rock-climbing":    { audience: "All Ages",      priority: 8 },
  "wipeout":          { audience: "All Ages",      priority: 9 },
  "arcade":           { audience: "All Ages",      priority: 13 },
};

const AttractionsV2 = ({ attractions, locationSlug, locationDisplay }) => {
  let list = (Array.isArray(attractions) ? attractions : []).map((a) => {
    const defaults = AUDIENCE_DEFAULTS[a?.path] || {};
    return {
      ...a,
      _desc: a?.smalltext || "",
      _audience: a?.audience || defaults.audience || "",
      _priority: Number(a?.priority) || defaults.priority || 99,
    };
  });
  list.sort((a, b) => a._priority - b._priority);
  list = list.slice(0, 6);

  if (list.length === 0) return null;

  return (
    <section className="hv2-attractions" id="attractions">
      <div className="hv2-section-header">
        <div>
          <div className="hv2-section-tag">What&apos;s Inside</div>
          <h2 className="hv2-section-h2">
            Indoor Trampoline Park<br />Attractions{locationDisplay ? ` in ${locationDisplay}` : ""}
          </h2>
          <p className="hv2-section-sub">
            Explore trampolines, ninja courses, dodgeball &amp; interactive games
            designed for all age groups — one admission unlocks everything.
          </p>
        </div>
        <Link href={`/${locationSlug}/attractions`} className="hv2-section-link">
          Explore All Attractions →
        </Link>
      </div>
      <div className="hv2-attractions-grid">
        {list.map((a, i) => {
          const img = a?.smallimage || a?.headerimage;
          const name = (a?.name || a?.title || "").split(" - ").pop();
          return (
            <Link
              key={a?.path || i}
              href={`/${locationSlug}/attractions/${a?.path}`}
              className={`hv2-attr-tile${i === 0 ? " hv2-attr-tile-big" : ""}`}
            >
              <div
                className="hv2-attr-bg"
                style={img ? { backgroundImage: `url('${img}')` } : undefined}
              >
                <div className="hv2-attr-overlay" />
                <div className="hv2-attr-hover-overlay" />
                <div className="hv2-attr-content">
                  {a._audience && <div className="hv2-attr-audience">{a._audience}</div>}
                  {name && <div className="hv2-attr-name">{name}</div>}
                  {a._desc && <div className="hv2-attr-desc">{a._desc}</div>}
                  <span className="hv2-attr-cta">Explore →</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default AttractionsV2;
