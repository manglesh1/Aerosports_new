'use client';

import Link from 'next/link';
import "../styles/attractions.css";

const AttractionsGrid = ({ attractionsData, waiverLink, locationSlug }) => {
  return (
    <>
      {/* Decorative Background Elements */}
      <div className="aero_attractions_decorative_bg">
        <div className="aero_attractions_confetti aero_attractions_confetti_1"></div>
        <div className="aero_attractions_confetti aero_attractions_confetti_2"></div>
        <div className="aero_attractions_confetti aero_attractions_confetti_3"></div>
        <div className="aero_attractions_confetti aero_attractions_confetti_4"></div>
        <div className="aero_attractions_confetti aero_attractions_confetti_5"></div>

        <div className="aero_attractions_circle aero_attractions_circle_1"></div>
        <div className="aero_attractions_circle aero_attractions_circle_2"></div>
        <div className="aero_attractions_circle aero_attractions_circle_3"></div>

        <div className="aero_attractions_star aero_attractions_star_1">✨</div>
        <div className="aero_attractions_star aero_attractions_star_2">⭐</div>
        <div className="aero_attractions_star aero_attractions_star_3">✨</div>
        <div className="aero_attractions_star aero_attractions_star_4">⭐</div>
      </div>

      {/* Attractions Grid */}
      <div className="aero_attractions_grid">
        {attractionsData?.map((item, i) => (
          <Link
            key={i}
            href={`/${locationSlug}/${item?.parentid}/${item?.path}`}
            prefetch
          >
            <article className="aero_attraction_card">
              <div className="aero_attraction_card_image_wrap">
                <img
                  src={item?.smallimage}
                  alt={item?.title || item?.desc}
                  className="aero_attraction_card_image"
                />
                <div className="aero_attraction_card_image_overlay"></div>
              </div>

              <div className="aero_attraction_card_content">
                <h2 className="aero_attraction_card_title">{item?.desc}</h2>
                <p className="aero_attraction_card_description">
                  {item?.smalltext || item?.text || "Discover the excitement and adventure waiting for you!"}
                </p>
                <div className="aero_attraction_card_cta">
                  Learn More →
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </>
  );
};

export default AttractionsGrid;
