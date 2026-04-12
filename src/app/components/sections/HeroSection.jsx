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
      <div className="z-20 absolute inset-0 flex justify-center items-start sm:items-center bg-gradient-to-b from-black/60 via-black/50 to-black/70 px-6 pt-24 sm:pt-30 md:pt-40 lg:pt-50 pb-16 overflow-y-auto">
        <div className="max-w-4xl text-center animate-[fadeInUp_1s_ease-out]">
          {/* Badge */}
          <div className="hidden sm:inline-block mb-8 px-5 py-2 bg-[#c8ff00] rounded-full font-bold text-white text-xs uppercase tracking-[1.5px] animate-[scaleIn_0.8s_ease-out]">
            Experience Pure Adrenaline
          </div>

          {/* Heading */}
          <h1
            className="mb-6 font-black text-[clamp(2.5rem,7vw,4rem)] text-white uppercase leading-[1.1] tracking-[1px] animate-[fadeInUp_1s_ease-out_0.2s_backwards]"
            style={{ fontFamily: "var(--font-roboto-condensed, 'Roboto Condensed', sans-serif)" }}
          >
            Jump Into The Fun at{" "}
            <span className="text-[#c8ff00]" style={{ textShadow: '0 0 30px rgba(200,255,0,0.4)' }}>
              AeroSports {locationData?.[0]?.location || "Oakville"}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-10 max-w-xl text-white/80 text-lg leading-relaxed animate-[fadeInUp_1s_ease-out_0.4s_backwards]">
            {headerImage?.[0]?.smalltext || ""}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 animate-[fadeInUp_1s_ease-out_0.6s_backwards]">
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
