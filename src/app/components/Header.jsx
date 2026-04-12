"use client";
import "../styles/header-v11.css";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const Header = ({ location_slug, menudata, configdata, pricingData, locationData, promotions }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const locationDropRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Nav order matching V11 prototype
  const navOrder = ['Attractions', 'Programs', 'Birthday Parties', 'Groups & Events', 'About Us', 'Pricing & Promos'];

  // Items that have dropdown submenus
  const dropdownItems = ['Attractions', 'Programs', 'Groups & Events'];

  // Build nav list from menudata — only show items in the V11 nav order
  const allNavItems = (Array.isArray(menudata) ? menudata : [])
    .filter((item) => item.isactive === 1)
    .map((item) => ({
      navName: item.desc,
      navUrl: item.path.toLowerCase(),
      children: item.children || [],
    }));

  // Filter and sort to match V11 prototype nav order.
  // Tolerate slight mismatches between sheet desc and nav name
  // (e.g. "Pricing + Promos" in sheet vs "Pricing & Promos" here).
  const normalize = (s) => s.toLowerCase().replace(/[+&]/g, "").replace(/\s+/g, " ").trim();
  const navList = navOrder
    .map((name) => allNavItems.find((item) => normalize(item.navName) === normalize(name)))
    .filter(Boolean);

  // If "Pricing & Promos" isn't in menu data, add it manually
  if (!navList.find((item) => normalize(item.navName) === normalize('Pricing & Promos'))) {
    navList.push({ navName: 'Pricing & Promos', navUrl: 'pricing-promos', children: [] });
  }

  const estoreConfig = Array.isArray(configdata)
    ? configdata.find((item) => item.key === "estorebase")
    : null;

  const locData = Array.isArray(locationData) && locationData.length > 0
    ? locationData[0]
    : null;

  // Capitalize location name properly
  const rawName = locData?.location || location_slug || '';
  const locationName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const phone = locData?.phone || '';
  const address = locData?.address || '';
  const gmbUrl = locData?.gmburl || '#';
  const facebookUrl = locData?.facebook ? `https://www.facebook.com/${locData.facebook}` : '#';
  const instaUrl = locData?.insta ? `https://www.instagram.com/${locData.insta}` : '#';
  const tiktokUrl = locData?.tiktok ? `https://www.tiktok.com/@${locData.tiktok}` : '#';

  // Filter promotions that have a title (skip empty rows)
  const activePromos = Array.isArray(promotions)
    ? promotions.filter((p) => p.title && p.title.trim())
    : [];

  // All locations for the dropdown
  const allLocations = [
    { slug: 'oakville', name: 'Oakville, ON' },
    { slug: 'london', name: 'London, ON' },
    { slug: 'windsor', name: 'Windsor, ON' },
    { slug: 'st-catharines', name: 'St. Catharines, ON' },
    { slug: 'scarborough', name: 'Scarborough, ON' },
  ];

  const toTelHref = (phoneStr) => {
    const digits = (phoneStr || '').replace(/\D/g, '');
    if (!digits) return 'tel:';
    const e164 = digits.length === 11 && digits.startsWith('1') ? `+${digits}` : `+1${digits}`;
    return `tel:${e164}`;
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (locationDropRef.current && !locationDropRef.current.contains(e.target)) {
        setLocationDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = '';
    }
    return () => { document.body.style.overflowY = ''; };
  }, [mobileMenuOpen]);

  // Get promo config for announcement bar
  const promoConfig = Array.isArray(configdata)
    ? configdata.find((item) => item.key === "promotion-popup")
    : null;

  return (
    <header className="v11_header">

      {/* ===== TOP UTILITY BAR (Desktop Only) ===== */}
      <div className="v11_header_utility">
        <div className="v11_header_utility_inner">
          <div className="v11_header_utility_left">
            {address && (
              <a href={gmbUrl} target="_blank" rel="noopener noreferrer" className="v11_header_utility_item">
                <svg className="v11_header_utility_icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {address}
              </a>
            )}
            <span className="v11_header_utility_item">
              <svg className="v11_header_utility_icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Open Today
            </span>
          </div>

          <div className="v11_header_utility_right">
            {phone && (
              <a href={toTelHref(phone)} className="v11_header_utility_phone">
                <svg className="v11_header_utility_icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                {phone}
              </a>
            )}
            <div className="v11_header_social_icons">
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="v11_header_social_link" title="Facebook">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href={instaUrl} target="_blank" rel="noopener noreferrer" className="v11_header_social_link" title="Instagram">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                </svg>
              </a>
              <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className="v11_header_social_link" title="TikTok">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN DESKTOP NAV ===== */}
      <div className="v11_header_main_nav">
        {/* Logo in orange panel */}
        <Link href={`/${location_slug}`} className="v11_header_logo_panel" prefetch>
          <img
            src={`https://storage.googleapis.com/aerosports/webp/${location_slug}/logo_white.webp`}
            height={56}
            width={56}
            alt="AeroSports Logo"
            title="AeroSports Trampoline Park"
            fetchPriority="high"
            className="v11_header_logo_img"
          />
        </Link>

        {/* Nav links */}
        <nav className="v11_header_nav_links">
          {navList.map((item) => {
            const hasDropdown = dropdownItems.includes(item.navName) && item.children && item.children.length > 0;
            const isActive = false; // Will be determined by current path

            if (hasDropdown) {
              return (
                <div
                  key={item.navName}
                  className="v11_header_nav_dropdown"
                  onMouseEnter={() => setOpenDropdown(item.navName)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={`/${location_slug}/${item.navUrl}`}
                    prefetch
                    className={`v11_header_nav_link ${isActive ? 'v11_header_nav_active' : ''}`}
                  >
                    {item.navName}
                    <svg className="v11_header_chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>
                  {openDropdown === item.navName && (
                    <div className="v11_header_dropdown_menu">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          href={`/${location_slug}/${child.path.toLowerCase()}`}
                          prefetch
                          className="v11_header_dropdown_link"
                        >
                          {child.desc}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.navName}
                href={`/${location_slug}/${item.navUrl}`}
                prefetch
                className={`v11_header_nav_link ${isActive ? 'v11_header_nav_active' : ''}`}
              >
                {item.navName}
              </Link>
            );
          })}
        </nav>

        {/* Right section: Location info + Change + Book CTA */}
        <div className="v11_header_right_section">
          {/* Location info pill */}
          <div className="v11_header_location_pill">
            <div className="v11_header_location_dot">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="v11_header_location_name">{locationName}, ON</p>
              <p className="v11_header_location_hours">Open Today</p>
            </div>
          </div>

          {/* Change Location */}
          <div className="v11_header_change_location" ref={locationDropRef}>
            <button
              className="v11_header_change_btn"
              onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="v11_header_change_icon">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <div>
                <p className="v11_header_change_label">Change</p>
                <p className="v11_header_change_sub">Location</p>
              </div>
            </button>

            {locationDropdownOpen && (
              <div className="v11_header_location_dropdown">
                <div className="v11_header_location_dropdown_header">
                  <p>Select a Location</p>
                </div>
                <div className="v11_header_location_dropdown_list">
                  {allLocations.map((loc) => {
                    const isCurrent = loc.slug === location_slug;
                    return (
                      <Link
                        key={loc.slug}
                        href={`/${loc.slug}`}
                        prefetch
                        className={`v11_header_location_dropdown_item ${isCurrent ? 'v11_header_location_current' : ''}`}
                        onClick={() => setLocationDropdownOpen(false)}
                      >
                        <div className={`v11_header_location_dropdown_dot ${isCurrent ? 'active' : ''}`}>
                          <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="v11_header_location_dropdown_info">
                          <p className="v11_header_location_dropdown_name">{loc.name}</p>
                        </div>
                        {isCurrent && (
                          <span className="v11_header_location_current_badge">Current</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Book CTA */}
          {estoreConfig?.value && (
            <Link
              href={estoreConfig.value}
              target="_blank"
              className="v11_header_book_cta"
            >
              Book a Party &rarr;
            </Link>
          )}
        </div>
      </div>

      {/* ===== MOBILE HEADER ===== */}
      <div className="v11_header_mobile">
        <div className="v11_header_mobile_bar">
          <Link href={`/${location_slug}`} className="v11_header_mobile_logo" prefetch>
            <div className="v11_header_mobile_logo_box">A</div>
            <span className="v11_header_mobile_brand">AeroSports</span>
          </Link>

          <div className="v11_header_mobile_actions">
            <span className="v11_header_mobile_location">{locationName}, ON</span>
            {estoreConfig?.value && (
              <Link href={estoreConfig.value} target="_blank" className="v11_header_mobile_book_btn">
                Book
              </Link>
            )}
            <button
              className="v11_header_mobile_hamburger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <svg width="20" height="20" fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <>
                  <span className="v11_hamburger_line" />
                  <span className="v11_hamburger_line" />
                  <span className="v11_hamburger_line v11_hamburger_short" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="v11_header_mobile_menu" ref={mobileMenuRef}>
            <nav className="v11_header_mobile_nav">
              {navList.map((item) => (
                <Link
                  key={item.navName}
                  href={`/${location_slug}/${item.navUrl}`}
                  prefetch
                  className="v11_header_mobile_nav_link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.navName}
                </Link>
              ))}
            </nav>
            <div className="v11_header_mobile_footer">
              <div className="v11_header_mobile_info">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#c8ff00', flexShrink: 0 }}>
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>{address || `${locationName} Location`}</span>
              </div>
              {phone && (
                <a href={toTelHref(phone)} className="v11_header_mobile_phone_btn">
                  {phone}
                </a>
              )}
              {estoreConfig?.value && (
                <Link
                  href={estoreConfig.value}
                  target="_blank"
                  className="v11_header_mobile_book_full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Book Your Party &rarr;
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ===== ANNOUNCEMENT / PROMO BAR ===== */}
      {activePromos.length > 0 && (
        <div className="v11_header_promo_bar">
          <div className="v11_header_promo_inner">
            <span className="v11_header_promo_text">
              {activePromos[0].title}
            </span>
            {activePromos[0].code && (
              <>
                <span className="v11_header_promo_divider">|</span>
                <span className="v11_header_promo_code_label">Code:</span>
                <span className="v11_header_promo_code">{activePromos[0].code}</span>
              </>
            )}
            {activePromos[0].validity && (
              <span className="v11_header_promo_terms">{activePromos[0].validity.replace(/\n/g, ' · ')}</span>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
