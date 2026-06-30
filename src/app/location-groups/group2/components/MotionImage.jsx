import React from "react";
import Link from "next/link";
import AppImage from "./AppImage";
import ResponsiveVideo from "./ResponsiveVideo";

const MotionImage = ({
  pageData,
  waiverLink,
  locationData,
  hideOverlay = false,
  headingAs = "h1",
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  reviewText,
  reviewName,
  playVideoOnMobile = true,
}) => {
  const Heading = headingAs;
  const item =
    Array.isArray(pageData) && pageData.length > 0 ? pageData[0] : pageData;

  if (!item) return null;

  const locData = Array.isArray(locationData) ? locationData[0] : locationData;
  const locationName = locData?.location
    ? `${locData.location.charAt(0).toUpperCase()}${locData.location.slice(1)}, ON`
    : item.location || "";
  const heroImage =
    item.headerimage ||
    "https://storage.googleapis.com/aerosports/aerosports-trampoline-park-redefine-fun.svg";
  const heroVideo = item.video || "";
  const heroAlt = item.headerimagetitle || item.title || "AeroSports";
  const title = item.title || item.headerimagetitle || "AeroSports";
  const description = item.smalltext || item.metadescription || "";
  const defaultPrimaryLabel = title.toLowerCase().includes("birthday")
    ? "Book a Party"
    : "Book Now";
  const resolvedPrimaryHref =
    primaryHref ||
    item.buttonurl ||
    item.bookingurl ||
    item.url ||
    (locData ? waiverLink || "#" : "/#locations");
  const resolvedPrimaryLabel = primaryLabel || item.buttontext || defaultPrimaryLabel;
  const resolvedSecondaryHref = secondaryHref || waiverLink || "";
  const resolvedSecondaryLabel = secondaryLabel || (waiverLink ? "Sign Waiver" : "");
  const resolvedReviewText =
    reviewText || "Our team makes planning simple, fast, and fun from start to finish.";

  if (hideOverlay) {
    return (
      <section className="aero_home-headerimg-wrapper" aria-hidden="true">
        <div className="aero_home_video-container">
          {heroVideo ? (
            <ResponsiveVideo
              src={heroVideo}
              sourceMedia={playVideoOnMobile ? undefined : "(min-width: 821px)"}
              posterSrc={heroImage}
              autoPlay
              muted
              loop
              playsInline
              preload="none"
            />
          ) : (
            <AppImage src={heroImage} alt="" fill priority sizes="100vw" />
          )}
        </div>
      </section>
    );
  }

  const isExternalPrimary = /^https?:\/\//i.test(resolvedPrimaryHref);
  const isExternalSecondary = /^https?:\/\//i.test(resolvedSecondaryHref);

  return (
    <section className="v11_bp_party_hero v11_inner_hero">
      <div className="v11_bp_party_hero_media" aria-hidden="true">
        {heroVideo ? (
          <ResponsiveVideo
            src={heroVideo}
            sourceMedia={playVideoOnMobile ? undefined : "(min-width: 821px)"}
            posterSrc={heroImage}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
          />
        ) : (
          <AppImage src={heroImage} alt={heroAlt} fill priority sizes="100vw" />
        )}
      </div>
      <div className="v11_bp_party_hero_overlay" />
      <div className="v11_bp_party_hero_pattern" />

      <div className="v11_bp_party_hero_inner">
        <div className="v11_bp_party_hero_content">
          {locationName && <p className="v11_bp_party_hero_location">{locationName}</p>}
          <Heading>{title}</Heading>
          {description && <p>{description}</p>}
          <div className="v11_bp_party_hero_actions">
            <Link
              href={resolvedPrimaryHref}
              className="v11_bp_party_hero_primary"
              target={isExternalPrimary ? "_blank" : undefined}
              rel={isExternalPrimary ? "noopener noreferrer" : undefined}
            >
              {resolvedPrimaryLabel}
            </Link>
            {resolvedSecondaryHref && (
              <Link
                href={resolvedSecondaryHref}
                className="v11_bp_party_hero_secondary"
                target={isExternalSecondary ? "_blank" : undefined}
                rel={isExternalSecondary ? "noopener noreferrer" : undefined}
              >
                {resolvedSecondaryLabel}
              </Link>
            )}
          </div>
        </div>

        <aside className="v11_bp_party_hero_review">
          <div className="v11_bp_party_hero_stars" aria-label="5 star rating">
            {[...Array(5)].map((_, index) => (
              <svg key={index} viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
          <p>{resolvedReviewText}</p>
          {reviewName && <strong>{reviewName}</strong>}
        </aside>
      </div>
    </section>
  );
};

export default MotionImage;
