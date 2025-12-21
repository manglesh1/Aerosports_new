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
  return (
    <section className="relative z-10">
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        {/* Title Section */}
        {title && (
          <h2 className="flex items-center gap-3 text-2xl md:text-3xl font-bold bg-linear-to-r from-[#ff1152] to-[#f00c74] bg-clip-text text-transparent mb-8" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            <svg
              className="w-8 h-8 text-[#ff1152]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4l3 3" />
            </svg>
            {title}
          </h2>
        )}

        {/* Attractions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-10">
          {attractionsData.map((item, i) => (
            <Link
              key={i}
              href={`/${location_slug}/${item?.parentid}/${item?.path}`}
              prefetch
              className="group"
            >
              <article
                className="relative bg-linear-to-br from-black/80 to-zinc-900/60 rounded-[20px] overflow-hidden cursor-pointer transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] opacity-0 translate-y-[30px] animate-[cardFadeIn_0.6s_ease_forwards] shadow-[0_10px_30px_rgba(255,17,82,0.3),0_0_0_2px_rgba(255,17,82,0.2)] hover:-translate-y-2.5 hover:scale-[1.03] hover:shadow-[0_20px_50px_rgba(255,17,82,0.5),0_0_60px_rgba(202,255,26,0.4)]"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
                  animationDelay: `${i * 0.1}s`
                }}
              >
                {/* Card Image Container */}
                <div className="relative w-full h-[280px] overflow-hidden">
                  <Image
                    src={item?.smallimage}
                    width={400}
                    height={280}
                    alt={item?.title || item?.desc}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.15]"
                    unoptimized
                  />
                  {/* Gradient Overlay on Image */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-linear-to-t from-black/90 to-transparent z-1"></div>
                </div>

                {/* Card Content */}
                <div className="p-6 relative z-2">
                  <h2
                    className="text-[1.4rem] font-extrabold bg-linear-to-r from-[#ff1152] to-[#f00c74] bg-clip-text text-transparent m-0 mb-2 tracking-[0.5px] uppercase"
                    style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                  >
                    {item?.desc}
                  </h2>
                  <p className="text-gray-300 text-[0.95rem] leading-relaxed mb-4 line-clamp-3">
                    {item?.smalltext || item?.text || "Discover the excitement and adventure waiting for you!"}
                  </p>
                  <div
                    className="inline-block bg-linear-to-r from-[#ff1152] to-[#f00c74] text-white py-2.5 px-6 font-bold text-[0.9rem] uppercase tracking-[0.5px] border-2 border-[rgba(255,17,82,0.5)] shadow-[0_4px_12px_rgba(255,17,82,0.3)] transition-all duration-300 relative overflow-hidden group-hover:border-[#caff1a] group-hover:shadow-[0_6px_20px_rgba(255,17,82,0.5),0_0_30px_rgba(202,255,26,0.3)] group-hover:translate-x-[5px]"
                    style={{ clipPath: 'polygon(8% 0, 100% 0, 92% 100%, 0 100%)' }}
                  >
                    Learn More →
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubCategoryCard;
