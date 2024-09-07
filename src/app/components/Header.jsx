"use client";

import "../styles/home.css";
import Link from "next/link";
import { GrLocation } from "react-icons/gr";
import { IoMenu } from "react-icons/io5";
import { useState } from "react";
import Image from "next/image";

const navList = [
  {
    id: 1,
    nav: "ATTRACTIONS",
    slug: "attractions",
  },
  {
    id: 2,
    nav: "PROGRAMS",
    slug: "programs",
  },
  {
    id: 3,
    nav: "BIRTHDAY PARTIES",
    slug: "kids-birthday-parties",
  },
  {
    id: 4,
    nav: "GROUPS & EVENTS",
    slug: "groups-events",
  },
  {
    id: 5,
    nav: "ABOUT US",
    slug: "aboutus",
  },
  {
    id: 6,
    nav: "PRICING+PROMOS",
    slug: "pricing-promos",
  },
  {
    id: 7,
    nav: "MEMBERSHIPS",
    slug: "membership",
  },
];

const Header = ({ location_slug }) => {
  const [mobile_nav, setMobile_nav] = useState(false);

  return (
    <header>
      <section className="d-flex aero-col-3">
        <div className="aero-menu-location app-container">
          <div className="d-flex-center aero_menu_location_icon">
            <IoMenu
              fontSize={40}
              color="#fff"
              onClick={() => setMobile_nav(!mobile_nav)}
            />
            <Link href="/">
              <GrLocation fontSize={30} color="#fff" />
            </Link>
          </div>
        </div>
        <div className="desktop-container">
          <div className="aero-menu-location">
            <Link href="/" className="aero-d-changelocation">
              <GrLocation />
              {location_slug}
            </Link>
            <div className="aero-faq">fag</div>
          </div>
        </div>
        <div>
          <Link href={`/${location_slug}`}>
            <Image
              src="https://www.aerosportsparks.ca/assets/image/logo/logo_white.png"
              height="71"
              width="71"
              alt="logo"
              title="logo"
            />
          </Link>
        </div>
        <div
          className="aero-btn-booknow app-container"
          style={{ textAlign: "right" }}
        >
          <button>book</button>
        </div>
        <div className="aero-btn-booknow desktop-container">
          <button>book now</button>
        </div>
      </section>
      <section className="aero_changelocation_height">
        <nav className="d-flex-center aero-list-7 aero_changelocation_height">
          <div className="desktop-container">
            {navList &&
              navList.map((item) => {
                return (
                  <Link href={`/${location_slug}/${item?.slug}`} key={item.id}>
                    {item.nav}
                  </Link>
                );
              })}
          </div>
          <div style={{ position: "relative" }}>
            <Link href="/" className="aero-app-changelocation app-container">
              Change location
            </Link>
            {mobile_nav && (
              <nav className="d-flex-center aero-list-7">
                {navList &&
                  navList.map((item) => {
                    return (
                      <Link
                        href={`/${location_slug}/${item?.slug}`}
                        key={item.id}
                        className="aero-app-changelocation"
                      >
                        {item.nav}
                      </Link>
                    );
                  })}
              </nav>
            )}
          </div>
        </nav>
      </section>
    </header>
  );
};

export default Header;
