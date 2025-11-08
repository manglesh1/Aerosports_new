"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { IoMenu, IoClose } from "react-icons/io5";

const MenuButton = ({ navList, location_slug }) => {
  const [mobile_nav, setMobile_nav] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobile_nav(false);
      }
    };

    if (mobile_nav) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [mobile_nav]);

  return (
    <div ref={menuRef}>
      {mobile_nav ? (
        <IoClose
          fontSize={40}
          color="#fff"
          onClick={() => setMobile_nav(false)}
          style={{ cursor: "pointer" }}
        />
      ) : (
        <IoMenu
          fontSize={40}
          color="#fff"
          onClick={() => setMobile_nav(true)}
          style={{ cursor: "pointer" }}
        />
      )}
      {mobile_nav && (
        <nav className="d-flex-center aero-list-7-1">
          {navList &&
            navList.map((item) => {
              return (
                <Link
                  href={`/${location_slug}/${item?.navUrl}`}
                  key={item.navName}
                  className="aero-app-changelocation"
                  onClick={() => setMobile_nav(false)}
                  prefetch
                >
                  {item.navName}
                </Link>
              );
            })}
          <Link
            href={`/${location_slug}/pricing-promos`}
            key="pricing-promos"
            className="aero-app-changelocation"
            onClick={() => setMobile_nav(false)}
            prefetch
          >
            Pricing & Promos
          </Link>
          <Link
            href={`/${location_slug}/gallery`}
            key="gallery"
            className="aero-app-changelocation"
            onClick={() => setMobile_nav(false)}
            prefetch
          >
            Gallery
          </Link>
        </nav>
      )}
    </div>
  );
};

export default MenuButton;
