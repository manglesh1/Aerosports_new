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
          return item?.video ? (
            <section className="aero_home_video-container" key={i}>
              <video autoPlay muted loop width="100%">
                <source src={item?.video} type="video/mp4" />
              </video>
              <article className="image-content">
             
                <div className="aero-btn-booknow">
                  <Link href={waiver[0].value} target="_blank">
                    <motion.button
                      animate={{
                        scale: [1, 1.2, 1.5, 1.2, 1],
                        borderRadius: ["12px", "30px", "60px", "30px", "12px"],
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
              </article>
              <h1>{item.title}</h1>
            </section>
            
          ) : (
            <motion.div
              key={i}
              className="image-container"
              initial={{ scale: 1 }}
              animate={{ scale: 1.1 }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{maxHeight:'600px', minHeight:"450px"}}
            >
           {/****   <Image                src={item?.headerimage}                alt="header - image"                width={1200}                height={600}                title="header image for more info about the image"                className="header-image" />**/}

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
                <p dangerouslySetInnerHTML={{ __html: item.smalltext }} />
                <div className="aero-btn-booknow">
                  <Link href={waiver[0].value} target="_blank">
                    <motion.button
                      animate={{
                        scale: [1, 1.2, 1.5, 1.2, 1],
                        borderRadius: ["12px", "30px", "60px", "30px", "12px"],
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
