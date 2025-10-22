'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import "../styles/home.css";
import event_icon from "@public/assets/images/home/event_icon.svg";
import park_feature_icon from "@public/assets/images/home/park_feature_icon.svg";
import jump_icon from "@public/assets/images/home/jump_icon.svg";
import Link from "next/link";
import { getDataByParentId } from "@/utils/customFunctions";
import RatingComponent from "./smallComponents/RatingComponent";
import Script from "next/script";


const Footer = ({ location_slug, configdata, menudata, reviewdata,locationData }) => {



  if (!configdata?.length || !menudata?.length) return null;

  const {
    facebook,
    insta,
    twitter,
    tiktok,
    chatid,
  } = locationData[0] || {};

  const attractionsData = getDataByParentId(menudata, "attractions");
  const programsData = getDataByParentId(menudata, "programs");
  const groupsData = getDataByParentId(menudata, "groups-events");
  const companyData = getDataByParentId(menudata, "aboutus");
  const birthDaypartyData = getDataByParentId(menudata, "kids-birthday-parties");

  return (
    <footer className="aero_footer_section-bg">
      {/* Hero Section with Quick Links */}
      <section className="aero_home-headerimg-wrapper">
        <Image
          src="https://storage.googleapis.com/aerosports/windsor-new/kids-activity-glow-in-the-dark.webp"
          alt="Glow Night Event"
          width={1200}
          height={600}
          title="Glow Night Event"
          unoptimized
        />
        <article className="aero-max-container aero_home_BPJ_wrapper">
          {[
            { icon: event_icon, text: "Birthday Parties", url:`/${location_slug}/${birthDaypartyData?.[0]?.path}`  },
            { icon: park_feature_icon, text: "Park Features", url:`/${location_slug}/${attractionsData?.[0]?.path}` },
            { icon: jump_icon, text: "Group Events" , url:`/${location_slug}/${groupsData?.[0]?.path}`},
          ].map((item, index) => (
            <div className="d-flex-center" key={index}>
              <Link href={item.url}><Image src={item.icon} width={90} height={80} alt={item.text} unoptimized /></Link>
              <span>{item.text}</span>
            </div>
          ))}
        </article>
      </section>

      <section className="aero-max-container">
        {/* Rating */}
        {reviewdata && <RatingComponent ratingdata={reviewdata} />}

        {/* Modern Footer Content */}
        <div className="aero_footer_modern_wrapper">
          {/* Logo and Social Section */}
          <div className="aero_footer_brand_section">
            <Link href={`/${location_slug}`} prefetch className="aero_footer_logo">
              <Image
                src="https://storage.googleapis.com/aerosports/logo_white.png"
                alt="AeroSports Logo"
                width={120}
                height={112}
                unoptimized
              />
            </Link>
            <p className="aero_footer_tagline">
              Jump into fun! Experience the ultimate indoor trampoline park adventure.
            </p>
            <div className="aero_footer_social_icons">
              {facebook && (
                <Link
                  href={`https://www.facebook.com/${facebook}`}
                  target="_blank"
                  prefetch
                  className="aero_footer_social_link"
                  aria-label={`Follow AeroSports ${location_slug} on Facebook`}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </Link>
              )}
              {twitter && (
                <Link
                  href={`https://x.com/${twitter}`}
                  target="_blank"
                  prefetch
                  className="aero_footer_social_link"
                  aria-label={`Follow AeroSports ${location_slug} on X`}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </Link>
              )}
              {insta && (
                <Link
                  href={`https://www.instagram.com/${insta}`}
                  target="_blank"
                  prefetch
                  className="aero_footer_social_link"
                  aria-label={`Follow AeroSports ${location_slug} on Instagram`}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </Link>
              )}
              {tiktok && (
                <Link
                  href={`https://www.tiktok.com/${tiktok}`}
                  target="_blank"
                  prefetch
                  className="aero_footer_social_link"
                  aria-label={`Follow AeroSports ${location_slug} on TikTok`}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </Link>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="aero_footer_links_section">
            <div className="aero_footer_links_column">
              <h3 className="aero_footer_column_title">Attractions</h3>
              <ul className="aero_footer_links_list">
                {attractionsData?.[0]?.children?.map((item, i) => (
                  <li key={i}>
                    <Link href={`/${location_slug}/${item?.parentid}/${item?.path}`} prefetch>
                      {item?.desc}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="aero_footer_links_column">
              <h3 className="aero_footer_column_title">Programs</h3>
              <ul className="aero_footer_links_list">
                {programsData?.[0]?.children?.map((item, i) => (
                  <li key={i}>
                    <Link href={`/${location_slug}/${item?.parentid}/${item?.path}`} prefetch>
                      {item?.desc}
                    </Link>
                  </li>
                ))}
              </ul>
              {companyData?.[0]?.children?.length > 0 && (
                <>
                  <h3 className="aero_footer_column_title" style={{marginTop: '2em'}}>Company</h3>
                  <ul className="aero_footer_links_list">
                    {companyData[0].children.map((item, i) => (
                      item?.isactive == 1 && (
                        <li key={i}>
                          <Link href={`/${location_slug}/${item?.parentid}/${item?.path}`} prefetch>
                            {item?.desc}
                          </Link>
                        </li>
                      )
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div className="aero_footer_links_column">
              <h3 className="aero_footer_column_title">Groups & Events</h3>
              <ul className="aero_footer_links_list">
                {groupsData?.[0]?.children?.map((item, i) => (
                  <li key={i}>
                    <Link href={`/${location_slug}/${item?.parentid}/${item?.path}`} prefetch>
                      {item?.desc}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="aero_footer_copyright">
          <p>&copy; {new Date().getFullYear()} AeroSports Trampoline Park. All rights reserved.</p>
        </div>
      </section>

      {/* Chat Script */}
      {chatid && (
        <Script
          src="https://widgets.leadconnectorhq.com/loader.js"
          data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
          data-widget-id={chatid}
          strategy="afterInteractive"
        />
      )}
    </footer>
  );
};

export default Footer;
