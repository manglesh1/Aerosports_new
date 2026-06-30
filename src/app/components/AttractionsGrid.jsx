'use client';

import Link from 'next/link';
import "../styles/attractions.css";
import "../styles/subcategory.css";
import AppImage from "./AppImage";

const AttractionsGrid = ({ attractionsData, waiverLink, locationSlug }) => {
  return (
    <>
      {/* Attractions Grid */}


      <div className="aero_attractions_grid">
        {attractionsData?.map((item, i) => (
          <Link
            key={i}
            href={`/${locationSlug}/${item?.parentid}/${item?.path}`}
            prefetch={false}
          >
            <article className="aero_attraction_card">
              <div className="aero_attraction_card_image_wrap">
                <AppImage
                  src={item?.smallimage}
                  alt={item?.smallimage_media?.alt || item?.title || item?.desc}
                  className="aero_attraction_card_image"
                  width={400}
                  height={300}
                  sizes="(max-width: 768px) calc(100vw - 32px), 33vw"
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
