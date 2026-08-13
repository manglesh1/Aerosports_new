import { getActivePromotionsForPath, getPromotionDisplayData } from "@/lib/promotions";
import PromoCountdown from "@/components/sections/PromoCountdown";

const DAY_MS = 24 * 60 * 60 * 1000;

const parsePromoDate = (value) => {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "number" && Number.isFinite(value)) {
    return new Date(Date.UTC(1899, 11, 30) + value * DAY_MS);
  }

  const raw = String(value).trim();
  const numericDate = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (numericDate) {
    const first = Number(numericDate[1]);
    const second = Number(numericDate[2]);
    const year = Number(numericDate[3].length === 2 ? `20${numericDate[3]}` : numericDate[3]);
    const dayFirst = first > 12 || raw.includes("-");
    const date = new Date(year, (dayFirst ? second : first) - 1, dayFirst ? first : second, 23, 59, 59, 999);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getTimeLeft = (validTo) => {
  const endDate = parsePromoDate(validTo);
  if (!endDate) return null;
  const totalMs = endDate.getTime() - Date.now();
  if (totalMs <= 0) return null;
  const days = Math.floor(totalMs / DAY_MS);
  const hours = Math.floor((totalMs % DAY_MS) / (60 * 60 * 1000));
  const minutes = Math.floor((totalMs % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((totalMs % (60 * 1000)) / 1000);
  return { days, hours, minutes, seconds };
};

export default function DiscountPromoSlot({
  promotions,
  locationSlug,
  path,
  variant = "light",
  limit = 2,
  primaryHref = "",
  className = "",
  countdownHours = 0,
  hideValidity = false,
}) {
  const activePromotions = getActivePromotionsForPath(promotions, {
    locationSlug,
    path,
    limit,
  });

  if (activePromotions.length === 0) return null;

  if (variant === "landing") {
    const promo = getPromotionDisplayData(activePromotions[0]);
    const href = promo.link || primaryHref;
    const timeLeft = getTimeLeft(promo.validTo);
    const hasValidTo = Boolean(timeLeft);

    return (
      <section className={`landing_discount_offer ${className}`.trim()} aria-label="Limited time offer">
        {hasValidTo ? (
          <PromoCountdown
            deadline={promo.validTo}
            storageKey={`aero_promo_${locationSlug || "x"}_${path || "x"}_${promo.validTo}`}
          />
        ) : countdownHours ? (
          <PromoCountdown
            hours={countdownHours}
            storageKey={`aero_promo_${locationSlug || "x"}_${path || "x"}`}
          />
        ) : (
          timeLeft && (
            <div className="landing_discount_timer">
              <span>Sale ends in</span>
              <strong>{timeLeft.days}d</strong>
              <strong>{timeLeft.hours}h</strong>
              <strong>{timeLeft.minutes}m</strong>
              <strong>{timeLeft.seconds}s</strong>
            </div>
          )
        )}

        <div className="landing_discount_inner">
          <div className="landing_discount_copy">
            {promo.badge && <span className="landing_discount_badge">{promo.badge}</span>}
            <h2>{promo.title}</h2>
            {promo.description && <p>{promo.description}</p>}
            <ul>
              {!hideValidity && promo.validity && <li>{promo.validity}</li>}
              {promo.code && <li>Use code <strong>{promo.code}</strong></li>}
            </ul>
            {href && <a className="landing_discount_cta" href={href}>{promo.linkText}</a>}
          </div>

          <div className="landing_discount_price_card">
            <span>Current Deal</span>
            <h3>{promo.code ? promo.code : "Limited Offer"}</h3>
            {promo.description && <p>{promo.description}</p>}
            {href && <a href={href}>Claim Now</a>}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`page_discount_slot page_discount_slot_${variant} ${className}`.trim()}>
      <div className="page_discount_slot_inner">
        <div className="page_discount_slot_intro">
          <span>Active Offer</span>
          <h2>Don&apos;t miss today&apos;s deal</h2>
          <p>Valid offers from the promotion sheet appear here automatically for this page.</p>
        </div>

        <div className="page_discount_slot_grid">
          {activePromotions.map((promotion, index) => {
            const promo = getPromotionDisplayData(promotion);
            const href = promo.link || primaryHref;

            return (
              <article className="page_discount_card" key={`${promo.title}-${index}`}>
                <div>
                  {promo.badge && <span className="page_discount_badge">{promo.badge}</span>}
                  <h3>{promo.title}</h3>
                  {promo.description && <p>{promo.description}</p>}
                </div>

                <div className="page_discount_meta">
                  {promo.validity && <small>{promo.validity}</small>}
                  {promo.code && (
                    <span className="page_discount_code">
                      Code: <strong>{promo.code}</strong>
                    </span>
                  )}
                </div>

                {href && (
                  <a className="page_discount_cta" href={href}>
                    {promo.linkText}
                  </a>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
