import Link from "next/link";

// "Epic Attractions" section. Tag/headline/subtext are hardcoded.
// Attraction tiles come from the menu data (data sheet children of
// `attractions`). Each tile's image/name/small-tag is read from that row.
const AttractionsV2 = ({ attractions, locationSlug }) => {
  const list = Array.isArray(attractions) ? attractions.slice(0, 6) : [];
  if (list.length === 0) return null;

  return (
    <section className="hv2-attractions" id="attractions">
      <div className="hv2-section-header">
        <div>
          <div className="hv2-section-tag">What&apos;s Inside</div>
          <h2 className="hv2-section-h2">
            Epic Attractions<br />For Every Age
          </h2>
          <p className="hv2-section-sub">
            One admission unlocks non-stop action — hover to explore.
          </p>
        </div>
        <Link href={`/${locationSlug}/attractions`} className="hv2-section-link">
          View All →
        </Link>
      </div>
      <div className="hv2-attractions-grid">
        {list.map((a, i) => {
          const img = a?.smallimage || a?.headerimage;
          const name = (a?.name || a?.title || "").split(" - ").pop();
          const tagSmall = a?.smalltext || "";
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
                  {tagSmall && <div className="hv2-attr-tag-small">{tagSmall}</div>}
                  {name && <div className="hv2-attr-name">{name}</div>}
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
