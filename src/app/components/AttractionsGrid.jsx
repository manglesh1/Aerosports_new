'use client';

import Link from 'next/link';
import Image from 'next/image';
import "../styles/attractions.css";
import "../styles/subcategory.css";

const AttractionsGrid = ({ attractionsData, waiverLink, locationSlug }) => {
  return (
    <>
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
                <Image
                  src={item?.smallimage}
                  alt={item?.title || item?.desc}
                  className="aero_attraction_card_image"
                  width={400}
                  height={300}
                  loading="lazy"
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
