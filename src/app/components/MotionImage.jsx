"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const MotionImage = ({ header_image, waiver }) => {
  return (
    <section className="aero_home-headerimg-wrapper">
      {header_image &&
        header_image.map((item, i) => {
          return (
            <motion.div
              key={i}
              className="image-container"
              initial={{ scale: 1 }}
              animate={{ scale: 1.1 }} // Slowly zoom the image like a video
              transition={{
                duration: 5, // Long animation to mimic video-like motion
                repeat: Infinity, // Loop the animation
                repeatType: "reverse", // Reverse the zoom effect for continuous motion
              }}
            >
              <Image
                src={item.headerimage}
                alt="header - image"
                width={1200}
                height={600}
                title="header image for more info about the image"
                className="header-image"
              />

              <motion.article
                className="image-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 3,
                  delay: 1,
                }}
              >
                <h1>{item.title}</h1>
                <p>{item.smalltext}</p>
                <div className="aero-btn-booknow">
                  <Link href={waiver[0].value}>
                    <motion.button
                      animate={{
                        scale: [1, 1.2, 1.5, 1.2, 1],
                        borderRadius: ["12px", "30px", "50%", "30px", "12px"],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                      }}
                    >
                      WAIVER
                    </motion.button>
                  </Link>
                </div>
              </motion.article>
            </motion.div>
          );
        })}
    </section>
  );
};

export default MotionImage;