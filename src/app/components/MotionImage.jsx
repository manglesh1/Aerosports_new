"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
const MotionImage =  ({ pageData,waiverLink, locationData }) => {
  //console.log(header_image);
  const item = Array.isArray(pageData) && pageData.length > 0 ? pageData[0] : pageData;
  // Handle case when no item exists
  if (!item) return null;

  
const locData = locationData[0];
  const hasVideo = !!item.video;
const toTelHref = (phone) => {
  const digits = (phone || "").replace(/\D/g, "");
  if (!digits) return "tel:";
  // North America: add +1 if missing, keep leading 1 if present
  const e164 = digits.length === 11 && digits.startsWith("1") ? `+${digits}` : `+1${digits}`;
  return `tel:${e164}`;
};
  return (
    <section className="aero_home-headerimg-wrapper">
      {hasVideo ? (
        <section className="aero_home_video-container">
          <video autoPlay muted loop width="100%">
            <source src={item.video} type="video/mp4" />
          </video>
          <article className="image-content">
           
          </article>
          <div className="location-overlay-box">
              <h1 className="aero-home-h1heading">{item.title}</h1>
        <p>{item.smalltext}</p>
       <p>
      <strong aria-hidden="true">📞</strong>{' '}
      <a
        href={toTelHref(locData.phone)}
        aria-label={`Call AeroSports ${locData.location} at ${locData.phone}`}
        itemProp="telephone"
      >
        {locData.phone}
      </a>
    </p>
        <p><strong>📍</strong><a href={locData.gmburl} target="_blank" > {locData.address}</a></p>
         {waiverLink && (
              <div className="aero-btn-booknow">
                <Link href={waiverLink} target="_blank">
                  <motion.button
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    WAIVER
                  </motion.button>
                </Link>
              </div>
            )}
      </div>
        
        </section>
      ) : (
        <div className="aero_home-headerimg-container">
          <div
            className="image-container"
            style={{ maxHeight: "600px", minHeight: "450px" }}
          >
            <Image
              src={item.headerimage || 'https://storage.googleapis.com/aerosports/aerosports-trampoline-park-redefine-fun.svg'} // Ensure `item.image` has valid URL
              alt={item.headerimagetitle || "Aerosports fun for everyone"}
              layout="fill"
              objectFit="cover"
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
            >

            </motion.article>
        <div className="location-overlay-box">
            <h1 className="aero-home-h1heading">{item.title}</h1>
        <p>{item.smalltext}</p>
           
        <p>
      <strong aria-hidden="true">📞</strong>{' '}
      <a
        href={toTelHref(locData.phone)}
        aria-label={`Call AeroSports ${locData.location} at ${locData.phone}`}
        itemProp="telephone"
      >
        {locData.phone}
      </a>
    </p>
        <p><strong>📍</strong><a href={locData.gmburl} target="_blank" > {locData.address}</a></p>
         {waiverLink && (
              <div className="aero-btn-booknow">
                <Link href={waiverLink} target="_blank"  title="sign your waiver at aerosports trampoline park" >
                  <motion.button
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    WAIVER
                  </motion.button>
                </Link>
              </div>
            )}
          </div>
          </div>
        </div>

      )}
    </section>
  );
};

export default MotionImage;
