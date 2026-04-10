import Link from "next/link";

// "Find Us" section. Tag/headline/subtext/labels are hardcoded.
// Dynamic pieces from the locations sheet:
//   - address, phone, email
//   - map embed URL (`map` column)
//   - directions URL (`gmburl` column, falls back to maps.google.com)
//   - hours JSON (`hours` column — stored as a JSON string)
const LocationV2 = ({ locationData, reviewdata }) => {
  const lInfo = locationData?.[0] || {};

  let hours = [];
  const sheetHours = lInfo.hours;
  if (typeof sheetHours === "string" && sheetHours.trim()) {
    try {
      // Tolerate trailing commas before ] that creep in from manual sheet edits.
      hours = JSON.parse(sheetHours.replace(/,\s*]/g, "]"));
    } catch (e) {
      hours = [];
    }
  } else if (Array.isArray(sheetHours)) {
    hours = sheetHours;
  }

  const address = lInfo.address || "";
  const phone = lInfo.phone || "";
  const email = lInfo.email || "";
  const mapEmbed = lInfo.map || "";
  const directionsUrl = lInfo.gmburl || (address ? `https://maps.google.com/?q=${encodeURIComponent(address)}` : null);

  const hasAnyContent = address || phone || email || mapEmbed || hours.length > 0;
  if (!hasAnyContent) return null;

  return (
    <section className="hv2-location" id="location">
      <div className="hv2-location-inner">
        {(mapEmbed || directionsUrl) && (
          <div className="hv2-map-box">
            {mapEmbed && (
              <iframe
                src={mapEmbed}
                title={`AeroSports ${lInfo.location || ""} location map`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}
            {directionsUrl && (
              <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="hv2-map-get-directions">
                Get Directions →
              </a>
            )}
          </div>
        )}

        <div className="hv2-location-info">
          <div className="hv2-section-tag">Find Us</div>
          <h2>
            We&apos;re Right<br />In Your Backyard
          </h2>
          <p>Walk-ins welcome · Free parking · Open today</p>
          {reviewdata?.rating && (
            <p style={{ fontSize: 14, color: "#666", marginTop: 4 }}>
              ⭐ Rated {Number(reviewdata.rating).toFixed(1)} on Google by families like yours
            </p>
          )}
          <div className="hv2-info-cards">
            {address && (
              <div className="hv2-info-card">
                <div className="hv2-info-icon">📍</div>
                <div className="hv2-info-content">
                  <strong>Address</strong>
                  <span>{address}</span>
                </div>
              </div>
            )}
            {phone && (
              <div className="hv2-info-card">
                <div className="hv2-info-icon" style={{ background: "#EDFFD6" }}>📞</div>
                <div className="hv2-info-content">
                  <strong>Phone</strong>
                  <span><a href={`tel:${phone.replace(/[^0-9+]/g, "")}`}>{phone}</a></span>
                </div>
              </div>
            )}
            {email && (
              <div className="hv2-info-card">
                <div className="hv2-info-icon" style={{ background: "#E8F0FF" }}>✉️</div>
                <div className="hv2-info-content">
                  <strong>Party Inquiries</strong>
                  <span><a href={`mailto:${email}`}>{email}</a></span>
                </div>
              </div>
            )}
          </div>
          {hours.length > 0 && (
            <>
              <h4 className="hv2-hours-h4">Hours of Operation</h4>
              <div className="hv2-hours-chips">
                {hours.map((h, i) => (
                  <div className="hv2-hours-chip" key={i}>
                    <div className="day">{h.days || h.day}</div>
                    <div className="time">{h.hours || h.time}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default LocationV2;
