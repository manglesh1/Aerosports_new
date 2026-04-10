'use client';

import { useEffect, useState } from "react";
import "../styles/home.css";
import Link from "next/link";
import { getDataByParentId } from "@/utils/customFunctions";
import RatingComponent from "./smallComponents/RatingComponent";
import Script from "next/script";


const Footer = ({ location_slug, configdata, menudata, reviewdata, locationData }) => {

  if (!configdata?.length || !menudata?.length) return null;

  const {
    facebook,
    insta,
    twitter,
    tiktok,
    chatid,
    phone,
    address,
    location,
    gmburl,
    rollerurl,
    hours,
    email,
  } = locationData[0] || {};

  const attractionsData = getDataByParentId(menudata, "attractions");
  const programsData = getDataByParentId(menudata, "programs");
  const groupsData = getDataByParentId(menudata, "groups-events");
  const companyData = getDataByParentId(menudata, "aboutus");
  const birthDaypartyData = getDataByParentId(menudata, "kids-birthday-parties");
  const galleryData = getDataByParentId(menudata, "gallery");

  const estoreConfig = Array.isArray(configdata)
    ? configdata.find((item) => item.key === "estorebase")
    : null;

  const toTelHref = (ph) => {
    const digits = (ph || "").replace(/\D/g, "");
    return `tel:+1${digits}`;
  };

  let locationHours = [];
  if (typeof hours === 'string' && hours.trim()) {
    try {
      // Fix trailing commas before ] that can creep in from sheet edits
      const cleaned = hours.replace(/,\s*]/g, ']');
      locationHours = JSON.parse(cleaned);
    } catch (e) {
      locationHours = [];
    }
  } else if (Array.isArray(hours)) {
    locationHours = hours;
  }
  return (
    <footer className="aero_footer_section-bg">
      {/* Quick Links Section - V11 Light Theme */}
      <section className="v11_footer_quicklinks">
        <div className="v11_footer_quicklinks_grid">
          {[
            { icon: "/assets/images/home/event_icon.svg", text: "Birthday Parties", url: `/${location_slug}/kids-birthday-parties` },
            { icon: "/assets/images/home/park_feature_icon.svg", text: "Gallery", url: `/${location_slug}/${galleryData?.[0]?.path || 'gallery'}` },
            { icon: "/assets/images/home/jump_icon.svg", text: "Group Events", url: `/${location_slug}/${groupsData?.[0]?.path || 'groups-events'}` },
          ].map((item, index) => (
            <Link href={item.url} key={index} className="v11_footer_quicklink_card">
              <div className="v11_footer_quicklink_icon">
                <img src={item.icon} width={48} height={48} alt={item.text} loading="lazy" />
              </div>
              <span className="v11_footer_quicklink_text">{item.text}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="aero-max-container">
        {/* Modern Footer Content */}
        <div className="aero_footer_modern_wrapper">

          {/* LEFT COLUMN: Contact Info + Hours */}
          <div className="aero_footer_contact_section">
            <div className="aero_footer_brand_header">
              <Link href={`/${location_slug}`} prefetch className="aero_footer_logo">
                <img
                  src={`https://storage.googleapis.com/aerosports/webp/${location_slug}/logo_white.webp`}
                  alt="AeroSports Logo"
                  width={50}
                  height={50}
                  loading="lazy"
                />
              </Link>
              <div>
                <h3 className="aero_footer_brand_name">AeroSports</h3>
                <p className="aero_footer_brand_sub">Trampoline Park &middot; {location || "Oakville"}</p>
              </div>
            </div>

            <p className="aero_footer_tagline">
              {location ? `${location}'s` : "Oakville's"} premier indoor trampoline park &mdash; wall-to-wall fun, cinematic motion design, and unforgettable celebrations for the whole family.
            </p>

            {/* Contact Details */}
            <div className="aero_footer_contact_details">
              {phone && (
                <a href={toTelHref(phone)} className="aero_footer_contact_item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="aero_footer_contact_icon">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <span>{phone}</span>
                </a>
              )}
              <a href={`mailto:${email}`} className="aero_footer_contact_item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="aero_footer_contact_icon">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <span>{email}</span>
              </a>
              {address && (
                <a href={gmburl || '#'} target="_blank" rel="noopener noreferrer" className="aero_footer_contact_item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="aero_footer_contact_icon">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>{address}</span>
                </a>
              )}
            </div>

            {/* Social Icons */}
            <div className="aero_footer_social_icons">
              {facebook && (
                <Link href={`https://www.facebook.com/${facebook}`} target="_blank" prefetch className="aero_footer_social_link" aria-label={`Follow AeroSports ${location_slug} on Facebook`}>
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </Link>
              )}
              {insta && (
                <Link href={`https://www.instagram.com/${insta}`} target="_blank" prefetch className="aero_footer_social_link" aria-label={`Follow AeroSports ${location_slug} on Instagram`}>
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </Link>
              )}
              {tiktok && (
                <Link href={`https://www.tiktok.com/${tiktok}`} target="_blank" prefetch className="aero_footer_social_link" aria-label={`Follow AeroSports ${location_slug} on TikTok`}>
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                </Link>
              )}
            </div>

            {/* Park Hours */}
          
 {locationHours && locationHours.length > 0 && ( 
              <div className="aero_footer_hours">
                <h4 className="aero_footer_hours_title">Park Hours</h4>
                <div className="aero_footer_hours_grid">
                  {locationHours.map((item, i) => (
                    <div className="aero_footer_hours_row" key={i}>
                      <span className="aero_footer_hours_day">{item.days}</span>
                      <span className="aero_footer_hours_time">{item.hours}</span>
                    </div>
                  ))}
                </div>
                <p className="aero_footer_parking">Free parking available on site</p>
              </div>
            )}
          </div> 

          {/* MIDDLE COLUMNS: Navigation Links */}
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
              <h3 className="aero_footer_column_title">Parties & Events</h3>
              <ul className="aero_footer_links_list">
                {birthDaypartyData?.[0]?.children?.map((item, i) => (
                  <li key={i}>
                    <Link href={`/${location_slug}/${item?.parentid}/${item?.path}`} prefetch>
                      {item?.desc}
                    </Link>
                  </li>
                ))}
                {groupsData?.[0]?.children?.map((item, i) => (
                  <li key={`g-${i}`}>
                    <Link href={`/${location_slug}/${item?.parentid}/${item?.path}`} prefetch>
                      {item?.desc}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="aero_footer_links_column">
              <h3 className="aero_footer_column_title">Quick Links</h3>
              <ul className="aero_footer_links_list">
                {companyData?.[0]?.children?.filter(item => item?.isactive == 1).map((item, i) => (
                  <li key={i}>
                    <Link href={`/${location_slug}/${item?.parentid}/${item?.path}`} prefetch>
                      {item?.desc}
                    </Link>
                  </li>
                ))}
                {programsData?.[0]?.children?.map((item, i) => (
                  <li key={`p-${i}`}>
                    <Link href={`/${location_slug}/${item?.parentid}/${item?.path}`} prefetch>
                      {item?.desc}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: Book a Party CTA */}
          <div className="aero_footer_cta_section">
            <h3 className="aero_footer_cta_title">Book a Party</h3>
            <p className="aero_footer_cta_text">
              Ready to book the most unforgettable birthday in {location || "town"}? Our team is just a call away.
            </p>

            {phone && (
              <a href={toTelHref(phone)} className="aero_footer_cta_button aero_footer_cta_phone">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                {phone}
              </a>
            )}

            <a href={`mailto:info@aerosports.ca`} className="aero_footer_cta_button aero_footer_cta_email">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              Email Us
            </a>

            {estoreConfig?.value && (
              <Link href={`${estoreConfig.value}`} className="aero_footer_cta_button aero_footer_cta_book">
                Book Now
              </Link>
            )}
          </div>

        </div>

        {/* Other Locations */}
        <div className="aero_footer_locations">
          <h4 className="aero_footer_locations_title">Visit Our Other Locations</h4>
          <div className="aero_footer_locations_list">
            {[
              { slug: 'oakville', name: 'Oakville' },
              { slug: 'london', name: 'London' },
              { slug: 'windsor', name: 'Windsor' },
              { slug: 'st-catharines', name: 'St. Catharines' },
              { slug: 'scarborough', name: 'Scarborough' },
            ]
              .filter((loc) => loc.slug !== location_slug)
              .map((loc) => (
                <Link key={loc.slug} href={`/${loc.slug}`} className="aero_footer_location_link">
                  AeroSports {loc.name}
                </Link>
              ))}
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
