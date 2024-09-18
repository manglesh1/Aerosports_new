"use client";

import Link from "next/link";
import React, { useState } from "react";
import { IoMenu } from "react-icons/io5";

const MenuButton = ({ navList, location_slug }) => {
  const [mobile_nav, setMobile_nav] = useState(false);

  return (
    <>
      <IoMenu
        fontSize={40}
        color="#fff"
        onClick={() => setMobile_nav(!mobile_nav)}
      />
      {mobile_nav && (
        <nav className="d-flex-center aero-list-7">
          {navList &&
            navList.map((item) => {
              return (
                <Link
                  href={`/${location_slug}/${item?.slug}`}
                  key={item.id}
                  className="aero-app-changelocation"
                  onClick={() => setMobile_nav(!mobile_nav)}
                >
                  {item.nav}
                </Link>
              );
            })}
        </nav>
      )}
    </>
  );
};

export default MenuButton;
