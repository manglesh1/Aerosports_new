// Stat cards strip below the hero. Labels/descriptions are hardcoded; values
// are resolved live for attractions, rating, and location.
const CARDS = [
  { source: "attractions", label: "Attractions", desc: "For all age groups", fallback: "10+" },
  { source: "parties", label: "Birthday Parties Hosted", desc: "Stress-free celebrations", num: "20K+" },
  { source: "rating", label: "Rated on Google", desc: "By families like yours", fallback: "4.8" },
  { source: "location", label: "Trusted by Families", desc: "Your local fun destination", fallback: "AeroSports" },
];

const HighlightsV2 = ({ reviewdata, attractionsCount, locationDisplay }) => {
  const apiRating = reviewdata?.rating ? Number(reviewdata.rating).toFixed(1) : null;

  const resolveNum = (card) => {
    if (card.source === "rating") return apiRating || card.fallback;
    if (card.source === "attractions") return attractionsCount > 0 ? `${attractionsCount}+` : card.fallback;
    if (card.source === "location") return locationDisplay || card.fallback;
    return card.num;
  };

  return (
    <section className="hv2-highlights">
      <div className="hv2-highlights-inner">
        {CARDS.map((card, index) => (
          <div key={card.source} className={`hv2-hl-card hv2-hl-card_${card.source}`}>
            <div className="hv2-hl-icon" />
            <div className={`hv2-hl-num ${index % 2 === 0 ? "hv2-hl-green" : "hv2-hl-pink"}`}>
              {resolveNum(card)}
            </div>
            <div className="hv2-hl-label">{card.label}</div>
            <div className="hv2-hl-desc">{card.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HighlightsV2;
