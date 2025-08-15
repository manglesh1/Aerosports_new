"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
const MotionImage = async ({ pageData,waiverLink, locationData }) => {
  //console.log(header_image);
  const item = Array.isArray(pageData) && pageData.length > 0 ? pageData[0] : pageData;
  // Handle case when no item exists
  if (!item) return null;

  console.log('locationData',locationData)
const locData = locationData[0];
  const hasVideo = !!item.video;

  return (
    <section className="aero_home-headerimg-wrapper">
      {hasVideo ? (
        <section className="aero_home_video-container">
          <video autoPlay muted loop width="100%">
            <source src={item.video} type="video/mp4" />
          </video>
          <article className="image-content">
           
          </article>
          <div class="location-overlay-box">
              <h1 className="aero-home-h1heading">{item.title}</h1>
        <h2>AeroSports {locData.location}</h2>
        <p><strong>📞</strong>{locData.phone}</p>
        <p><strong>📍</strong> {locData.address}</p>
         {waiverLink && (
              <div className="aero-btn-booknow">
                <Link href={waiverLink} target="_blank">
                  <motion.button
                 
                    transition={{
                      duration: 5,
                      repeat: Infinity,
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
        <motion.div
          className="image-container"
          initial={{ scale: 1 }}
          animate={{ scale: 1.1 }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{ maxHeight: "600px", minHeight: "450px" }}
        >
           <Image
            src={item.headerimage || 'https://storage.googleapis.com/aerosports/aerosports-trampoline-park-redefine-fun.svg'} // Ensure `item.image` has valid URL
            alt={item.imagetitle || "Aerosports fun for everyone"}
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
              duration: 3,
            }}
          >
          
          </motion.article>
        <div class="location-overlay-box">
            <h1>{item.title}</h1>
            <p dangerouslySetInnerHTML={{ __html: item.smalltext }} />
           
       <h2>AeroSports {locData.location}</h2>
        <p><strong>📞</strong>{locData.phone}</p>
        <p><strong>📍</strong> {locData.address}</p>
         {waiverLink && (
              <div className="aero-btn-booknow">
                <Link href={waiverLink} target="_blank"  title="sign your waiver at aerosports trampoline park" >
                  <motion.button
                   
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                    }}
                  >
                    WAIVER
                  </motion.button>
                </Link>
              </div>
            )}
      </div>
        </motion.div>
        
      )}
    </section>
  );
};

export default MotionImage;
