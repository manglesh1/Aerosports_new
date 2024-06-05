import Link from "next/link";
import "../styles/header.css";

const navList = [
  {
    id: 1,
    nav: "ATTRACTIONS",
  },
  {
    id: 2,
    nav: "PROGRAMS",
  },
  {
    id: 3,
    nav: "BIRTHDAY PARTIES",
  },
  {
    id: 4,
    nav: "GROUPS & EVENTS",
  },
  {
    id: 5,
    nav: "ABOUT US",
  },
  {
    id: 6,
    nav: "PRICING+PROMOS",
  },
  {
    id: 7,
    nav: "MEMBERSHIPS",
  },
];

const Header = () => {
  return (
    <>
      <header>
        <section className="d-flex aero-col-3">
          <div className="aero-menu-location app-container">
            <div className="aero-menuicon">
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL6ocklp_Ze3faHnpHjOToVchhfKJLP1f2wyLszfDJobAyr-Y5xrigw6am_-SdNMKAynA&usqp=CAU"
                alt="location"
                height="30"
              />
            </div>
            <div>fag</div>
          </div>
          <div className="desktop-container">
            <div className="aero-menu-location">
              <div className="aero-d-changelocation">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL6ocklp_Ze3faHnpHjOToVchhfKJLP1f2wyLszfDJobAyr-Y5xrigw6am_-SdNMKAynA&usqp=CAU"
                  alt="location"
                  height="30"
                />
                Change location
              </div>
              <div className="aero-faq">fag</div>
            </div>
          </div>
          <div>
            <img
              src="https://www.aerosportsparks.ca/assets/image/logo/logo_white.png"
              height="71"
              alt="logo"
              title="logo"
            />
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
        <nav className="d-flex-center aero-list-7">
          <div className="desktop-container">
            {navList &&
              navList.map((item) => {
                return (
                  <Link href="#" key={item.id}>
                    {item.nav}
                  </Link>
                );
              })}
          </div>
          <div className="aero-app-changelocation app-container">
            Change location
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
