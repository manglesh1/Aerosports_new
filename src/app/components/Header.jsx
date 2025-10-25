"use client";
import "../styles/home.css";
import Link from "next/link";
import { GrLocation } from "react-icons/gr";
import Image from "next/image";
import MenuButton from "./smallComponents/MenuButton";
import TopHeader from "./smallComponents/TopHeader";
import { MdOutlinePermContactCalendar } from "react-icons/md";
import { useState, useEffect } from "react";


const Header = ({ location_slug, menudata, configdata }) => {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide navbar when scrolling down past 50px
      if (currentScrollY > 50) {
        setIsNavbarVisible(false);
      } else {
        // Show navbar when at top of page
        setIsNavbarVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);
 
  const navList =menudata
    .filter((item) => item.isactive === 1) // <-- enable filtering
    .map((item) => ({ navName: item.desc, navUrl: item.path.toLowerCase() }))
    .sort((a, b) => a.navName.localeCompare(b.navName));

  //  console.log('in navList',navList);
  const estoreConfig = Array.isArray(configdata)
    ? configdata.find((item) => item.key === "estorebase")
    : null;
//console.log(estoreConfig);
 // const topHeaderConfig = Array.isArray(configdata)
 //   ? configdata.find((item) => item.key === "top-header")
 //   : null;
  return (
    <header className={`${isNavbarVisible ? 'navbar-visible' : 'navbar-hidden'}`}>


      <section className="d-flex aero-col-3">
        {/* Left: Mobile Menu & Location / Desktop Location & FAQ */}
        <div className="aero-header-left">
          {/* Mobile */}
          <div className="aero-menu-location app-container">
            <div className="d-flex-center aero_menu_location_icon">
              <MenuButton navList={navList} location_slug={location_slug} />
              <Link href="/" className="d-flex-center" prefetch>
                <GrLocation fontSize={30} color="#fff" />
              </Link>
            </div>
          </div>

          {/* Desktop */}
          <div className="desktop-container">
            <div className="aero-menu-location">
              <Link href="/" className="aero-d-changelocation" prefetch>
                <GrLocation />
                {location_slug}
              </Link>
              <Link href={`/${location_slug}/about-us/faq`} prefetch>
                <div className="aero-faq">FAQ&apos;s</div>
              </Link>
            </div>
          </div>
        </div>

        {/* Center: Logo */}
        <div className="aero_main_logo_wrap">
          <Link href={`/${location_slug}`} className="aero_main_logo" prefetch>
            <Image
              src="https://storage.googleapis.com/aerosports/logo_white.png"
              height="71"
              width="71"
              alt="logo"
              title="logo"
              unoptimized
            />
          </Link>
        </div>

        {/* Right: Contact & Book Now */}
        <div className="aero-header-right">
          <Link
            href={`/${location_slug}/contactus`}
            prefetch
            className="aero-header-contactus-btn"
          >
            <MdOutlinePermContactCalendar fontSize={20} />
            <span className="desktop-container">Inquiry Now</span>
            <span className="app-container">Inquiry</span>
          </Link>
          {estoreConfig?.value && (
            <Link href={estoreConfig.value} target="_blank" prefetch>
              <button className="aero-btn-book">
                <span className="desktop-container">Book Now</span>
                <span className="app-container">Book</span>
              </button>
            </Link>
          )}
        </div>
      </section>

      <section
        className="aero_changelocation_height desktop-container"
      >
        <nav className="d-flex-center aero-list-7 aero_changelocation_height">
          {Array.isArray(navList) &&
            navList.map((item) => (
              <Link
                href={`/${location_slug}/${item?.navUrl}`}
                prefetch
                key={item.navName}
              >
                {item.navName}
              </Link>
            ))}
        </nav>
      </section>
    </header>
  );
};

export default Header;
