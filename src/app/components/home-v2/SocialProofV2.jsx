// "What Families Say" section. Tag/headline/labels are hardcoded. Dynamic:
//   - reviews + rating from the live Google API
//   - instagram handle from locations sheet (locationData[0].insta — stores
//     just the username, e.g. "aerosportsoakville"). The full URL is built
//     the same way Header.jsx does it.
//
// The Instagram strip below the reviews shows 6 themed placeholder tiles
// (identical across every location). Each tile links out to the location's
// Instagram account. Tiles are hidden entirely if there is no insta handle.
const INSTA_TILES = [
  { icon: "🤸", bg: "#2A0E0A" },
  { icon: "🎯", bg: "#0E1F12" },
  { icon: "🎂", bg: "#0F1228" },
  { icon: "🥋", bg: "#1F1208" },
  { icon: "🌊", bg: "#0A1F22" },
  { icon: "🏆", bg: "#1F1F08" },
];

// Truncate long review text to roughly 2-3 lines (audit: reviews too long)
const MAX_REVIEW_CHARS = 180;
const truncateReview = (text) => {
  if (!text || text.length <= MAX_REVIEW_CHARS) return text;
  return text.slice(0, MAX_REVIEW_CHARS).replace(/\s+\S*$/, "") + "…";
};

const SocialProofV2 = ({ reviewdata, locationData }) => {
  // API shape: { rating: 4.6, total_reviews: 1024, reviews: [{ author_name, rating, text, ... }] }
  const apiReviews = Array.isArray(reviewdata?.reviews) ? reviewdata.reviews : [];
  const reviews = apiReviews.slice(0, 3).map((r) => ({
    stars: r.rating || 5,
    text: truncateReview(r.text || ""),
    name: r.author_name || "Guest",
  }));

  const overallRating = reviewdata?.rating
    ? Number(reviewdata.rating).toFixed(1)
    : null;
  // The API may return total_reviews or user_ratings_total
  const reviewCount = reviewdata?.total_reviews || reviewdata?.user_ratings_total || null;

  const instaHandle = locationData?.[0]?.insta || null;
  // The sheet stores the raw handle; tolerate someone pasting a full URL too.
  const instaUrl = instaHandle
    ? (instaHandle.startsWith("http") ? instaHandle : `https://www.instagram.com/${instaHandle}`)
    : null;

  return (
    <section className="hv2-social" id="reviews">
      <div className="hv2-social-inner">
        <div className="hv2-social-header">
          <div>
            <div className="hv2-section-tag">What Families Say</div>
            <h2 className="hv2-section-h2" style={{ fontSize: "clamp(32px,4vw,52px)" }}>
              Real Reviews.<br />Real Smiles.
            </h2>
          </div>
          {overallRating && (
            <div className="hv2-rating-badge">
              <div className="hv2-rating-num">{overallRating}</div>
              <div>
                <div className="hv2-rating-stars">★★★★★</div>
                <div className="hv2-rating-count">
                  {reviewCount ? `Rated on Google by ${Number(reviewCount).toLocaleString()}+ families` : "Google reviews"}
                </div>
              </div>
            </div>
          )}
        </div>

        {reviews.length > 0 && (
          <div className="hv2-reviews-grid">
            {reviews.map((r, i) => (
              <div className="hv2-review-card" key={i}>
                <div className="hv2-stars">{"★".repeat(Number(r.stars) || 5)}</div>
                <p>&ldquo;{r.text}&rdquo;</p>
                <div className="hv2-reviewer-name">{r.name}</div>
                <div className="hv2-review-source">Google Review</div>
              </div>
            ))}
          </div>
        )}

        {instaUrl && (
          <div className="hv2-insta-section">
            <div className="hv2-insta-header">
              <div className="hv2-insta-title">Follow The Fun 📸</div>
              <a href={instaUrl} target="_blank" rel="noopener noreferrer" className="hv2-insta-handle">
                @{instaHandle.replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "")} →
              </a>
            </div>
            <div className="hv2-insta-grid">
              {INSTA_TILES.map((t, i) => (
                <a
                  key={i}
                  href={instaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hv2-insta-tile"
                  aria-label="View on Instagram"
                >
                  <div className="hv2-insta-tile-bg" style={{ background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>
                    <span aria-hidden="true">{t.icon}</span>
                  </div>
                  <div className="hv2-insta-tile-overlay">
                    <div className="hv2-insta-heart">♥</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SocialProofV2;
