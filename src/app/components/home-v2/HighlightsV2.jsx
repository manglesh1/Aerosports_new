// Stat cards strip below the hero. Labels/icons/desc are hardcoded — the
// *value* is resolved live for three of the four cards:
//   - rating      → average star rating from the reviews API
//   - attractions → real count of attraction tiles for this location
//   - location    → the location display name from the locations sheet
const CARDS = [
  { icon: "🎯", source: "attractions", label: "Attractions", desc: "Something for everyone", fallback: "10+" },
  { icon: "🎉", source: null,          label: "Parties Hosted", desc: "Unforgettable memories", num: "50K+" },
  { icon: "⭐", source: "rating",      label: "Star Rated", desc: "On Google reviews", fallback: "4.8★" },
  { icon: "📍", source: "location",    label: "Location", desc: "Easy to find", fallback: "AeroSports" },
];

const HighlightsV2 = ({ reviewdata, attractionsCount, locationDisplay }) => {
  const apiRating = reviewdata?.rating
    ? `${Number(reviewdata.rating).toFixed(1)}★`
    : null;

  const resolveNum = (c) => {
    if (c.source === "rating") return apiRating || c.fallback;
    if (c.source === "attractions") return attractionsCount > 0 ? `${attractionsCount}+` : c.fallback;
    if (c.source === "location") return locationDisplay || c.fallback;
    return c.num;
  };

  return (
    <section className="hv2-highlights">
      <div className="hv2-highlights-inner">
        {CARDS.map((c, i) => (
          <div key={i} className="hv2-hl-card">
            <div className="hv2-hl-icon">{c.icon}</div>
            <div className="hv2-hl-num">{resolveNum(c)}</div>
            <div className="hv2-hl-label">{c.label}</div>
            <div className="hv2-hl-desc">{c.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HighlightsV2;
