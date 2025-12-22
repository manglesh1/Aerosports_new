"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
const MotionImage = ({ pageData, waiverLink, locationData, hideOverlay = false }) => {
  //console.log(header_image);
  const item =
    Array.isArray(pageData) && pageData.length > 0 ? pageData[0] : pageData;
  // Handle case when no item exists
  if (!item) return null;

  const locData = locationData[0];
  const hasVideo = !!item.video;
  const toTelHref = (phone) => {
    const digits = (phone || "").replace(/\D/g, "");
    if (!digits) return "tel:";
    // North America: add +1 if missing, keep leading 1 if present
    const e164 =
      digits.length === 11 && digits.startsWith("1")
        ? `+${digits}`
        : `+1${digits}`;
    return `tel:${e164}`;
  };

  if (hasVideo)
    return (
      <section
        className="aero_home-headerimg-wrapper"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
          margin: 0,
          padding: 0,
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        <section
          className="aero_home_video-container"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
            margin: 0,
            padding: 0,
            overflow: "hidden",
          }}
        >
          <video
            autoPlay
            muted
            loop
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              margin: 0,
              padding: 0,
              objectFit: "cover",
            }}
          >
            <source src={item.video} type="video/mp4" />
          </video>

          {/* Overlay Content - Only show if hideOverlay is false */}
          {!hideOverlay && (
            <div className="z-20 absolute inset-0 flex justify-center items-center bg-gradient-to-br from-black/50 to-black/70 px-6 py-16">
              <motion.div
                className="max-w-3xl text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                {/* Title */}
                <h1 className="mb-4 font-black text-[clamp(2rem,6vw,3.5rem)] text-white uppercase leading-tight tracking-wide">
                  {item.title}
                </h1>

                {/* Small Text */}
                {item.smalltext && (
                  <p className="mx-auto mb-8 max-w-xl text-gray-300 text-lg leading-relaxed">
                    {item.smalltext}
                  </p>
                )}

                {/* Info Blocks */}
                {locData && (
                  <div className="space-y-4 mb-8 text-white text-lg">
                    <p>
                      <span className="font-bold text-neon-green">Phone: </span>
                      <a
                        href={toTelHref(locData.phone)}
                        aria-label={`Call AeroSports ${locData.location} at ${locData.phone}`}
                        className="hover:text-neon-green transition"
                      >
                        {locData.phone}
                      </a>
                    </p>

                    <p>
                      <span className="font-bold text-neon-green">Address: </span>
                      <a
                        href={locData.gmburl}
                        target="_blank"
                        className="hover:text-neon-green transition"
                      >
                        {locData.address}
                      </a>
                    </p>
                  </div>
                )}

                {/* Waiver Button */}
                {waiverLink && (
                  <div className="flex justify-center">
                    <Link
                      href={waiverLink}
                      target="_blank"
                      title="sign your waiver at aerosports trampoline park"
                    >
                      <motion.button
                        className="bg-neon-green hover:bg-[#2ddb10] shadow-[0_0_20px_#39FF14] px-8 py-3 rounded-full font-bold text-black transition animate-pulse"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        Sign Waiver
                      </motion.button>
                    </Link>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </section>
      </section>
    );

  return (
    <section className="aero_home-headerimg-wrapper" style={{ width: "100%", margin: 0, padding: 0 }}>
      <div className="aero_home-headerimg-container" style={{ width: "100%", maxWidth: "none", margin: 0, padding: 0 }}>
        <div
          className="image-container"
          style={{ maxHeight: "800px", minHeight: "450px", width: "100%", position: "relative", margin: 0, padding: 0 }}
        >
          <Image
            src={
              item.headerimage ||
              "https://storage.googleapis.com/aerosports/aerosports-trampoline-park-redefine-fun.svg"
            }
            alt={item.headerimagetitle || "Aerosports fun for everyone"}
            fill
            style={{ objectFit: "cover" }}
            quality={85}
            priority
          />

          <motion.article
            className="image-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1.5,
            }}
          ></motion.article>
          <div className="z-20 absolute inset-0 flex justify-center items-center bg-gradient-to-br from-black/50 to-black/70 px-6 py-16">
  <div className="max-w-3xl text-center animate-[fadeInUp_1s_ease-out]">

    {/* Title */}
    <h1 className="mb-4 font-black text-[clamp(2rem,6vw,3.5rem)] text-white leading-tight tracking-wide">
      {item.title}
    </h1>

    {/* Small Text */}
    <p className="mx-auto mb-8 max-w-xl text-gray-300 text-lg leading-relaxed">
      {item.smalltext}
    </p>

    {/* Info Blocks */}
    <div className="space-y-4 mb-8 text-white text-lg">
      <p>
        <span className="font-bold text-[#39FF14]">Phone: </span>
        <a
          href={toTelHref(locData.phone)}
          aria-label={`Call AeroSports ${locData.location} at ${locData.phone}`}
          className="hover:text-[#39FF14] transition"
        >
          {locData.phone}
        </a>
      </p>

      <p>
        <span className="font-bold text-[#39FF14]">Address: </span>
        <a
          href={locData.gmburl}
          target="_blank"
          className="hover:text-[#39FF14] transition"
        >
          {locData.address}
        </a>
      </p>
    </div>

    {/* Waiver Button */}
    {waiverLink && (
      <div className="flex justify-center animate-[fadeInUp_1s_ease-out_0.5s_backwards]">
        <Link
          href={waiverLink}
          target="_blank"
          title="sign your waiver at aerosports trampoline park"
        >
          <motion.button
            className="bg-[#39FF14] hover:bg-[#2ddb10] shadow-[0_0_20px_#39FF14] px-8 py-3 rounded-full font-bold text-black transition animate-pulse"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Sign Waiver
          </motion.button>
        </Link>
      </div>
    )}
  </div>
</div>

          {/* <div className="location-overlay-box">
            <h1 className="aero-home-h1heading">{item.title}</h1>
            <p>{item.smalltext}</p>

            <p>
              <strong>Phone:</strong>{" "}
              <a
                href={toTelHref(locData.phone)}
                aria-label={`Call AeroSports ${locData.location} at ${locData.phone}`}
                itemProp="telephone"
              >
                {locData.phone}
              </a>
            </p>
            <p>
              <strong>Address:</strong>{" "}
              <a href={locData.gmburl} target="_blank">
                {" "}
                {locData.address}
              </a>
            </p>
            {waiverLink && (
              <div className="aero-btn-booknow">
                <Link
                  href={waiverLink}
                  target="_blank"
                  title="sign your waiver at aerosports trampoline park"
                >
                  <motion.button
                    className="sigma_btn-custom"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    Sign Waiver
                  </motion.button>
                </Link>
              </div>
            )}
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default MotionImage;
