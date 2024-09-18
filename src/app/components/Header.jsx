
import "../styles/home.css";
import Link from "next/link";
import { GrLocation } from "react-icons/gr";
import Image from "next/image";
import { fetchData } from "@/utils/fetchData";
import MenuButton from "./smallComponents/MenuButton";

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
  {
    id: 7,
    nav: "BOGO OFFER",
    slug: "bogo",
  },
];

const Header = async({ location_slug }) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [data, dataconfig] = await Promise.all([
    fetchData(`${API_URL}/fetchmenudata?location=${location_slug}`),
    fetchData(
      `${API_URL}/fetchsheetdata?sheetname=config&location=${location_slug}`
    ),
  ]);

  const booknow = dataconfig?.filter((item) => item.key === "estorebase");
  return (
    <header>
      <section className="d-flex aero-col-3">
        <div className="aero-menu-location app-container">
          <div className="d-flex-center aero_menu_location_icon">
           <MenuButton navList={navList} location_slug={location_slug}/>
            <Link href="/" className="d-flex-center">
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
          <Link href={booknow[0]?.value} target="_blank">
            <button>book</button>
          </Link>
        </div>
        <div className="aero-btn-booknow desktop-container">
          <Link href={booknow[0]?.value} target="_blank">
            {" "}
            <button>book now</button>
          </Link>
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
              {location_slug}
            </Link>
     
          </div>
        </nav>
      </section>
    </header>
  );
};

export default Header;
