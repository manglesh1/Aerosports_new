import MotionImage from "@/components/MotionImage";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = ({ headerImage, waiverLink, locationData, estoreConfig, locationSlug }) => {
  return (
    <section className="relative flex justify-center items-center pt-20 sm:pt-30 md:pt-40 lg:pt-50 w-full min-h-screen overflow-hidden">
      {/* Background Motion Image */}

      <MotionImage
        pageData={headerImage}
        waiverLink={waiverLink}
        locationData={locationData}
        hideOverlay={true}
      />

      {/* Overlay */}
      <div className="z-20 absolute inset-0 flex justify-center items-start sm:items-center bg-gradient-to-br from-black/50 to-black/60 px-6 pt-24 sm:pt-30 md:pt-40 lg:pt-50 pb-16 overflow-y-auto">
        <div className="max-w-7xl text-center animate-[fadeInUp_1s_ease-out]">
          {/* Badge */}
          <div className="hidden sm:inline-block mb-10 px-7 py-3 border-[#39FF14] border-2 rounded-full font-bold text-[#39FF14] text-[0.85rem] uppercase tracking-wide animate-[scaleIn_0.8s_ease-out]">
            Experience Pure Adrenaline
          </div>

          {/* Heading */}
          <h1 className="mb-6 font-black text-[clamp(2.8rem,8vw,4.5rem)] text-white uppercase leading-tight tracking-[2px] animate-[fadeInUp_1s_ease-out_0.2s_backwards]">
            Jump Into The Fun at{" "}
            <span className="text-[#39FF14]">
              AeroSports {locationData?.[0]?.location || "Oakville"}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-10 max-w-xl text-gray-300 text-lg leading-relaxed animate-[fadeInUp_1s_ease-out_0.4s_backwards]">
            {headerImage?.[0]?.smalltext || ""}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-10 animate-[fadeInUp_1s_ease-out_0.6s_backwards]">
            {/* <div className="text-center">
              <div className="font-black text-[#39FF14] text-4xl">27,000+</div>
              <p className="opacity-90 text-white">Sq Ft of Fun</p>
            </div> */}

            <div className="text-center">
              <div className="font-black text-pink-500 text-4xl">8+</div>
              <p className="opacity-90 text-white">Attractions</p>
            </div>

            <div className="text-center">
              <div className="bg-clip-text bg-gradient-to-r from-[#39FF14] to-pink-500 font-black text-transparent text-4xl">
                All Ages
              </div>
              <p className="opacity-90 text-white">Welcome</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-6 animate-[fadeInUp_1s_ease-out_0.8s_backwards]">
            {estoreConfig?.value && (
              <Button variant="primary" asChild>
                <Link href={estoreConfig.value} target="_blank">
                Book Now
                </Link>
              </Button>
            )}
            <Button variant="secondary" asChild>
              <Link href={waiverLink || '#'}>
                Waiver
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
				@keyframes fadeInUp {
					from { opacity: 0; transform: translateY(30px); }
					to { opacity: 1; transform: translateY(0); }
				}
				@keyframes scaleIn {
					0% { transform: scale(0.8); opacity: 0; }
					100% { transform: scale(1); opacity: 1; }
				}
			`}</style>
    </section>
  );
};

export default HeroSection;
