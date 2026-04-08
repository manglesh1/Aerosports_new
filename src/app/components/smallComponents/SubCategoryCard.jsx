import Link from "next/link";
import Image from "next/image";

const SubCategoryCard = ({
  attractionsData,
  location_slug,
  theme,
  title,
  text,
  parentpath,
}) => {
  if (!attractionsData || attractionsData.length === 0) return null;

  return (
    <section className="v11_bp_attractions_section">
      <div className="v11_bp_container">
        {/* Title */}
        {title && (
          <h2 className="v11_bp_heading">
            {title.split(" ").slice(0, -1).join(" ")}
            <span className="v11_bp_heading_accent"> {title.split(" ").slice(-1)}</span>
          </h2>
        )}

        {/* Grid */}
        <div className="v11_bp_attractions_grid">
          {attractionsData.map((item, i) => (
            <Link
              key={i}
              href={`/${location_slug}/${item?.parentid}/${item?.path}`}
              className="v11_bp_attraction_card"
              prefetch
            >
              <div className="v11_bp_attraction_img">
                {item?.smallimage ? (
                  <Image
                    src={item.smallimage}
                    alt={item?.desc || item?.title || item?.path?.replace(/-/g, " ")}
                    fill
                    sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 992px) 33vw, 250px"
                    style={{ objectFit: "cover" }}
                    loading="lazy"
                  />
                ) : (
                  <div className="v11_bp_attraction_placeholder" />
                )}
              </div>
              <div className="v11_bp_attraction_overlay">
                <h3 className="v11_bp_attraction_name">
                  {item?.desc || item?.title || item?.path?.replace(/-/g, " ")}
                </h3>
                <span className="v11_bp_attraction_more">Learn More →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubCategoryCard;
