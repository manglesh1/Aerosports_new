"use client";
import "../styles/home.css";
import Link from "next/link";
import { GrLocation } from "react-icons/gr";
import Image from "next/image";
import MenuButton from "./smallComponents/MenuButton";
import TopHeader from "./smallComponents/TopHeader";
import { MdOutlinePermContactCalendar } from "react-icons/md";


const Header = ({ location_slug, menudata, configdata }) => {
  const navList = (Array.isArray(menudata) ? menudata : [])
    .filter((item) => item.isactive === 1)
    .map((item) => ({ navName: item.desc, navUrl: item.path.toLowerCase() }))
    .sort((a, b) => a.navName.localeCompare(b.navName));

    console.log(configdata.length);
  const estoreConfig = Array.isArray(configdata)
    ? configdata.find((item) => item.key === "estorebase")
    : null;

 // const topHeaderConfig = Array.isArray(configdata)
 //   ? configdata.find((item) => item.key === "top-header")
 //   : null;
  return (
    <header>
      

      <section className="d-flex aero-col-3">
        <div className="aero-menu-location app-container">
          <div className="d-flex-center aero_menu_location_icon">
            <MenuButton navList={navList} location_slug={location_slug} />
            <Link href="/" className="d-flex-center" prefetch>
              <GrLocation fontSize={30} color="#fff" />
            </Link>
          </div>
        </div>

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

        <div className="aero-btn-booknow app-container" style={{ textAlign: "right" }}>
          {estoreConfig?.value && (
            <Link href={estoreConfig.value} target="_blank" prefetch>
              <button>book</button>
            </Link>
          )}
        </div>

        <div className="aero-btn-booknow desktop-container">
          <Link
            href={`/${location_slug}/contactus`}
            prefetch
            className="aero-header-contactus-btn aero-d-changelocation"
            style={{ color: "white" }}
          >
            <MdOutlinePermContactCalendar />
            <span>Inquiry Now</span>
          </Link>
          {estoreConfig?.value && (
            <Link href={estoreConfig.value} target="_blank" prefetch>
              <button>book now</button>
            </Link>
          )}
        </div>
      </section>

      <section className="aero_changelocation_height">
        <nav className="d-flex-center aero-list-7 aero_changelocation_height">
          <div className="desktop-container">
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
          </div>
          <div style={{ position: "relative" }} className="aero-header-changelocation-wrap">
            <Link href="/" prefetch className="aero-app-changelocation app-container">
              {location_slug}
            </Link>
            <Link
              href={`/${location_slug}/contactus`}
              prefetch
              className="aero-header-contactus-btn aero-app-changelocation app-container"
              style={{ marginRight: "0" }}
            >
              <MdOutlinePermContactCalendar />
              <span>Inquiry</span>
            </Link>
          </div>
        </nav>
      </section>
    </header>
  );
};

export default Header;
